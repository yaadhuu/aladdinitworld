import { getUnits } from '@/lib/products';
import { getFaqs } from '@/lib/faq';
import { getReviews } from '@/lib/reviews';
import { ozyReply } from '@/lib/ozy';

export const runtime = 'nodejs';

/*
  Ozy, the chat assistant. Completely free: no AI service, no API key. Every reply comes from Ozy's
  built-in understanding (src/lib/ozy.ts) of the site's own data: live stock, grades, FAQ, hours and
  reviews. To teach Ozy more, add FAQs in the Studio or add a rule in src/lib/ozy.ts.
*/

// shortcut: in-memory limit per server instance; move to a shared store (e.g. Upstash Redis) when deployed on several instances.
// A cap on chat requests per visitor, checked before the body is read, so the endpoint cannot be used
// to flood the server. A real visitor never gets near it.
const WINDOW = 10 * 60_000;
const PER_IP = 60; // requests per visitor per 10 minutes
const MAX_KEYS = 5000;
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  // Evict stale visitors so the map cannot grow without bound
  if (hits.size > MAX_KEYS) {
    for (const [k, ts] of hits) if (!ts.length || now - ts[ts.length - 1] >= WINDOW) hits.delete(k);
    if (hits.size > MAX_KEYS) hits.clear();
  }
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  // the shared 'direct' bucket (no trusted proxy) gets 10x
  const over = recent.length >= (ip === 'direct' ? PER_IP * 10 : PER_IP);
  if (!over) recent.push(now);
  hits.set(ip, recent);
  return over;
}

// Client IP from the proxy, not the client: x-real-ip (set by Vercel and most proxies),
// else the rightmost x-forwarded-for hop, which the nearest proxy appended.
// The headers are trusted only behind a proxy that overwrites them: Vercel (sets VERCEL) or set TRUSTED_PROXY=1.
// Anywhere else a visitor could fake them to dodge the per-visitor limit, so all callers share one bucket ('direct').
const TRUST_PROXY = !!process.env.VERCEL || process.env.TRUSTED_PROXY === '1';
function clientIp(req: Request) {
  if (!TRUST_PROXY) return 'direct';
  const real = req.headers.get('x-real-ip')?.trim();
  if (real) return real;
  const hops = req.headers.get('x-forwarded-for')?.split(',').map((h) => h.trim()).filter(Boolean);
  return hops?.length ? hops[hops.length - 1] : 'direct';
}

// Only this site's own pages may call the assistant
function sameOrigin(req: Request) {
  const origin = req.headers.get('origin');
  if (!origin) return false;
  try { return new URL(origin).host === (req.headers.get('x-forwarded-host') ?? req.headers.get('host')); } catch { return false; }
}

// Reads the body as a stream and stops as soon as it passes `max` bytes, whatever the headers claim
async function readCapped(req: Request, max: number): Promise<string | null> {
  if (!req.body) return '';
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > max) { await reader.cancel(); return null; }
    chunks.push(value);
  }
  const all = new Uint8Array(size);
  let at = 0;
  for (const c of chunks) { all.set(c, at); at += c.byteLength; }
  return new TextDecoder().decode(all);
}

type Turn = { role: 'user' | 'assistant'; content: string };

function clean(body: unknown): Turn[] | null {
  const raw = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(raw)) return null;
  const turns = raw
    .filter((m): m is Turn => !!m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim() !== '')
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 1200) }));
  while (turns.length && turns[0].role !== 'user') turns.shift();
  if (!turns.length || turns[turns.length - 1].role !== 'user') return null;
  return turns;
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return Response.json({ error: 'forbidden' }, { status: 403 });
  if (limited(clientIp(req))) return Response.json({ error: 'rate_limited' }, { status: 429 });
  // Refuse oversized bodies (12 turns of 1,200 characters fit well inside 32 KB): the header check is
  // a fast path, the capped stream read is the real limit
  if (Number(req.headers.get('content-length') ?? 0) > 32_000) return Response.json({ error: 'too_large' }, { status: 413 });

  let body: unknown;
  try {
    const raw = await readCapped(req, 32_000);
    if (raw === null) return Response.json({ error: 'too_large' }, { status: 413 });
    body = JSON.parse(raw);
  } catch { return Response.json({ error: 'bad_request' }, { status: 400 }); }
  const messages = clean(body);
  if (!messages) return Response.json({ error: 'bad_request' }, { status: 400 });

  const [{ units }, faqs, reviews] = await Promise.all([getUnits(), getFaqs(), getReviews()]);
  return new Response(ozyReply(messages, units, faqs, reviews), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}
