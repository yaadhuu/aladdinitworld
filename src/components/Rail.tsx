'use client';

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

const Arrow = ({ flip }: { flip?: boolean }) => (
  <svg viewBox="0 0 20 20" className={`w-4 h-4 ${flip ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 4l6 6-6 6" /></svg>
);

/**
 * A store shelf: compact items in one row you swipe on a phone or step through with the arrows at
 * either side. Each arrow appears only when there is more to see in its direction, so a short row
 * shows none.
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
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <div className="rail-wrap">
      <ul ref={row} onScroll={measure} className="rail" aria-label={label} data-lenis-prevent>
        {Children.map(children, (c) => <li className={itemClass}>{c}</li>)}
      </ul>
      {!edge.start && (
        <button type="button" className="round-btn rail-arrow rail-arrow--prev" onClick={() => step(-1)} aria-label={`Previous ${label}`}><Arrow flip /></button>
      )}
      {!edge.end && (
        <button type="button" className="round-btn rail-arrow rail-arrow--next" onClick={() => step(1)} aria-label={`Next ${label}`}><Arrow /></button>
      )}
    </div>
  );
}
