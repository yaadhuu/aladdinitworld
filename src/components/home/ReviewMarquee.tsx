type Review = { name: string; role: string; source: string; rating: number; text: string };

function Stars({ n }: { n: number }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="w-4 h-4" aria-hidden="true">
          <path fill={i < n ? 'var(--ink)' : '#d2d2d7'} d="M10 1.6 12.6 7l5.9.6-4.4 4 1.3 5.8L10 14.5l-5.4 2.9 1.3-5.8-4.4-4L7.4 7z" />
        </svg>
      ))}
    </span>
  );
}

function Card({ r }: { r: Review }) {
  return (
    <figure className="h-full flex flex-col gap-4 p-6 sm:p-7 rounded-[var(--r-lg)] bg-white">
      <Stars n={r.rating} />
      <blockquote className="text-[15px] sm:text-[16px] leading-[1.6] text-[var(--ink)] flex-1">
        &ldquo;{r.text}&rdquo;
      </blockquote>
      <figcaption className="text-[13px] sm:text-[14px]">
        <span className="font-medium">{r.name}</span>
        <span className="text-[var(--muted)]"> · {[r.role, r.source].filter(Boolean).join(', ')}</span>
      </figcaption>
    </figure>
  );
}

/**
 * Reviews drifting slowly across the screen. The list is rendered twice so the loop is seamless;
 * the copy is hidden from screen readers. Hover or focus pauses it, and with reduced motion it
 * becomes a plain row you swipe.
 */
export function ReviewMarquee({ reviews }: { reviews: Review[] }) {
  const copy = (hidden: boolean) =>
    reviews.map((r, i) => (
      <li key={`${hidden ? 'b' : 'a'}${i}`} aria-hidden={hidden || undefined} className="marquee__item">
        <Card r={r} />
      </li>
    ));
  return (
    <div className="marquee" style={{ ['--marquee-time' as string]: `${Math.max(30, reviews.length * 9)}s` }}>
      <ul className="marquee__track" aria-label="Customer reviews" tabIndex={0}>
        {copy(false)}
        {copy(true)}
      </ul>
    </div>
  );
}
