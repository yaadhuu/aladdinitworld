'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { TIERS, type Tier, type Unit } from '@/config';
import { ProductCard } from '@/components/ProductCard';
import { gradeName, sizeOf, TIER_ORDER, unitMemory, unitName } from '@/lib/unit-helpers';
import { waLink } from '@/lib/whatsapp';

type Sort = 'low' | 'high';
type Cpu = 'apple' | 'intel';
const CPU_LABEL: Record<Cpu, string> = { apple: 'Apple silicon', intel: 'Intel' };
const cpuOf = (u: Unit): Cpu => (/intel/i.test(u.chip) ? 'intel' : 'apple');

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

export function ProductsView({ units, total }: { units: Unit[]; total: number }) {
  const [grade, setGrade] = useState<Tier | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [cpu, setCpu] = useState<Cpu | null>(null);
  const [sort, setSort] = useState<Sort>('low');
  const [ready, setReady] = useState(false);
  const sheetRef = useRef<HTMLDialogElement>(null);
  const [q, setQ] = useState('');

  const sizes = useMemo(() => [...new Set(units.map(sizeOf))].sort(), [units]);
  // Processor families present in stock, Apple silicon first
  const cpus = useMemo(() => (['apple', 'intel'] as Cpu[]).filter((c) => units.some((u) => cpuOf(u) === c)), [units]);

  // Filters live in the URL so a filtered view can be shared from an ad or a chat
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const g = q.get('grade') as Tier | null;
    if (g && TIER_ORDER.includes(g)) setGrade(g);
    const s = q.get('size'); if (s && sizes.includes(s)) setSize(s);
    const c = q.get('cpu') as Cpu | null; if (c && cpus.includes(c)) setCpu(c);
    setReady(true);
  }, [sizes, cpus]);

  useEffect(() => {
    if (!ready) return;
    const q = new URLSearchParams();
    if (grade) q.set('grade', grade);
    if (size) q.set('size', size);
    if (cpu) q.set('cpu', cpu);
    const qs = q.toString();
    window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
  }, [ready, grade, size, cpu]);

  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const list = units
    .filter((u) => words.every((w) => [unitName(u), u.chip, unitMemory(u), sizeOf(u), gradeName(u.grade), u.headline ?? ''].join(' ').toLowerCase().includes(w)))
    .filter((u) => (!grade || u.grade === grade) && (!size || sizeOf(u) === size) && (!cpu || cpuOf(u) === cpu))
    .sort((a, b) => (sort === 'low' ? a.price - b.price : b.price - a.price));

  const active = [grade, size, cpu].filter((v) => v !== null).length;
  const filtered = active > 0 || q !== '';
  const reset = () => { setGrade(null); setSize(null); setCpu(null); setQ(''); };

  return (
    <>
      <section className="pt-7 sm:pt-20 pb-5 sm:pb-8">
        <div className="wrap grid gap-2 sm:gap-4">
          <h1 className="t-h1 !text-[clamp(32px,3vw+22px,64px)]">Shop MacBook</h1>
          <div className="relative max-w-[520px] mt-3 sm:mt-4">
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
          {/* Sort sits in the row with the filters: one chip that flips the price order */}
          <button type="button" className="chip" onClick={() => setSort(sort === 'low' ? 'high' : 'low')}
            aria-label={`Sorted by price, ${sort === 'low' ? 'low to high' : 'high to low'}. Change order`}>
            <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 4v12M3 7l3-3 3 3" className={sort === 'low' ? '' : 'opacity-30'} /><path d="M14 16V4M11 13l3 3 3-3" className={sort === 'high' ? '' : 'opacity-30'} />
            </svg>
            Price: {sort === 'low' ? 'Low to high' : 'High to low'}
          </button>
          {sizes.map((s) => (
            <button key={s} type="button" className="chip" aria-pressed={size === s} onClick={() => setSize(size === s ? null : s)}>{s}</button>
          ))}
          {cpus.length > 1 && cpus.map((c) => (
            <button key={c} type="button" className="chip" aria-pressed={cpu === c} onClick={() => setCpu(cpu === c ? null : c)}>{CPU_LABEL[c]}</button>
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
          <Segmented<Cpu> label="Processor" value={cpu} onChange={setCpu}
            options={[{ value: null, label: 'All' }, ...cpus.map((c) => ({ value: c, label: CPU_LABEL[c] }))]} />
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
        <div className="wrap py-4 flex flex-wrap xl:flex-nowrap items-end gap-x-6 gap-y-4">
          <Segmented<Tier> label="Grade" value={grade} onChange={setGrade}
            options={[{ value: null, label: 'All' }, ...TIER_ORDER.map((t) => ({ value: t, label: TIERS[t].label.replace('CPO ', '') }))]} />
          <Segmented<string> label="Size" value={size} onChange={setSize}
            options={[{ value: null, label: 'All' }, ...sizes.map((s) => ({ value: s, label: s }))]} />
          <Segmented<Cpu> label="Processor" value={cpu} onChange={setCpu}
            options={[{ value: null, label: 'All' }, ...cpus.map((c) => ({ value: c, label: CPU_LABEL[c] }))]} />
          <div className="ml-auto">
            <Segmented<Sort> label="Sort by price" value={sort} onChange={(v) => setSort(v ?? 'low')}
              options={[{ value: 'low', label: 'Low to high' }, { value: 'high', label: 'High to low' }]} />
          </div>
        </div>
      </section>

      <section aria-label="MacBooks" className="pt-4 sm:pt-8 pb-16 sm:pb-24">
        <div className="wrap">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 mb-3 sm:mb-6 min-h-[44px]">
            <p className="text-[14px] sm:text-[15px] text-[var(--ink-soft)]" aria-live="polite">
              <span className="text-[var(--ink)] font-medium tabular-nums">{list.length}</span> {list.length === 1 ? 'MacBook' : 'MacBooks'}
            </p>
            <div className="flex items-center gap-4">
              {filtered && <button type="button" onClick={reset} className="link text-[14px] sm:text-[15px]">Clear filters</button>}
            </div>
          </div>

          <h2 className="sr-only">MacBooks</h2>
          {list.length > 0 ? (
            <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4">
              {list.map((u, i) => <li key={u.id}><ProductCard unit={u} priority={i < 2} /></li>)}
            </ul>
          ) : units.length === 0 ? (
            <div className="py-20 grid gap-4 justify-items-start">
              <p className="t-h3">New MacBooks are being listed.</p>
              <p className="lead max-w-[48ch]">Tell us the model or budget you have in mind and we will message you when a match arrives.</p>
              <a href={waLink('Hi, I am looking for a MacBook. ')} target="_blank" rel="noopener noreferrer" className="btn btn--primary">Message us</a>
            </div>
          ) : (
            <div className="py-20 grid gap-4 justify-items-start">
              <p className="t-h3">No MacBook matches these filters.</p>
              <button type="button" onClick={reset} className="btn btn--secondary">Clear filters</button>
            </div>
          )}
          {total > units.length && <p className="mt-8 text-[14px] text-[var(--ink-soft)]">Showing the newest {units.length} of {total}. Message us for anything not listed.</p>}
        </div>
      </section>
    </>
  );
}
