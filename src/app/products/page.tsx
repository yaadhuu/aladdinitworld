'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { TIERS, type Tier } from '@/config';
import { ProductCard } from '@/components/ProductCard';
import { ArrowRightIcon } from '@/components/Icons';
import { ALL_PRODUCTS, TIER_ORDER, priceOf, sizeOf, warrantyShort } from '@/lib/products';
import { formatINR } from '@/lib/whatsapp';

type Sort = 'low' | 'high';

function Segmented<T extends string>({ label, value, options, onChange }: {
  label: string; value: T | null; options: { value: T | null; label: string }[]; onChange: (v: T | null) => void;
}) {
  return (
    <div className="grid gap-2 min-w-0">
      <span className="label">{label}</span>
      <div role="group" aria-label={label} className="segmented">
        {options.map((o) => (
          <button key={o.label} type="button" aria-pressed={value === o.value} onClick={() => onChange(o.value)}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [grade, setGrade] = useState<Tier | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [chip, setChip] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>('low');
  const [ready, setReady] = useState(false);
  const sheetRef = useRef<HTMLDialogElement>(null);
  const [q, setQ] = useState('');

  const sizes = useMemo(() => [...new Set(ALL_PRODUCTS.map(sizeOf).filter(Boolean))].sort(), []);
  const chips = useMemo(() => [...new Set(ALL_PRODUCTS.map((p) => p.chip))], []);

  // Filters live in the URL so a filtered view can be shared from an ad or a chat
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const g = q.get('grade') as Tier | null;
    if (g && TIER_ORDER.includes(g)) setGrade(g);
    const s = q.get('size'); if (s && sizes.includes(s)) setSize(s);
    const c = q.get('chip'); if (c && chips.includes(c)) setChip(c);
    setReady(true);
  }, [sizes, chips]);

  useEffect(() => {
    if (!ready) return;
    const q = new URLSearchParams();
    if (grade) q.set('grade', grade);
    if (size) q.set('size', size);
    if (chip) q.set('chip', chip);
    const qs = q.toString();
    window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
  }, [ready, grade, size, chip]);

  const list = ALL_PRODUCTS
    .filter((p) => q.toLowerCase().split(/\s+/).filter(Boolean).every((w) => [p.name, p.chip, ...p.specs].join(' ').toLowerCase().includes(w)))
    .filter((p) => (!grade || (p.tiers[grade]?.price ?? null) !== null) && (!size || sizeOf(p) === size) && (!chip || p.chip === chip))
    .sort((a, b) => (sort === 'low' ? priceOf(a) - priceOf(b) : priceOf(b) - priceOf(a)));

  const active = [grade, size, chip].filter((v) => v !== null).length;
  const filtered = active > 0 || q !== '';
  const reset = () => { setGrade(null); setSize(null); setChip(null); setQ(''); };
  const from = Math.min(...ALL_PRODUCTS.map(priceOf));

  return (
    <>
      <section className="pt-7 sm:pt-20 pb-5 sm:pb-8">
        <div className="wrap grid gap-2 sm:gap-4">
          <h1 className="t-h1 !text-[clamp(32px,3vw+22px,64px)]">Shop MacBook</h1>
          <p className="lead max-sm:!text-[15px]">Certified pre-owned MacBook Pro models from {formatINR(from)}. Every price includes the warranty of its grade and our 5-year service plan.</p>
          <div className="relative max-w-[520px] mt-2 sm:mt-4">
            <label htmlFor="shop-search" className="sr-only">Search MacBooks</label>
            <svg viewBox="0 0 24 24" aria-hidden="true" className="absolute left-5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[var(--muted)]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg>
            <input id="shop-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search M1 Pro, 16GB, 14-inch" autoComplete="off" className="faq-search" />
          </div>
        </div>
      </section>

      {/* Filters, phone and tablet: one sticky row of chips, the rest in a sheet */}
      <section aria-label="Filters" className="lg:hidden sticky top-[var(--nav)] z-30 bg-[rgba(255,255,255,0.92)] backdrop-blur-xl border-y border-[var(--line)]">
        <div className="wrap chip-row">
          <button type="button" className="chip" onClick={() => sheetRef.current?.showModal()} aria-haspopup="dialog">
            <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M3 6h14M6 10h8M8.5 14h3" /></svg>
            Filters{active > 0 && <span className="tabular-nums">({active})</span>}
          </button>
          {sizes.map((s) => (
            <button key={s} type="button" className="chip" aria-pressed={size === s} onClick={() => setSize(size === s ? null : s)}>{s}</button>
          ))}
          {TIER_ORDER.map((t) => (
            <button key={t} type="button" className="chip" aria-pressed={grade === t} onClick={() => setGrade(grade === t ? null : t)}>{TIERS[t].label.replace('CPO ', '')}</button>
          ))}
        </div>
      </section>

      <dialog ref={sheetRef} className="sheet lg:hidden" aria-labelledby="sheet-title" data-lenis-prevent
        onClick={(e) => { if (e.target === e.currentTarget) sheetRef.current?.close(); }}>
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 id="sheet-title" className="text-[19px] font-semibold">Filters</h2>
          <button type="button" onClick={() => sheetRef.current?.close()} className="w-9 h-9 rounded-full bg-[var(--surface)] inline-flex items-center justify-center" aria-label="Close filters">
            <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M5 5l10 10M15 5 5 15" /></svg>
          </button>
        </div>
        <div className="grid gap-6 px-5 py-3 overflow-y-auto">
          <Segmented<Tier> label="Grade" value={grade} onChange={setGrade}
            options={[{ value: null, label: 'All' }, ...TIER_ORDER.map((t) => ({ value: t, label: TIERS[t].label.replace('CPO ', '') }))]} />
          <Segmented<string> label="Size" value={size} onChange={setSize}
            options={[{ value: null, label: 'All' }, ...sizes.map((s) => ({ value: s, label: s }))]} />
          <Segmented<string> label="Chip" value={chip} onChange={setChip}
            options={[{ value: null, label: 'All' }, ...chips.map((c) => ({ value: c, label: c.replace('Apple ', '') }))]} />
          <Segmented<Sort> label="Sort by price" value={sort} onChange={(v) => setSort(v ?? 'low')}
            options={[{ value: 'low', label: 'Low to high' }, { value: 'high', label: 'High to low' }]} />
        </div>
        <div className="flex items-center gap-4 px-5 pt-4 pb-[calc(16px+env(safe-area-inset-bottom))] border-t border-[var(--line)]">
          <button type="button" onClick={reset} className="link text-[15px]" disabled={!filtered}>Clear all</button>
          <button type="button" onClick={() => sheetRef.current?.close()} className="btn btn--primary flex-1">
            Show {list.length} {list.length === 1 ? 'MacBook' : 'MacBooks'}
          </button>
        </div>
      </dialog>

      {/* Filters, desktop: one sticky bar */}
      <section aria-label="Filters" className="hidden lg:block lg:sticky lg:top-[var(--nav)] z-30 bg-[rgba(255,255,255,0.9)] backdrop-blur-xl border-y border-[var(--line)]">
        <div className="wrap py-4 flex flex-wrap items-end gap-x-8 gap-y-4">
          <Segmented<Tier> label="Grade" value={grade} onChange={setGrade}
            options={[{ value: null, label: 'All' }, ...TIER_ORDER.map((t) => ({ value: t, label: TIERS[t].label.replace('CPO ', '') }))]} />
          <Segmented<string> label="Size" value={size} onChange={setSize}
            options={[{ value: null, label: 'All' }, ...sizes.map((s) => ({ value: s, label: s }))]} />
          <Segmented<string> label="Chip" value={chip} onChange={setChip}
            options={[{ value: null, label: 'All' }, ...chips.map((c) => ({ value: c, label: c.replace('Apple ', '') }))]} />
          <div className="grid gap-2 sm:ml-auto">
            <label htmlFor="sort" className="label">Sort</label>
            <select id="sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="select">
              <option value="low">Price, low to high</option>
              <option value="high">Price, high to low</option>
            </select>
          </div>
        </div>
      </section>

      <section aria-label="MacBooks" className="pt-4 sm:pt-8 pb-16 sm:pb-24 bg-[var(--surface)]">
        <div className="wrap">
          <div className="flex items-center justify-between gap-4 mb-3 sm:mb-6 min-h-[44px]">
            <p className="text-[14px] sm:text-[15px] text-[var(--ink-soft)]" aria-live="polite">
              <span className="text-[var(--ink)] font-medium tabular-nums">{list.length}</span> {list.length === 1 ? 'MacBook' : 'MacBooks'}
            </p>
            <div className="flex items-center gap-4">
              {filtered && <button type="button" onClick={reset} className="link text-[14px] sm:text-[15px]">Clear filters</button>}
              <label className="lg:hidden">
                <span className="sr-only">Sort</span>
                <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="select select--sm">
                  <option value="low">Price: low to high</option>
                  <option value="high">Price: high to low</option>
                </select>
              </label>
            </div>
          </div>

          {list.length > 0 ? (
            <ul className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
              {list.map((p) => <li key={p.id}><ProductCard {...p} /></li>)}
            </ul>
          ) : (
            <div className="py-20 grid gap-4 justify-items-start">
              <p className="t-h3">No MacBook matches these filters.</p>
              <button type="button" onClick={reset} className="btn btn--secondary">Clear filters</button>
            </div>
          )}
        </div>
      </section>

      {/* Grades, briefly */}
      <section aria-labelledby="grades-brief" className="hidden sm:block pb-24 bg-[var(--surface)]">
        <div className="wrap border-t border-[var(--line)] pt-14 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4 grid gap-4 content-start">
            <h2 id="grades-brief" className="t-h3">What the grades mean</h2>
            <Link href="/why-cpo" className="link link--static justify-self-start">
              See every check we run
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
          <dl className="lg:col-span-8 grid gap-8 sm:grid-cols-3">
            {TIER_ORDER.map((t) => (
              <div key={t} className="grid gap-2 content-start">
                <dt className="text-[18px] font-medium">{TIERS[t].label.replace('CPO ', '')} <span className="text-[var(--ink-soft)] font-normal">· {warrantyShort(t)}</span></dt>
                <dd className="text-[15px] leading-[1.6] text-[var(--ink-soft)]">{TIERS[t].description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
