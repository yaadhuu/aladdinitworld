'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { SITE_CONFIG } from '@/config';
import { ArrowRightIcon, CloseIcon } from '@/components/Icons';
import { waLink } from '@/lib/whatsapp';

type Msg = { from: 'bot' | 'you'; text: string; handoff?: boolean };

const FAQ = SITE_CONFIG.faqItems;
const SUGGESTED = [
  'What do the grades mean?',
  'Do you take my old laptop in exchange?',
  'Do you offer EMI?',
  'Where is your showroom?',
];

/** Offline answer from the FAQ by word overlap: used when the AI assistant (/api/chat) is not configured or fails */
function answer(q: string): Msg {
  const words = q.toLowerCase().match(/[a-z0-9]+/g)?.filter((w) => w.length > 2) ?? [];
  let best = { score: 0, a: '' };
  for (const f of FAQ) {
    const hay = (f.question + ' ' + f.answer).toLowerCase();
    const score = words.reduce((s, w) => s + (f.question.toLowerCase().includes(w) ? 2 : hay.includes(w) ? 1 : 0), 0);
    if (score > best.score) best = { score, a: f.answer };
  }
  return best.score >= 2
    ? { from: 'bot', text: best.a }
    : { from: 'bot', text: 'I could not find that in our answers. Our team can help you directly.', handoff: true };
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: 'bot', text: 'Hello. Ask about a MacBook, our grades, warranty, exchange or delivery.' },
  ]);
  const [input, setInput] = useState('');
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

  const [busy, setBusy] = useState(false);

  // Streams the reply from /api/chat into the last bubble; falls back to the FAQ matcher
  const ask = async (q: string) => {
    const t = q.trim();
    if (!t || busy) return;
    const history = [...msgs.slice(1), { from: 'you' as const, text: t }]
      .map((m) => ({ role: m.from === 'you' ? 'user' : 'assistant', content: m.text }));
    setMsgs((m) => [...m, { from: 'you', text: t }, { from: 'bot', text: '' }]);
    setInput('');
    setBusy(true);
    const setLast = (fn: (prev: Msg) => Msg) => setMsgs((m) => [...m.slice(0, -1), fn(m[m.length - 1])]);
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history }) });
      if (!res.ok || !res.body) throw new Error(String(res.status));
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setLast((prev) => ({ ...prev, text: prev.text + chunk }));
      }
    } catch {
      setLast(() => answer(t));
    } finally {
      setBusy(false);
    }
  };

  const lastQuestion = [...msgs].reverse().find((m) => m.from === 'you')?.text;

  return (
    <>
      {/* Launcher: bottom right on every screen */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="chat-panel"
        aria-label={open ? 'Close chat' : 'Open chat'}
        className="chat-launcher inline-flex"
      >
        {open ? <CloseIcon className="w-5 h-5" /> : (
          <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true"><path d="M20 11.5a7.5 7.5 0 0 1-10.9 6.7L4 19.5l1.4-4.6A7.5 7.5 0 1 1 20 11.5Z" /></svg>
        )}
        
      </button>

      <div id="chat-panel" role="dialog" aria-modal="false" aria-label="Chat with Aladdin IT World" hidden={!open} className="chat-panel">
        <div className="flex items-center gap-3 px-5 h-16 border-b border-[var(--line)] flex-none">
          <span className="w-9 h-9 rounded-full bg-[var(--surface)] inline-flex items-center justify-center flex-none">
            <Image src="/logo.png" alt="" width={517} height={256} className="w-6 h-auto" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-medium leading-tight">Aladdin IT World</p>
            <p className="text-[13px] text-[var(--muted)] leading-tight">Assistant · answers about MacBooks, grades and warranty</p>
          </div>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="w-10 h-10 -mr-2 inline-flex items-center justify-center rounded-full hover:bg-[var(--surface)]">
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div ref={listRef} data-lenis-prevent className="flex-1 overflow-y-auto px-5 py-5 grid gap-3 content-start" aria-live="polite">
          {msgs.map((m, i) => (
            <div key={i} className={`grid gap-2 ${m.from === 'you' ? 'justify-items-end' : 'justify-items-start'}`}>
              <p className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[15px] leading-[1.5] whitespace-pre-line ${m.from === 'you' ? 'bg-[var(--ink)] text-[var(--inv-ink)] rounded-br-md' : 'bg-[var(--surface)] rounded-bl-md'}`}>
                {m.text || <span className="chat-typing" aria-label="Typing"><i /><i /><i /></span>}
              </p>
              {m.handoff && (
                <a href={waLink(lastQuestion)} target="_blank" rel="noopener noreferrer" className="btn btn--primary btn--sm">
                  Message our team
                </a>
              )}
            </div>
          ))}
          {msgs.length === 1 && (
            <div className="grid gap-2 pt-2">
              <p className="label">Common questions</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED.map((s) => (
                  <button key={s} type="button" onClick={() => ask(s)} className="px-3.5 h-9 rounded-full border border-[var(--line)] text-[14px] hover:border-[var(--ink)] transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); ask(input); }}
          className="flex items-center gap-2 p-3 border-t border-[var(--line)] flex-none"
        >
          <label htmlFor="chat-input" className="sr-only">Your question</label>
          <input
            ref={inputRef}
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question"
            autoComplete="off"
            className="chat-input"
          />
          <button type="submit" aria-label="Send question" className="w-11 h-11 flex-none rounded-full bg-[var(--ink)] text-[var(--inv-ink)] inline-flex items-center justify-center disabled:opacity-40" disabled={!input.trim() || busy}>
            <ArrowRightIcon className="w-[18px] h-[18px]" />
          </button>
        </form>
      </div>
    </>
  );
}
