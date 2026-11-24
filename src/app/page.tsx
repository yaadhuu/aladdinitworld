/*
  Home. Visual thesis: the MacBook on black, then a calm white and grey retail store around it.
  Gold lives only in the lamp mark. One primary action per screen.
  Hero: the owner's 30-frame render of two MacBooks closing, scrubbed by scroll. Exchange photo: Unsplash stand-in.
*/
import Link from 'next/link';
import Image from 'next/image';
import { SITE_CONFIG } from '@/config';
import { ArrowRightIcon, GoogleIcon, MailIcon, PinIcon } from '@/components/Icons';
import { ProductCard } from '@/components/ProductCard';
import { ChatButton } from '@/components/ChatButton';
import { ReviewMarquee } from '@/components/home/ReviewMarquee';
import { FaqSearch } from '@/components/home/FaqSearch';
import ScrollHero, { type MediaSet } from '@/components/ScrollHero';
import { waLink } from '@/lib/whatsapp';
import { ALL_PRODUCTS } from '@/lib/products';

const PHOTOS = {
  exchange: '/img/home/impact.jpg', // Unsplash 1602080858428-57174f9431cf
};

// Three models with three different pictures: the client's own unit, Intel, the newest Apple silicon
const FEATURED_IDS = ['macbook-pro-m1-pro-14-16gb', 'macbook-pro-i7', 'macbook-pro-m2-pro-14-16gb'];
const featured = FEATURED_IDS.map((id) => ALL_PRODUCTS.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => !!p);

// Frame folders under /public/hero, with the scrub-ready videos (tier 1). The last frames (the closed pair turning) are cut:
// videos trimmed to 84 frames, frame counts set to match (originals in _backup-hero-v2).
const HERO_MOBILE: MediaSet = { basePath: '/hero/m', count: 27, width: 720, height: 900, video: '/hero/video/hero-m.mp4' };
const HERO_DESKTOP: MediaSet = { basePath: '/hero/d', count: 43, width: 1280, height: 582, video: '/hero/video/hero-d.mp4' };

const lineIcon = 'w-5 h-5 flex-none text-[var(--ink)]';
const ChatLine = () => (
  <svg viewBox="0 0 24 24" className={lineIcon} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true"><path d="M20 11.5a7.5 7.5 0 0 1-10.9 6.7L4 19.5l1.4-4.6A7.5 7.5 0 1 1 20 11.5Z" /></svg>
);

