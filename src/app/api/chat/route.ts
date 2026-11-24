import Anthropic from '@anthropic-ai/sdk';
import { SITE_CONFIG, TIERS, BUSINESS_HOURS } from '@/config';
import { ALL_PRODUCTS, gradesOf, warrantyShort } from '@/lib/products';

export const runtime = 'nodejs';

/*
  Shop assistant for the chat panel. The system prompt is built once from the site's own data
  (stock, grades, FAQ, hours), so the bot answers from the same facts the pages show.
  To train it further, add facts to src/config (FAQ items, products) or to EXTRA_NOTES below.
*/

// Owner notes the bot should know that are not on the site yet. Add lines here.
const EXTRA_NOTES: string[] = [];

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

function buildSystemPrompt() {
  const stock = ALL_PRODUCTS.map((p) => {
    const grades = gradesOf(p)
      .map((g) => `${TIERS[g].label.replace('CPO ', '')} ${inr(p.tiers[g]?.price ?? 0)} (${warrantyShort(g)} warranty)`)
      .join('; ');
    return `- ${p.name} | ${p.chip} | ${p.specs.join(', ')} | ${grades}`;
  }).join('\n');

  const grades = Object.values(TIERS)
    .map((t) => `- ${t.label.replace('CPO ', '')}: ${t.description} Includes: ${t.includes.join('; ')}.${t.caveats.length ? ` Note: ${t.caveats.join('; ')}.` : ''}`)
    .join('\n');

  const faq = SITE_CONFIG.faqItems.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n');
  const hours = Object.entries(BUSINESS_HOURS).map(([d, h]) => `${d}: ${h}`).join(', ');
  const { social, showroom } = SITE_CONFIG;

  return `You are the shop assistant on the website of Aladdin IT World, a store in Koduvally, Kerala that sells certified pre-owned MacBooks and delivers across India. Visitors are often on their phone and came from an ad.

How to answer:
- Be warm, calm and brief: two to four short sentences, plain text, no emoji, no markdown headings or bullet symbols.
- Answer only from the facts below. Never invent stock, prices, discounts, warranty terms or delivery times. If something is not covered, say you are not sure and suggest messaging the team on WhatsApp (${social.phone}).
- Prices are in Indian rupees, written like ₹41,999.
- When someone is ready to buy, wants live photos, a battery report, an exchange value or a bulk quote, tell them the team will help on WhatsApp.
- Reply in the visitor's language (for example Malayalam or Hindi) when they write in it.
- Stay on topic: MacBooks, this shop, buying, warranty, service, exchange and delivery. Politely decline anything else.

Contact: WhatsApp and phone ${social.phone}, email ${social.email}.
Showroom: ${showroom.lines.join(', ')}. Hours: ${hours}.

Grades:
${grades}

MacBooks in stock (name | chip | specs | grade, price, warranty):
${stock}

Questions and answers:
${faq}
${EXTRA_NOTES.length ? `\nOwner notes:\n${EXTRA_NOTES.map((n) => `- ${n}`).join('\n')}` : ''}`;
}

const SYSTEM = buildSystemPrompt();

// shortcut: in-memory rate limit per server instance; move to a shared store (e.g. Redis) when deployed on several instances.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 30;
}

type Turn = { role: 'user' | 'assistant'; content: string };

function clean(body: unknown): Anthropic.Beta.BetaMessageParam[] | null {
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
  // No key configured: the panel falls back to its built-in FAQ answers
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    return Response.json({ error: 'not_configured' }, { status: 503 });
  }
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
  if (limited(ip)) return Response.json({ error: 'rate_limited' }, { status: 429 });

  let body: unknown;
  try { body = await req.json(); } catch { return Response.json({ error: 'bad_request' }, { status: 400 }); }
  const messages = clean(body);
  if (!messages) return Response.json({ error: 'bad_request' }, { status: 400 });

  const client = new Anthropic();
  const encoder = new TextEncoder();
  const SORRY = `Sorry, I could not answer that right now. Please message our team on WhatsApp at ${SITE_CONFIG.social.phone}.`;

  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      let wrote = false;
      try {
        const stream = client.beta.messages.stream({
          model: 'claude-opus-5-5',
          max_tokens: 1024,
          betas: ['server-side-fallback-2026-07-01'],
          fallbacks: 'default',
          output_config: { effort: 'low' },
          system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
          messages,
        });
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text));
            wrote = true;
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === 'refusal' || !wrote) controller.enqueue(encoder.encode(wrote ? `\n\n${SORRY}` : SORRY));
      } catch (error) {
        if (error instanceof Anthropic.APIError) console.error(`chat: API error ${error.status}`, error.message);
        else console.error('chat: error', error);
        controller.enqueue(encoder.encode(wrote ? `\n\n${SORRY}` : SORRY));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } });
}
