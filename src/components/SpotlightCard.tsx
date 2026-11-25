'use client';

import { useRef, type ReactNode } from 'react';

/**
 * A card with a soft light that follows the pointer. Adapted from React Bits' SpotlightCard
 * (github.com/DavidHDev/react-bits), toned down to a faint grey for a light page. Mouse and pen only;
 * touch screens and reduced motion see a plain card.
 */
export function SpotlightCard({ className = '', children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--mx', `${e.clientX - r.left}px`);
    ref.current.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <div ref={ref} onPointerMove={onMove} className={`spotlight ${className}`}>
      {children}
    </div>
  );
}