export default function Home() {
  const { showroom } = SITE_CONFIG;
  return (
    <>
      {/* ── Hero: one dark scene, the MacBooks close as you scroll (ScrollHero: video, frames or poster) ── */}
      <div id="hero">
        <ScrollHero
          mobile={HERO_MOBILE}
          desktop={HERO_DESKTOP}
          alt="Two Space Black MacBook Pro laptops, open"
          scrollRange={0.7}
          className="hero2 min-h-[100svh]"
          mediaClassName="hero-media"
        >
          <div className="hero2__scrim" aria-hidden="true" />
          <div className="wrap hero2__inner">
            <div className="hero2__head" data-enter>
              <h1>Certified pre&#8209;owned MacBooks</h1>
              {/* TODO(owner): warranty, "100+ point inspection" and "5-year service plan" are not confirmed, so they are left out of the hero */}
              <p className="hero2__lead">Inspected and graded in Kerala. Delivered across India.</p>
            </div>
            <div className="hero2__foot">
              <div className="btn-row">
                <Link href="/products" className="btn btn--primary">Shop MacBooks</Link>
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn--secondary">Ask a specialist</a>
              </div>
            </div>
          </div>
        </ScrollHero>
      </div>

      {/* ── MacBooks in stock ── */}
      <section id="stock" className="py-14 sm:py-28 bg-[var(--surface)]">
        <div className="wrap">
          <div className="sec-head lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8 grid gap-3">
              <h2 className="t-h2">MacBook Pro models in stock</h2>
              <p className="lead">Every price includes the warranty of its grade and our 5-year service plan.</p>
            </div>
            <Link href="/products" className="link lg:col-span-4 lg:justify-self-end">
              See all {ALL_PRODUCTS.length} MacBooks
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
          {/* Phone: a swipe row of store tiles; wider: a grid */}
          <ul className="max-sm:flex max-sm:overflow-x-auto max-sm:snap-x max-sm:snap-mandatory max-sm:-mx-[var(--gut)] max-sm:px-[var(--gut)] max-sm:scroll-px-[var(--gut)] max-sm:[scrollbar-width:none] gap-3 sm:grid sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => <li key={p.id} className={`max-sm:w-[46%] max-sm:flex-none max-sm:snap-start ${i === 2 ? 'sm:max-lg:hidden' : ''}`}><ProductCard {...p} /></li>)}
          </ul>
        </div>
      </section>

      {/* ── Exchange and e-waste ── */}
      <section id="exchange" className="py-14 sm:py-28">
        <div className="wrap grid gap-6 lg:grid-cols-12">
          <div className="on-inverse lg:col-span-7 card !bg-black text-[var(--inv-ink)]">
            <div className="photo !rounded-none aspect-[16/9]">
              <Image src={PHOTOS.exchange} alt="An open MacBook on an outdoor table among plants" fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
            </div>
            <div className="p-7 sm:p-10 grid gap-4">
              <h2 className="t-h2 !max-w-[16ch]">Exchange your old laptop</h2>
              <p className="text-[17px] leading-[1.6] text-[var(--inv-muted)] max-w-[46ch]">Send its model and a few photos. We give you a value on WhatsApp and take it off the price of your MacBook.</p>
              <div className="pt-2">
                <a href={waLink('Hi, I would like an exchange value for my laptop. Model: ')} target="_blank" rel="noopener noreferrer" className="btn btn--primary">Get an exchange value</a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 card card--grey p-7 sm:p-10">
            <h3 className="t-h3">Pre-owned and e-waste</h3>
            <p className="text-[16px] leading-[1.6] text-[var(--ink-soft)] mt-3 max-w-[40ch]">A MacBook with a second owner is one fewer laptop built and one fewer thrown away. Our totals so far:</p>
            <dl className="grid grid-cols-2 gap-x-6 mt-8">
              {SITE_CONFIG.impact.map((f) => (
                <div key={f.label} className="py-5 border-t border-[var(--line)] grid gap-1.5 content-start">
                  <dt className="text-[23px] sm:text-[30px] font-semibold whitespace-nowrap leading-none tracking-[-0.02em] tabular-nums">{f.value}</dt>
                  <dd className="text-[14px] leading-[1.45] text-[var(--ink-soft)]">{f.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ── Need help: contact routes and questions ── */}
      <section id="faq" className="py-14 sm:py-28 bg-[var(--surface)] scroll-mt-[var(--nav)]">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-4 grid gap-6 content-start">
            <div className="grid gap-3">
              <h2 className="t-h2">Need help?</h2>
              <p className="lead">Search common questions, or reach the team the way you prefer.</p>
            </div>
            <ul className="border-t border-[var(--line)]">
              <li className="border-b border-[var(--line)]">
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="help-row"><ChatLine /><span className="flex-1">Message us on WhatsApp</span><ArrowRightIcon className="w-4 h-4" /></a>
              </li>
              <li className="border-b border-[var(--line)] max-lg:hidden">
                <ChatButton className="help-row w-full text-left"><ChatLine /><span className="flex-1">Ask in chat</span><ArrowRightIcon className="w-4 h-4" /></ChatButton>
              </li>
              <li className="border-b border-[var(--line)]">
                <a href={`mailto:${SITE_CONFIG.social.email}`} className="help-row"><MailIcon className={lineIcon} /><span className="flex-1">Email us</span><ArrowRightIcon className="w-4 h-4" /></a>
              </li>
              <li className="border-b border-[var(--line)]">
                <a href={showroom.mapsUrl} target="_blank" rel="noopener noreferrer" className="help-row items-start"><PinIcon className={`${lineIcon} mt-0.5`} /><span className="flex-1">Visit the showroom<span className="block text-[14px] text-[var(--muted)] mt-0.5">{showroom.lines.slice(0, 2).join(', ')}, Koduvally</span></span><ArrowRightIcon className="w-4 h-4 mt-1" /></a>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <FaqSearch items={SITE_CONFIG.faqItems} limit={6} />
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section id="reviews" className="py-14 sm:py-28">
        <div className="wrap">
          <div className="sec-head lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7 grid gap-3">
              <h2 className="t-h2">Reviews from MacBook buyers</h2>
              <p className="inline-flex items-center gap-2.5 text-[17px] text-[var(--ink-soft)]">
                <GoogleIcon className="w-5 h-5" />
                <span><span className="font-semibold text-[var(--ink)]">{SITE_CONFIG.stats.rating}</span> from {SITE_CONFIG.stats.reviews} Google reviews</span>
              </p>
            </div>
            <div className="lg:col-span-5 lg:justify-self-end">
              <Link href="/reviews" className="btn btn--secondary">Read all reviews</Link>
            </div>
          </div>
        </div>
        <div className="wrap"><ReviewMarquee reviews={SITE_CONFIG.customerReviews} /></div>
      </section>
    </>
  );
}
