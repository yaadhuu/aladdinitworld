import { pageMeta } from '@/lib/seo';
import { SITE_CONFIG } from '@/config';
import { ArrowRightIcon, GoogleIcon } from '@/components/Icons';
import { waLink } from '@/lib/whatsapp';
import { getReviews } from '@/lib/reviews';

// Static, rebuilt in the background about every 60 seconds
export const revalidate = 60;

// TODO(owner): replace with the real Google reviews link from the Business Profile
// (Google Business Profile → "Get more reviews" → share link).
const GOOGLE_REVIEWS_URL =
  'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Aladdin IT World, Koduvally, Kerala');

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

export const metadata = pageMeta({
  title: "Reviews from MacBook Buyers | Aladdin IT World",
  description: "Read reviews from MacBook buyers of Aladdin IT World in Koduvally, Kerala, including their ratings and where each review was written.",
  path: "/reviews",
});

export default async function ReviewsPage() {
  const { rating, reviews } = SITE_CONFIG.stats;
  const list = await getReviews();
  return (
    <>
      <section className="pt-10 sm:pt-20 pb-10 sm:pb-14">
        <div className="wrap grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7 grid gap-3 sm:gap-4">
            <h1 className="t-h1 !text-[clamp(34px,3vw+22px,64px)]">Reviews from MacBook buyers</h1>
            <p className="lead">Every review here comes from a real customer, on Google or in a message to our team.</p>
          </div>
          <div className="lg:col-span-5 lg:justify-self-end grid gap-3 justify-items-start lg:justify-items-end">
            <p className="inline-flex items-center gap-3">
              <GoogleIcon className="w-6 h-6" />
              <span className="text-[34px] sm:text-[44px] font-semibold tracking-[-0.03em] leading-none tabular-nums">{rating}</span>
              <span className="text-[15px] text-[var(--ink-soft)] leading-tight">from {reviews}<br />Google reviews</span>
            </p>
            <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="link text-[15px]">
              See all on Google
              <ArrowRightIcon className="w-4 h-4" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </section>

      <section aria-label="Customer reviews" className="py-10 sm:py-20 bg-[var(--surface)]">
        <ul className="wrap columns-1 md:columns-2 lg:columns-3 gap-4 sm:gap-5">
          {list.map((r) => (
            <li key={r.name + r.text.slice(0, 12)} className="break-inside-avoid mb-4 sm:mb-5">
              <figure className="card p-6 sm:p-7 gap-4">
                <Stars n={r.rating} />
                <blockquote className="text-[16px] leading-[1.6] text-[var(--ink)]">&ldquo;{r.text}&rdquo;</blockquote>
                <figcaption className="pt-4 border-t border-[var(--line)] text-[14px]">
                  <span className="font-medium">{r.name}</span>
                  <span className="text-[var(--muted)]"> · {[r.role, r.source].filter(Boolean).join(', ')}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      <section className="py-14 sm:py-20">
        <div className="wrap grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7 grid gap-3">
            <h2 className="t-h2">Bought a MacBook from us?</h2>
            <p className="lead">Tell us how it is going. A short message helps the next buyer choose with confidence.</p>
          </div>
          <div className="lg:col-span-5 lg:justify-self-end btn-row">
            <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="btn btn--primary">Review us on Google</a>
            <a href={waLink('Hi, I bought a MacBook from you and would like to share my experience.')} target="_blank" rel="noopener noreferrer" className="btn btn--secondary">Message us</a>
          </div>
        </div>
      </section>
    </>
  );
}
