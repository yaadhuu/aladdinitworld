/*
  Home. Visual thesis: the MacBook on black, then a calm white and grey retail store around it.
  Gold lives only in the lamp mark. One primary action per screen.
  Hero: the owner's 30-frame render of two MacBooks closing, scrubbed by scroll. Exchange photo: Unsplash stand-in.
*/
import Link from 'next/link';
import Image from 'next/image';
import { SITE_CONFIG } from '@/config';
import { ArrowRightIcon, GoogleIcon } from '@/components/Icons';
import { ProductCard } from '@/components/ProductCard';
import { ChatButton } from '@/components/ChatButton';
import { ReviewMarquee } from '@/components/home/ReviewMarquee';
import { FaqSearch } from '@/components/home/FaqSearch';
import ScrollHero, { type MediaSet } from '@/components/ScrollHero';
import { waLink } from '@/lib/whatsapp';
import { getCount, getFeatured } from '@/lib/products';
import { getFaqs } from '@/lib/faq';
import { getReviews } from '@/lib/reviews';

const PHOTOS = {
  exchange: '/img/home/impact.jpg', // Unsplash 1602080858428-57174f9431cf
};

// Static, rebuilt in the background about every 60 seconds
export const revalidate = 60;

// Frame folders under /public/hero, with the scrub-ready videos (tier 1). The last frames (the closed pair turning) are cut:
// videos trimmed to 84 frames, frame counts set to match (originals in _backup-hero-v2).
const HERO_MOBILE: MediaSet = { basePath: '/hero/m', count: 27, width: 720, height: 900, video: '/hero/video/hero-m.mp4' };
const HERO_DESKTOP: MediaSet = { basePath: '/hero/d', count: 43, width: 1280, height: 582, video: '/hero/video/hero-d.mp4' };


export default async function Home() {
  const { showroom } = SITE_CONFIG;
  const [featured, count, faqs, reviews] = await Promise.all([getFeatured(), getCount(), getFaqs(), getReviews()]);
  return (
    <>
      {/* ── Hero: one dark scene, the MacBooks close as you scroll (ScrollHero: video, frames or poster) ── */}
      <div id="hero">
        <ScrollHero
          mobile={HERO_MOBILE}
          desktop={HERO_DESKTOP}
          alt="Two Space Black MacBook Pro laptops, open"
          scrollRange={0.7}
          className="hero2 min-h-[70svh] lg:min-h-[100svh]"
          mediaClassName="hero-media"
        >
          <div className="hero2__scrim" aria-hidden="true" />
          <div className="wrap hero2__inner">
            <div className="hero2__head" data-enter>
              <h1>Certified pre&#8209;owned MacBooks</h1>
              {/* TODO(owner): warranty, "100+ point inspection" and "5-year service plan" are not confirmed, so they are left out of the hero */}
              <p className="hero2__lead">Every MacBook professionally inspected, graded and warranted. <strong>Three CPO tiers</strong> to match your budget.</p>
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

      {/* ── MacBooks in stock: up to 6 featured units from the CMS ── */}
      {featured.length > 0 && (
      <section id="stock" className="py-14 sm:py-28 bg-[var(--surface)]">
        <div className="wrap">
          <div className="sec-head lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8 grid gap-3">
              <h2 className="t-h2">MacBooks in stock</h2>
              <p className="lead">Every price includes the warranty of its grade and our 5-year service plan.</p>
            </div>
            <Link href="/products" className="link lg:col-span-4 lg:justify-self-end">
              See all {count} MacBooks
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
          {/* Phone: a swipe row of store tiles; wider: a grid */}
          <ul className="max-sm:flex max-sm:overflow-x-auto max-sm:snap-x max-sm:snap-mandatory max-sm:-mx-[var(--gut)] max-sm:px-[var(--gut)] max-sm:scroll-px-[var(--gut)] max-sm:[scrollbar-width:none] gap-3 sm:grid sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((u, i) => <li key={u.id} className={`max-sm:w-[46%] max-sm:flex-none max-sm:snap-start ${i >= 4 ? 'sm:max-lg:hidden' : ''}`}><ProductCard unit={u} /></li>)}
          </ul>
        </div>
      </section>
      )}

      {/* ── Exchange, with the e-waste figures it leads to ── */}
      <section id="exchange" className="py-14 sm:py-28">
        <div className="wrap grid gap-8 lg:gap-16 lg:grid-cols-2 lg:items-center">
          <div className="photo aspect-[4/3]">
            <Image src={PHOTOS.exchange} alt="An open MacBook on an outdoor table among plants" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="grid gap-8">
            <div className="grid gap-4 justify-items-start">
              <h2 className="t-h2">Exchange your old laptop</h2>
              <p className="lead">Send its model and a few photos. We tell you its value and take it off the price of your new MacBook.</p>
              <a href={waLink('Hi, I would like an exchange value for my laptop. Model: ')} target="_blank" rel="noopener noreferrer" className="btn btn--primary mt-2">Get an exchange value</a>
            </div>
            <div className="grid gap-4 pt-8 border-t border-[var(--line)]">
              <div className="grid gap-2">
                <h3 className="text-[19px] font-medium tracking-[-0.01em]">Better for the planet, too</h3>
                <p className="text-[15px] leading-[1.6] text-[var(--ink-soft)] max-w-[52ch]">A MacBook with a second owner is one fewer laptop built and one fewer thrown away. Our totals so far:</p>
              </div>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
                {SITE_CONFIG.impact.map((f) => (
                  <div key={f.label} className="grid gap-1 content-start">
                    <dt className="text-[24px] sm:text-[30px] font-semibold leading-none tracking-[-0.02em] tabular-nums whitespace-nowrap">{f.value}</dt>
                    <dd className="text-[14px] leading-[1.45] text-[var(--ink-soft)]">{f.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews, with the ways to reach the team underneath ── */}
      <section id="reviews" className="py-14 sm:py-28 bg-[var(--surface)]">
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
        <div className="wrap"><ReviewMarquee reviews={reviews} /></div>
        <div className="wrap mt-10 sm:mt-14 pt-8 border-t border-[var(--line)] grid gap-3 lg:flex lg:items-center lg:justify-between">
          <p className="text-[19px] font-medium tracking-[-0.01em]">Need help choosing?</p>
          <div className="flex flex-wrap gap-x-7 gap-y-1">
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="link text-[15px]">Message us <ArrowRightIcon className="w-4 h-4" /></a>
            <ChatButton className="link text-[15px]">Ask the assistant <ArrowRightIcon className="w-4 h-4" /></ChatButton>
            <a href={showroom.mapsUrl} target="_blank" rel="noopener noreferrer" className="link text-[15px]">Visit the showroom <ArrowRightIcon className="w-4 h-4" /></a>
          </div>
        </div>
      </section>

      {/* ── Questions (from the CMS; hidden when there are none) ── */}
      {faqs.length > 0 && (
      <section id="faq" className="py-14 sm:py-28 scroll-mt-[var(--nav)]">
        <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-4 grid gap-3 content-start">
            <h2 className="t-h2">Questions, answered</h2>
            <p className="lead">Warranty, EMI, exchange and delivery. Search below, or ask the assistant anything else.</p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <FaqSearch items={faqs} limit={6} />
          </div>
        </div>
      </section>
      )}
    </>
  );
}
