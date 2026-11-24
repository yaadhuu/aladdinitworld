'use client';

import { useMemo, useState } from 'react';
import { openChat, waLink } from '@/lib/whatsapp';

type Item = { question: string; answer: string };

/** Searchable questions on native <details> (readable without scripts). No match hands over to WhatsApp or the chat. */
export function FaqSearch({ items, limit }: { items: Item[]; limit?: number }) {
  const [q, setQ] = useState('');
  const [all, setAll] = useState(false);

  const matches = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    return items.filter((it) => words.every((w) => (it.question + ' ' + it.answer).toLowerCase().includes(w)));
  }, [q, items]);
  const shown = q || all || !limit ? matches : matches.slice(0, limit);

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <label htmlFor="faq-search" className="label">Search questions</label>
        <div className="relative">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="absolute left-5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[var(--muted)]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg>
          <input id="faq-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Warranty, EMI, exchange, delivery" autoComplete="off" className="faq-search" />
        </div>
      </div>

      {shown.length > 0 ? (
        <div className="faq border-t border-[var(--line)]">
          {shown.map((it) => (
            <details key={it.question} className="border-b border-[var(--line)]" open={q !== '' && shown.length <= 2}>
              <summary className="flex items-center justify-between gap-6 py-5 text-[17px] font-medium leading-snug">
                {it.question}
                <span aria-hidden="true" className="faq-plus" />
              </summary>
              <p className="pb-6 pr-10 text-[16px] leading-[1.65] text-[var(--ink-soft)] max-w-[64ch]">{it.answer}</p>
            </details>
          ))}
          {limit && !q && !all && matches.length > limit && (
            <button type="button" onClick={() => setAll(true)} className="link text-[15px] mt-3">
              Show all {matches.length} questions
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 py-6 border-t border-[var(--line)]">
          <p className="text-[17px]">No answer for &ldquo;{q}&rdquo; yet. Ask our team directly.</p>
          <div className="btn-row">
            <a href={waLink(q)} target="_blank" rel="noopener noreferrer" className="btn btn--primary">Ask on WhatsApp</a>
            <button type="button" onClick={openChat} className="btn btn--secondary">Ask in chat</button>
          </div>
        </div>
      )}
    </div>
  );
}
