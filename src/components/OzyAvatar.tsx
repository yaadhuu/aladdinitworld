'use client';

import { useEffect, useRef } from 'react';

export type OzyMood = 'neutral' | 'happy' | 'sorry' | 'thinking';

/**
 * Ozy, the site assistant: a dark orb with two eyes and nothing else. The eyes carry the feeling:
 * they blink, follow the pointer, curve up when happy, soften and droop when sorry, and look up and
 * aside while Ozy is typing.
 */
export function OzyAvatar({ mood = 'neutral', className = 'w-8 h-8', follow = false }: { mood?: OzyMood; className?: string; follow?: boolean }) {
  const look = useRef<SVGGElement>(null);

  // Eyes follow the pointer (mouse and pen only, never with reduced motion)
  useEffect(() => {
    if (!follow || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const g = look.current;
        const box = g?.ownerSVGElement?.getBoundingClientRect();
        if (!g || !box) return;
        const dx = e.clientX - (box.left + box.width / 2);
        const dy = e.clientY - (box.top + box.height / 2);
        const d = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, d / 300) * 2.2;
        g.style.transform = `translate(${(dx / d) * k}px, ${(dy / d) * k * 0.8}px)`;
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf); };
  }, [follow]);

  return (
    <svg viewBox="0 0 40 40" className={`ozy ozy--${mood} ${className}`} aria-hidden="true">
      <defs>
        <radialGradient id="ozy-orb" cx="35%" cy="28%" r="80%">
          <stop offset="0" stopColor="#48484d" />
          <stop offset="0.55" stopColor="#1d1d1f" />
          <stop offset="1" stopColor="#0b0b0c" />
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="20" fill="url(#ozy-orb)" />
      <circle cx="20" cy="20" r="19.3" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.4" />
      <g ref={look} className="ozy__look">
        {mood === 'happy' ? (
          <g fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round">
            <path d="M12.6 21.6q2.9-3.8 5.8 0" />
            <path d="M21.6 21.6q2.9-3.8 5.8 0" />
          </g>
        ) : (
          <g className="ozy__eyes" fill="#fff">
            <rect className="ozy__eye ozy__eye--l" x="13.8" y="14.4" width="3.8" height="10.2" rx="1.9" />
            <rect className="ozy__eye ozy__eye--r" x="22.4" y="14.4" width="3.8" height="10.2" rx="1.9" />
          </g>
        )}
      </g>
    </svg>
  );
}
