'use client';

import { useId, useState } from 'react';

type Area = { title: string; checks: number; summary: string };

/**
 * The inspection areas as a picker: pick an area from the list (a swipe row on a phone)
 * and its checks show in the panel. One area is read at a time, so the section stays short.
 */
export function InspectionExplorer({ areas }: { areas: Area[] }) {
  const [i, setI] = useState(0);
  const id = useId();
  const a = areas[i];
  const total = areas.reduce((s, x) => s + x.checks, 0);
  const pick = (n: number) => {
    setI(n);
    // keep the chosen pill in view on the phone row, without moving the page
    const el = document.getElementById(`${id}-t${n}`);
    const row = el?.parentElement;
    if (el && row && row.scrollWidth > row.clientWidth) row.scrollTo({ left: el.offsetLeft - row.clientWidth / 2 + el.offsetWidth / 2, behavior: 'smooth' });
  };
  const step = (d: number) => pick((i + d + areas.length) % areas.length);

  return (
    <div className="grid gap-4 lg:grid-cols-12 lg:gap-6">
      <div role="tablist" aria-label="Inspection areas" aria-orientation="vertical"
        className="insp-list lg:col-span-5"
        onKeyDown={(e) => {
          if (['ArrowDown', 'ArrowRight'].includes(e.key)) { e.preventDefault(); step(1); }
          if (['ArrowUp', 'ArrowLeft'].includes(e.key)) { e.preventDefault(); step(-1); }
        }}>
        {areas.map((x, n) => (
          <button key={x.title} type="button" role="tab" id={`${id}-t${n}`} aria-selected={n === i} aria-controls={`${id}-p`} tabIndex={n === i ? 0 : -1}
            onClick={() => pick(n)} className="insp-tab">
            <span className="truncate">{x.title}</span>
            <span className="insp-tab__n tabular-nums">{x.checks}</span>
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`${id}-p`} aria-labelledby={`${id}-t${i}`} className="lg:col-span-7 rounded-[var(--r-lg)] bg-white p-6 sm:p-9 grid gap-6 content-start">
        <div className="flex items-start justify-between gap-4">
          <div className="grid gap-1">
            <p className="label tabular-nums">Area {i + 1} of {areas.length}</p>
            <h3 key={a.title} className="insp-fade text-[22px] sm:text-[28px] font-semibold tracking-[-0.02em] leading-tight">{a.title}</h3>
          </div>
          <div className="flex gap-2 flex-none">
            <button type="button" className="round-btn" onClick={() => step(-1)} aria-label="Previous area">
              <svg viewBox="0 0 20 20" className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 4l6 6-6 6" /></svg>
            </button>
            <button type="button" className="round-btn" onClick={() => step(1)} aria-label="Next area">
              <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 4l6 6-6 6" /></svg>
            </button>
          </div>
        </div>
        <p key={a.summary} className="insp-fade text-[16px] sm:text-[18px] leading-[1.6] text-[var(--ink-soft)] max-w-[52ch]">{a.summary}</p>
        <div className="grid gap-2 pt-5 border-t border-[var(--line)]">
          <div className="flex items-baseline justify-between text-[14px]">
            <span className="font-medium">{a.checks} checks in this area</span>
            <span className="text-[var(--muted)] tabular-nums">{total} core checks in all</span>
          </div>
          {/* Every area's share of the core checks, the chosen one in black */}
          <div className="flex gap-[3px] h-2" aria-hidden="true">
            {areas.map((x, n) => (
              <span key={x.title} style={{ flexGrow: x.checks }} className={`rounded-full transition-colors duration-300 ${n === i ? 'bg-[var(--ink)]' : 'bg-[#e3e3e8]'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
