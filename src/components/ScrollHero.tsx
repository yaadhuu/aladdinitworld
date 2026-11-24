'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Full-bleed scroll-driven hero. The media is a background; `children` (headline,
 * CTAs) are real HTML laid on top.
 *
 * Tiers, chosen at runtime:
 *   1. video  - all-intra MP4, currentTime follows scroll (sharpest, smoothest)
 *   2. canvas - AVIF/WebP frame sequence (low-end devices, or if the video fails)
 *   3. poster - single image (reduced motion, Data Saver, 2G)
 * Only ONE set is ever downloaded: mobile, or desktop from 1024px up.
 */

export type MediaSet = {
  /** Frame folder under /public, e.g. "/hero/m" (f_00.avif/.webp ..., poster.avif/.webp) */
  basePath: string;
  count: number;
  width: number;
  height: number;
  /** All-intra MP4, e.g. "/hero/video/hero-m.mp4". Optional: without it, frames are used. */
  video?: string;
};

type Props = {
  mobile: MediaSet;
  desktop?: MediaSet;
  alt: string;
  /** Fraction of the hero height scrolled before the sequence ends. */
  scrollRange?: number;
  /** Source fps of the video and which source frame the poster shows (matches the export). */
  videoFps?: number;
  videoStartFrame?: number;
  /** Section classes (height, etc). Default: tall hero. */
  className?: string;
  /** Position/mask of the media layer, e.g. "lg:left-[35%] lg:[mask-image:linear-gradient(to_right,transparent,#000_30%)]" */
  mediaClassName?: string;
  grainSrc?: string;
  children?: ReactNode;
};

const DESKTOP_QUERY = '(min-width: 1024px)';
const pad = (n: number) => String(n).padStart(2, '0');

function supportsAvif(): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.width === 1);
    img.onerror = () => resolve(false);
    img.src =
      'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  });
}

type Nav = Navigator & {
  connection?: { saveData?: boolean; effectiveType?: string };
  deviceMemory?: number;
};

function shouldSkipMotion(): boolean {
  if (typeof window === 'undefined') return true;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  const c = (navigator as Nav).connection;
  if (c?.saveData) return true;
  if (c?.effectiveType === 'slow-2g' || c?.effectiveType === '2g') return true;
  return false;
}

function isLowEnd(): boolean {
  const n = navigator as Nav;
  return (n.deviceMemory ?? 8) < 4 || (navigator.hardwareConcurrency ?? 8) <= 2;
}

