'use client';

import { useId, useState } from 'react';

type Case = { client: string; meta: string; facts: string[][]; rows: string[][] };

/** The two client stories behind one switch: the figures up top, then the story as a short timeline */
export function CaseSwitcher({ cases }: { cases: Case[] }) {
  const [i, setI] = useState(0);
  const id = useId();
  const c = cases[i];
  return (
    <div className="grid gap-5 sm:gap-6">
      <div role="tablist" aria-label="Client stories" className="segmented">
        {cases.map((x, n) => (
          <button key={x.client} type="button" role="tab" id={`${id}-t${n}`} aria-selected={n === i}aria-controls={`${id}-p`}
            onClick={() => setI(n)}>{x.client}</button>
        ))}
      </div>

      <article role="tabpanel" id={`${id}-p`} aria-labelledby={`${id}-t${i}`} key={c.client}
        className="insp-fade rounded-[var(--r-lg)] bg-white p-5 sm:p-9 grid gap-7 lg:grid-cols-12 lg:gap-10">
        <header className="lg:col-span-5 grid gap-5 content-start">
          <div className="grid gap-1">
            <p className="label">{c.meta}</p>
            <h3 className="text-[24px] sm:text-[30px] font-semibold tracking-[-0.02em] leading-tight">{c.client}</h3>
          </div>
          <dl className="grid grid-cols-2 gap-3">
            {c.facts.map(([v, l]) => (
              <div key={l} className="rounded-[var(--r-md)] bg-[var(--surface)] p-4">
                <dt className="text-[24px] sm:text-[30px] font-semibold tracking-[-0.02em] leading-none tabular-nums">{v}</dt>
                <dd className="text-[13px] sm:text-[14px] text-[var(--ink-soft)] mt-1.5">{l}</dd>
              </div>
            ))}
          </dl>
        </header>
        <ol className="case-steps lg:col-span-7">
          {c.rows.map(([k, v]) => (
            <li key={k} className="case-steps__item">
              <h4 className="text-[15px] sm:text-[16px] font-semibold">{k}</h4>
              <p className="text-[14px] sm:text-[15px] leading-[1.6] text-[var(--ink-soft)]">{v}</p>
            </li>
          ))}
        </ol>
      </article>
    </div>
  );
}
