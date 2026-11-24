'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/** Lenis smooth scrolling for wheel input; off under reduced motion, native on touch */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // lerp 0.15: smooth on the wheel but close to native, so scroll-linked media and text keep up
    const lenis = new Lenis({ lerp: 0.15, anchors: { offset: -72 } });
    let id = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      id = requestAnimationFrame(raf);
    });
    return () => { cancelAnimationFrame(id); lenis.destroy(); };
  }, []);
  return null;
}
