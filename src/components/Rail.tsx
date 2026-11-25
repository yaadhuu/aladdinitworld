'use client';

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

const Arrow = ({ flip }: { flip?: boolean }) => (
  <svg viewBox="0 0 20 20" className={`w-4 h-4 ${flip ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 4l6 6-6 6" /></svg>
);

/**
 * A row you swipe on a phone or step through with the arrows. It snaps item by item and grows
 * with the list, so new stock just extends the row. The arrows hide when everything fits.
 */
export function Rail({ label, children, itemClass }: { label: string; children: ReactNode; itemClass: string }) {
  const row = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: true });

  const measure = useCallback(() => {
    const el = row.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const step = (dir: 1 | -1) => {
    const el = row.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: reduce ? 'auto' : 'smooth' });
  };

  const fits = edge.start && edge.end;
  return (
    <div className="grid gap-4 sm:gap-5">
      <ul ref={row} onScroll={measure} className="rail" aria-label={label} data-lenis-prevent>
        {Children.map(children, (c) => <li className={itemClass}>{c}</li>)}
      </ul>
      {!fits && (
        <div className="flex justify-end gap-2 max-sm:hidden">
          <button type="button" className="round-btn" onClick={() => step(-1)} disabled={edge.start} aria-label={`Previous ${label}`}><Arrow flip /></button>
          <button type="button" className="round-btn" onClick={() => step(1)} disabled={edge.end} aria-label={`Next ${label}`}><Arrow /></button>
        </div>
      )}
    </div>
  );
}
