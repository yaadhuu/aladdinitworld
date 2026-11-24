import { SITE_CONFIG } from '@/config';
import { Rating } from '@/components/Rating';
import { Reveal } from '@/components/Reveal';
import { ArrowRightIcon, ChatIcon } from '@/components/Icons';

// TODO(Yadhu/Ashwin): replace with the real Google reviews link from the Business Profile
// (Google Business Profile → "Get more reviews" → share link).
const GOOGLE_REVIEWS_URL =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('Aladdin IT World, Thamarassery, Kerala');

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark">

      <section className="py-12 sm:py-14 px-4 sm:px-6 lg:px-8 border-b border-accent/20 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto hero-seq">
          <p className="eyebrow mb-3">Reviews</p>
          <h1 className="font-display font-bold text-3xl sm:text-5xl text-black dark:text-white mb-4">
            What Our Customers Say
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg max-w-2xl">
            Real reviews from Google Business and direct customer messages. Nothing fabricated — every word here is from a real buyer.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-brand-dark">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center gap-3 mb-10 text-center">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Rating rating={5} />
              <span className="font-bold text-2xl text-black dark:text-white tabular">{SITE_CONFIG.stats.rating}</span>
              <span className="text-gray-600 dark:text-gray-400">({SITE_CONFIG.stats.reviews} reviews on Google)</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing a few featured reviews below — see all {SITE_CONFIG.stats.reviews} on{' '}
              <a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-accent font-semibold hover:underline"
              >
                Google Maps
                <ArrowRightIcon className="w-3.5 h-3.5" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
          </div>

          <h2 className="eyebrow text-center mb-8">Featured Reviews</h2>

          <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
            {SITE_CONFIG.customerReviews.map((review, idx) => (
              <Reveal key={idx} delay={(idx % 2) * 80} className="h-full">
                <figure className="h-full p-6 sm:p-7 rounded-2xl border border-accent/20 bg-white dark:bg-zinc-900 flex flex-col t-ui hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5">
                  <Rating rating={review.rating} size="sm" />
                  <blockquote className="text-gray-700 dark:text-gray-400 my-4 text-sm leading-relaxed flex-1">
                    &ldquo;{review.text}&rdquo;
                  </blockquote>
                  <div className="flex items-center justify-between gap-3 pt-4 border-t border-accent/15">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C96A)' }}
                        aria-hidden="true"
                      >
                        {initials(review.name)}
                      </div>
                      <figcaption className="min-w-0">
                        <p className="font-bold text-black dark:text-white text-sm">{review.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{review.role}</p>
                      </figcaption>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 flex-shrink-0">
                      {review.source}
                    </span>
                  </div>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-950 border-t border-accent/20">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Bought from us? We&apos;d love to hear from you.
          </p>
          <a
            href={SITE_CONFIG.social.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold"
          >
            <ChatIcon className="w-5 h-5" />
            Share Your Experience
          </a>
        </div>
      </section>
    </div>
  );
}
