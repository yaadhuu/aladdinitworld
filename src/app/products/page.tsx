'use client';

import { useEffect, useMemo, useState } from 'react';
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
    .filter((p) => (!grade || (p.tiers[grade]?.price ?? null) !== null) && (!size || sizeOf(p) === size) && (!chip || p.chip === chip))
    .sort((a, b) => (sort === 'low' ? priceOf(a) - priceOf(b) : priceOf(b) - priceOf(a)));

  const filtered = grade !== null || size !== null || chip !== null;
  const reset = () => { setGrade(null); setSize(null); setChip(null); };
  const from = Math.min(...ALL_PRODUCTS.map(priceOf));

  return (
    <>
      <section className="pt-14 sm:pt-20 pb-8">
        <div className="wrap grid gap-4">
          <h1 className="t-h1 !text-[clamp(40px,3vw+24px,64px)]">Shop MacBook</h1>
          <p className="lead">Certified pre-owned MacBook Pro models from {formatINR(from)}. Every price includes the warranty of its grade and our 5-year service plan.</p>
        </div>
      </section>

      {/* Filters */}
      <section aria-label="Filters" className="lg:sticky lg:top-[var(--nav)] z-30 bg-[rgba(255,255,255,0.9)] backdrop-blur-xl border-y border-[var(--line)]">
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

      <section aria-label="MacBooks" className="pt-8 pb-24 bg-[var(--surface)]">
        <div className="wrap">
          <div className="flex items-center justify-between gap-4 mb-6 min-h-[44px]">
            <p className="text-[15px] text-[var(--ink-soft)]" aria-live="polite">
              <span className="text-[var(--ink)] font-medium tabular-nums">{list.length}</span> {list.length === 1 ? 'MacBook' : 'MacBooks'}
            </p>
            {filtered && <button type="button" onClick={reset} className="link text-[15px]">Clear filters</button>}
          </div>

          {list.length > 0 ? (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
