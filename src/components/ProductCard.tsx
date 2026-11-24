'use client';

import { useState } from 'react';
import Image from 'next/image';
import { TIERS, type Product, type Tier } from '@/config';
import { ArrowRightIcon } from '@/components/Icons';
import { formatINR, waLink } from '@/lib/whatsapp';
import { gradesOf, imageOf, warrantyShort } from '@/lib/products';

/** One MacBook: photo, name, the specs that matter, grade, price, enquiry. Apple-store calm. */
export function ProductCard(p: Product) {
  const grades = gradesOf(p);
  const [grade, setGrade] = useState<Tier>(grades[0]);
  const price = p.tiers[grade]?.price ?? 0;
  const ram = p.specs.find((s) => /RAM/i.test(s));
  const ssd = p.specs.find((s) => /SSD/i.test(s));
  const display = p.specs.find((s) => /Display|XDR|Retina/i.test(s));

  return (
    <article className="card card--lift">
      <div className="photo !rounded-none aspect-[4/3] !bg-[#f0f0f2]">
        <Image
          src={imageOf(p)}
          alt={`${p.name}, ${[ram, ssd].filter(Boolean).join(', ')}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-5 p-6 flex-1">
        <div className="grid gap-1.5">
          <p className="label">{p.chip}</p>
          <h3 className="t-card">{p.name}</h3>
          <ul className="text-[15px] leading-[1.55] text-[var(--ink-soft)]">
            {[ram && ssd ? `${ram} · ${ssd}` : ram ?? ssd, display].filter(Boolean).map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>

        {grades.length > 1 ? (
          <div role="group" aria-label={`Grade for ${p.name}`} className="segmented">
            {grades.map((g) => (
              <button key={g} type="button" aria-pressed={grade === g} onClick={() => setGrade(g)}>
                {TIERS[g].label.replace('CPO ', '')}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-[14px] text-[var(--ink-soft)]">
            <span className="font-medium text-[var(--ink)]">{TIERS[grade].label.replace('CPO ', '')}</span> grade · {warrantyShort(grade)} warranty
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-4 pt-5 border-t border-[var(--line)]">
          <p className="text-[22px] font-semibold tracking-[-0.02em] tabular-nums">{formatINR(price)}</p>
          <a
            href={waLink(`Hi, is the ${p.name} (${[ram, ssd].filter(Boolean).join(', ')}, ${TIERS[grade].label}, ${formatINR(price)}) available? Please send live photos and the battery report.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="link text-[15px]"
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
