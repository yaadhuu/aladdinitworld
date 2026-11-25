'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * A figure like "2,000+" or "500,000+ L" that counts up once when it scrolls into view.
 * The server renders the final text, so it reads correctly without scripts and with reduced motion.
 */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(value);

  useEffect(() => {
    const el = ref.current;
    const m = value.match(/^([^\d]*)([\d,]+)(.*)$/);
    if (!el || !m || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const [, pre, num, post] = m;
    const target = +num.replace(/,/g, '');
    const show = (n: number) => setText(`${pre}${Math.round(n).toLocaleString('en-IN')}${post}`);
    // only animate figures still below the fold; ones already on screen stay as they are
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    show(0);
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / 1400);
        show(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) raf = requestAnimationFrame(tick); else setText(value);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value]);

  return <span ref={ref} aria-label={value}><span aria-hidden="true">{text}</span></span>;
}
