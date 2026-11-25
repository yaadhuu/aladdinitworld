'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { SITE_CONFIG } from '@/config';
import { ArrowRightIcon, CloseIcon, WhatsAppIcon } from '@/components/Icons';
import { OzyAvatar, type OzyMood } from '@/components/OzyAvatar';
import { waLink } from '@/lib/whatsapp';
import { ozyReply } from '@/lib/ozy';

type Msg = { from: 'bot' | 'you'; text: string };

const GREETING = '[[mood:happy]]Hello, I am Ozy, the Aladdin IT World AI assistant. I can find a MacBook for your budget, explain our grades and warranty, or connect you with our team. How can I help today?';
const SUGGESTED = ['MacBooks under ₹50,000', 'What do the grades mean?', 'Do you offer EMI?', 'Where is your showroom?'];

// Replies carry [[mood:..]], [[link:href|label]] and [[handoff]] markers; split them into text, buttons and Ozy's expression
function parse(text: string) {
  const links: { href: string; label: string }[] = [];
  let handoff = false;
  let mood: OzyMood = 'neutral';
  const body = text
    .replace(/\[\[mood:(happy|sorry|thinking|neutral)\]\]/g, (_, m: OzyMood) => { mood = m; return ''; })
    .replace(/\[\[link:([^|\]]+)\|([^\]]+)\]\]/g, (_, href: string, label: string) => {
      // only this site's pages or https links, never javascript: or other schemes
      if (/^\/(?![/\\])/.test(href) || /^https:\/\//.test(href)) links.push({ href, label: label.slice(0, 40) });
      return '';
    })
    .replace(/\[\[handoff\]\]/g, () => { handoff = true; return ''; })
    .replace(/\[\[[^\]]*$/, '') // a marker still streaming in
    .trim();
  return { body, links, handoff, mood };
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'bot', text: GREETING }]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener('open-chat', onOpen);
    return () => window.removeEventListener('open-chat', onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => { listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }); }, [msgs]);

  // Streams the reply from /api/chat into the last bubble. If the server cannot be reached (a bad
  // connection, a deploy in progress) it tries once more, then Ozy answers right here in the browser.
  const ask = async (q: string) => {
    const t = q.trim();
    if (!t || busy) return;
    const history = [...msgs.slice(1), { from: 'you' as const, text: t }]
      .map((m) => ({ role: m.from === 'you' ? 'user' as const : 'assistant' as const, content: m.text }));
    setMsgs((m) => [...m, { from: 'you', text: t }, { from: 'bot', text: '' }]);
    setInput('');
    setBusy(true);
    const setLast = (fn: (prev: string) => string) => setMsgs((m) => [...m.slice(0, -1), { from: 'bot', text: fn(m[m.length - 1].text) }]);
    const started = Date.now();
    const post = () => fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history }) });
    let wrote = false;
    try {
      let res = await post().catch(() => null);
      if (!res?.ok || !res.body) { await new Promise((r) => setTimeout(r, 700)); res = await post(); }
      if (!res.ok || !res.body) throw new Error(String(res.status));
      // a short pause so an instant answer still reads as a reply, not a flash
      await new Promise((r) => setTimeout(r, Math.max(0, 450 - (Date.now() - started))));
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (chunk) wrote = true;
        setLast((prev) => prev + chunk);
      }
    } catch {
      // live stock unknown here (null): Ozy still handles greetings, grades, warranty, hours and the FAQ
      if (!wrote) setLast(() => ozyReply(history, null, SITE_CONFIG.faqItems, SITE_CONFIG.customerReviews));
    } finally {
      setBusy(false);
    }
  };

  const lastBot = [...msgs].reverse().find((m) => m.from === 'bot' && m.text);
  const face: OzyMood = busy ? 'thinking' : lastBot ? parse(lastBot.text).mood : 'happy';
  const lastQuestion = [...msgs].reverse().find((m) => m.from === 'you')?.text;

  return (
    <>
      {/* Launcher: bottom right on every screen */}
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="chat-panel"
        aria-label={open ? 'Close chat with Ozy' : 'Chat with Ozy, our assistant'} className="chat-launcher inline-flex">
        {open ? <CloseIcon className="w-5 h-5" /> : <OzyAvatar className="w-full h-full" follow />}
      </button>

      <div id="chat-panel" role="dialog" aria-modal="false" aria-label="Chat with Ozy" hidden={!open} className="chat-panel">
        <div className="flex items-center gap-2.5 px-4 h-14 border-b border-[var(--line)] flex-none">
          <span className="relative flex-none">
            <OzyAvatar mood={face} className="w-8 h-8" follow />
            <span className="absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 rounded-full bg-[#1a9e4b] border-2 border-white" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-semibold leading-tight">Ozy</p>
            <p className="text-[12px] text-[var(--muted)] leading-tight truncate">{busy ? 'Typing…' : 'Online · Aladdin IT World assistant'}</p>
          </div>
          <a href={waLink()} target="_blank" rel="noopener noreferrer" aria-label="Message our team on WhatsApp" className="w-9 h-9 inline-flex items-center justify-center rounded-full transition-colors hover:bg-[var(--surface)]">
            <WhatsAppIcon className="w-[18px] h-[18px]" />
          </a>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="w-9 h-9 -mr-1.5 inline-flex items-center justify-center rounded-full transition-colors hover:bg-[var(--surface)]">
            <CloseIcon className="w-[18px] h-[18px]" />
          </button>
        </div>

        <div ref={listRef} data-lenis-prevent className="chat-list flex-1 overflow-y-auto px-4 py-4 grid gap-2.5 content-start" aria-live="polite">
          {msgs.map((m, i) => {
            const mine = m.from === 'you';
            const { body, links, handoff, mood } = mine ? { body: m.text, links: [], handoff: false, mood: 'neutral' as OzyMood } : parse(m.text);
            const firstOfRun = !mine && msgs[i - 1]?.from !== 'bot';
            return (
              <div key={i} className={`chat-msg flex gap-2 ${mine ? 'justify-end' : 'justify-start'}`}>
                {!mine && <span className="w-6 flex-none pt-1">{firstOfRun && <OzyAvatar mood={body ? mood : 'thinking'} className="w-6 h-6" />}</span>}
                <div className={`grid gap-2 max-w-[84%] ${mine ? 'justify-items-end' : 'justify-items-start'}`}>
                  <p className={`px-3.5 py-2 rounded-[18px] text-[14px] leading-[1.5] whitespace-pre-line break-words ${mine ? 'bg-[var(--ink)] text-[var(--inv-ink)] rounded-br-md' : 'bg-[var(--surface)] rounded-bl-md'}`}>
                    {body || <span className="chat-typing" aria-label="Ozy is typing"><i /><i /><i /></span>}
                  </p>
                  {(links.length > 0 || handoff) && (
                    <div className="flex flex-wrap gap-2">
                      {links.map((l) => l.href.startsWith('/') ? (
                        <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="chat-action">{l.label}<ArrowRightIcon className="w-3.5 h-3.5" /></Link>
                      ) : (
                        <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="chat-action">{l.label}<ArrowRightIcon className="w-3.5 h-3.5" /></a>
                      ))}
                      {handoff && (
                        <a href={waLink(lastQuestion)} target="_blank" rel="noopener noreferrer" className="chat-action chat-action--primary">
                          <WhatsAppIcon className="w-3.5 h-3.5" />Message our team
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {msgs.length === 1 && (
            <div className="grid gap-2 pt-1 pl-8">
              <p className="label">Try asking</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED.map((s) => (
                  <button key={s} type="button" onClick={() => ask(s)} className="chat-action">{s}</button>
                ))}
              </div>
            </div>
          )}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); ask(input); }} className="flex items-center gap-2 px-3 py-2.5 border-t border-[var(--line)] flex-none">
          <label htmlFor="chat-input" className="sr-only">Message Ozy</label>
          <input ref={inputRef} id="chat-input" value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Ozy about a MacBook or budget" autoComplete="off" maxLength={500} className="chat-input" />
          <button type="submit" aria-label="Send" className="w-10 h-10 flex-none rounded-full bg-[var(--ink)] text-[var(--inv-ink)] inline-flex items-center justify-center disabled:opacity-40 transition-transform active:scale-95" disabled={!input.trim() || busy}>
            <ArrowRightIcon className="w-[18px] h-[18px]" />
          </button>
        </form>
      </div>
    </>
  );
}
