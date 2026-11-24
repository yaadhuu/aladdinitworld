'use client';

import { useState } from 'react';

type Review = { name: string; role: string; source: string; rating: number; text: string };

function Stars({ n }: { n: number }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="w-4 h-4" aria-hidden="true">
          <path fill={i < n ? 'var(--ink)' : 'var(--line)'} d="M10 1.6 12.6 7l5.9.6-4.4 4 1.3 5.8L10 14.5l-5.4 2.9 1.3-5.8-4.4-4L7.4 7z" />
        </svg>
      ))}
    </span>
  );
}

function Card({ r, hidden }: { r: Review; hidden?: boolean }) {
  return (
    <figure
      aria-hidden={hidden || undefined}
      className="w-[300px] sm:w-[400px] flex-none flex flex-col gap-5 p-7 sm:p-8 rounded-[var(--r-lg)] bg-[var(--surface)]"
    >
      <Stars n={r.rating} />
      <blockquote className="text-[17px] leading-[1.6] text-[var(--ink)] line-clamp-5 flex-1">
        &ldquo;{r.text}&rdquo;
      </blockquote>
      <figcaption className="text-[15px]">
        <span className="font-medium">{r.name}</span>
        <span className="text-[var(--muted)]"> · {r.role}, {r.source}</span>
      </figcaption>
    </figure>
  );
}

/**
 * One slow row; pauses on hover and by its button. A second row comes back once there are enough
 * reviews that two rows never show the same one at once (8 or more).
 */
export function ReviewMarquee({ reviews }: { reviews: Review[] }) {
  const [paused, setPaused] = useState(false);

  return (
    <div className="grid gap-6">
      <div className="marquee" data-paused={paused} style={{ ['--dur' as string]: `${reviews.length * 14}s` }}>
        {/* The set twice for a seamless loop; the copy is hidden from screen readers */}
        <div className="marquee__track">
          {reviews.map((r) => <Card key={`a-${r.name}`} r={r} />)}
          {reviews.map((r) => <Card key={`b-${r.name}`} r={r} hidden />)}
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="link text-[15px] motion-reduce:hidden"
        >
          {paused ? 'Play reviews' : 'Pause reviews'}
        </button>
      </div>
    </div>
  );
}