export default function ScrollHero({
  mobile,
  desktop,
  alt,
  scrollRange = 0.6,
  videoFps = 24,
  videoStartFrame = 4,
  className = 'min-h-[100svh]',
  mediaClassName = 'inset-0',
  grainSrc = '/hero/grain.png',
  children,
}: Props) {
  const mobileKey = JSON.stringify(mobile);
  const desktopKey = JSON.stringify(desktop ?? null);
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<'poster' | 'canvas' | 'video'>('poster');

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!root || !canvas || !video || shouldSkipMotion()) return;

    const set = desktop && window.matchMedia(DESKTOP_QUERY).matches ? desktop : mobile;

    let cancelled = false;
    let visible = true;
    let raf = 0;
    let target = 0;
    let current = 0;
    let apply: (p: number) => void = () => {};
    const cleanups: (() => void)[] = [];

    const measure = () => {
      const rect = root.getBoundingClientRect();
      target = Math.min(1, Math.max(0, -rect.top / (rect.height * scrollRange)));
    };
    const tick = () => {
      raf = 0;
      current += (target - current) * 0.14;
      if (Math.abs(target - current) < 0.0008) current = target;
      apply(current);
      if (current !== target && visible) raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      measure();
      if (!raf && visible) raf = requestAnimationFrame(tick);
    };

    // ---------- tier 2: frame sequence on canvas ----------
    const startFrames = async () => {
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx || cancelled) return;
      canvas.width = set.width;
      canvas.height = set.height;
      const frames: (HTMLImageElement | undefined)[] = new Array(set.count);
      let drawn = -1;

      apply = (p) => {
        const i = Math.round(p * (set.count - 1));
        let img: HTMLImageElement | undefined;
        for (let k = i; k >= 0 && !img; k--) img = frames[k];
        for (let k = i + 1; k < set.count && !img; k++) img = frames[k];
        if (!img || drawn === i) return;
        ctx.drawImage(img, 0, 0, set.width, set.height);
        drawn = i;
      };

      const ext = (await supportsAvif()) ? 'avif' : 'webp';
      const load = (i: number) =>
        new Promise<void>((resolve) => {
          if (cancelled || frames[i]) return resolve();
          const img = new Image();
          img.decoding = 'async';
          img.src = `${set.basePath}/f_${pad(i)}.${ext}`;
          img
            .decode()
            .then(() => {
              frames[i] = img;
            })
            .catch(() => {})
            .finally(resolve);
        });

      await load(0);
      if (cancelled) return;
      setMode('canvas');
      measure();
      current = target;
      apply(current);

      const order: number[] = [];
      for (let i = 3; i < set.count; i += 3) order.push(i);
      for (let i = 1; i < set.count; i++) if (i % 3 !== 0) order.push(i);
      const idle: (cb: () => void) => void =
        'requestIdleCallback' in window
          ? (cb) => (window as Window & { requestIdleCallback: (f: () => void) => void }).requestIdleCallback(cb)
          : (cb) => setTimeout(cb, 40);
      for (const i of order) {
        if (cancelled) return;
        await new Promise<void>((r) => idle(r));
        await load(i);
      }
    };

    // ---------- tier 1: scrubbed video ----------
    const startVideo = (src: string) => {
      const start = videoStartFrame / videoFps;
      let ok = false;

      apply = (p) => {
        const dur = video.duration;
        if (!dur || video.seeking) return;
        const t = start + p * (dur - start - 0.02);
        if (Math.abs(video.currentTime - t) > 0.5 / videoFps) video.currentTime = t;
      };
      const onSeeked = () => apply(current);
      const onReady = () => {
        if (cancelled || ok) return;
        ok = true;
        setMode('video');
        measure();
        current = target;
        apply(current);
      };
      const onError = () => {
        if (ok || cancelled) return;
        video.removeAttribute('src');
        video.load();
        void startFrames();
      };

      video.addEventListener('seeked', onSeeked);
      video.addEventListener('loadeddata', onReady);
      video.addEventListener('error', onError);
      cleanups.push(() => {
        video.removeEventListener('seeked', onSeeked);
        video.removeEventListener('loadeddata', onReady);
        video.removeEventListener('error', onError);
        video.pause();
        video.removeAttribute('src');
        video.load();
      });

      video.muted = true;
      video.playsInline = true;
      video.preload = 'auto';
      video.src = src;
      video.load();
      // iOS Safari only decodes frames for seeking after a muted play/pause.
      video.play().then(() => video.pause()).catch(() => {});
      // If the video never becomes usable, fall back to frames.
      const t = setTimeout(() => {
        if (!ok && !cancelled) onError();
      }, 8000);
      cleanups.push(() => clearTimeout(t));
    };

    const useVideo = !!set.video && !isLowEnd();
    // Let the poster paint first, then fetch the heavy media.
    const go = () => {
      if (cancelled) return;
      if (useVideo && set.video) startVideo(set.video);
      else void startFrames();
    };
    const idleStart: number | undefined =
      'requestIdleCallback' in window
        ? (window as Window & { requestIdleCallback: (f: () => void) => number }).requestIdleCallback(go)
        : (setTimeout(go, 200) as unknown as number);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) kick();
    });
    io.observe(root);
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if ('cancelIdleCallback' in window && idleStart !== undefined)
        (window as Window & { cancelIdleCallback: (h: number) => void }).cancelIdleCallback(idleStart);
      cleanups.forEach((fn) => fn());
      io.disconnect();
      window.removeEventListener('scroll', kick);
      window.removeEventListener('resize', kick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileKey, desktopKey, scrollRange, videoFps, videoStartFrame]);

  const m = mobile;
  const d = desktop;
  const layer = `absolute h-full w-full object-cover ${mediaClassName}`;

  return (
    <section ref={rootRef} className={`relative w-full overflow-hidden bg-[#0A0A0A] ${className}`}>
      {/* Poster = LCP element */}
      <picture className={mode === 'poster' ? '' : 'invisible'}>
        {d && (
          <>
            <source media={DESKTOP_QUERY} srcSet={`${d.basePath}/poster.avif`} type="image/avif" />
            <source media={DESKTOP_QUERY} srcSet={`${d.basePath}/poster.webp`} type="image/webp" />
          </>
        )}
        <source srcSet={`${m.basePath}/poster.avif`} type="image/avif" />
        <source srcSet={`${m.basePath}/poster.webp`} type="image/webp" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${m.basePath}/poster.webp`}
          alt={alt}
          width={m.width}
          height={m.height}
          fetchPriority="high"
          decoding="async"
          className={layer}
        />
      </picture>

      <canvas ref={canvasRef} aria-hidden="true" className={`${layer} ${mode === 'canvas' ? '' : 'invisible'}`} />
      <video
        ref={videoRef}
        aria-hidden="true"
        muted
        playsInline
        preload="none"
        tabIndex={-1}
        className={`${layer} ${mode === 'video' ? '' : 'invisible'}`}
      />

      {/* Grain: dithers the dark gradient so it doesn't band */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{ backgroundImage: `url(${grainSrc})`, backgroundSize: '256px 256px' }}
      />

      {/* Content sits above the media */}
      <div className="relative z-10 h-full min-h-[inherit]">{children}</div>
    </section>
  );
}
