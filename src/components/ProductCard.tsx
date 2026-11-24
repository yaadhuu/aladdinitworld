'use client';

import { useState } from 'react';
import Image from 'next/image';
import { TIERS, type Product, type Tier } from '@/config';
import { ArrowRightIcon } from '@/components/Icons';
import { formatINR, waLink } from '@/lib/whatsapp';
import { gradesOf, imageOf, warrantyShort } from '@/lib/products';

const gradeName = (g: Tier) => TIERS[g].label.replace('CPO ', '');

/**
 * One MacBook: photo, name, the specs that matter, grade, price, enquiry.
 * Under 640px it becomes a store tile (two per row): smaller type, a grade menu instead of the segmented control.
 */
export function ProductCard(p: Product) {
  const grades = gradesOf(p);
  const [grade, setGrade] = useState<Tier>(grades[0]);
  const price = p.tiers[grade]?.price ?? 0;
  const ram = p.specs.find((s) => /RAM/i.test(s));
  const ssd = p.specs.find((s) => /SSD/i.test(s));
  const display = p.specs.find((s) => /Display|XDR|Retina/i.test(s));
  const memory = ram && ssd ? `${ram} · ${ssd}` : ram ?? ssd;

  return (
    <article className="card card--lift">
      <div className="photo !rounded-none aspect-square sm:aspect-[4/3] !bg-[#f0f0f2]">
        <Image
          src={imageOf(p)}
          alt={`${p.name}, ${[ram, ssd].filter(Boolean).join(', ')}`}
          fill
          sizes="(min-width: 1024px) 33vw, 50vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-3 sm:gap-5 p-3.5 sm:p-6 flex-1">
        <div className="grid gap-1 sm:gap-1.5">
          <p className="label max-sm:!text-[12px]">{p.chip}</p>
          <h3 className="t-card max-sm:!text-[15px] max-sm:!leading-[1.3]">{p.name}</h3>
          <ul className="text-[13px] sm:text-[15px] leading-[1.5] text-[var(--ink-soft)]">
            {memory && <li>{memory}</li>}
            {display && <li className="max-sm:hidden">{display}</li>}
          </ul>
        </div>

        {grades.length > 1 ? (
          <>
            <div role="group" aria-label={`Grade for ${p.name}`} className="segmented max-sm:!hidden">
              {grades.map((g) => (
                <button key={g} type="button" aria-pressed={grade === g} onClick={() => setGrade(g)}>{gradeName(g)}</button>
              ))}
            </div>
            <label className="sm:hidden">
              <span className="sr-only">Grade for {p.name}</span>
              <select value={grade} onChange={(e) => setGrade(e.target.value as Tier)} className="select select--sm w-full">
                {grades.map((g) => <option key={g} value={g}>{gradeName(g)} · {warrantyShort(g)}</option>)}
              </select>
            </label>
          </>
        ) : (
          <p className="text-[12px] sm:text-[14px] text-[var(--ink-soft)]">
            <span className="font-medium text-[var(--ink)]">{gradeName(grade)}</span> grade · {warrantyShort(grade)}<span className="max-sm:hidden"> warranty</span>
          </p>
        )}

        <div className="mt-auto flex max-sm:flex-col max-sm:items-start sm:items-center justify-between gap-1 sm:gap-4 pt-3 sm:pt-5 border-t border-[var(--line)]">
          <p className="text-[17px] sm:text-[22px] font-semibold tracking-[-0.02em] tabular-nums">{formatINR(price)}</p>
          <a
            href={waLink(`Hi, is the ${p.name} (${[ram, ssd].filter(Boolean).join(', ')}, ${TIERS[grade].label}, ${formatINR(price)}) available? Please send live photos and the battery report.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="link text-[14px] sm:text-[15px]"
          >
            Enquire
            <ArrowRightIcon className="w-4 h-4" />
            <span className="sr-only"> about {p.name} on WhatsApp</span>
          </a>
        </div>
      </div>
    </article>
  );
}
