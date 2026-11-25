'use client';

import { useState } from 'react';

type Row = { factor: string; pristine: string; certified: string; refurb: string };
type Key = 'pristine' | 'certified' | 'refurb';
const GRADES: [Key, string][] = [['pristine', 'Pristine'], ['certified', 'Certified'], ['refurb', 'Refurbished']];

/** The grade criteria on a phone: pick a grade, read its column, instead of a wide table to scroll sideways */
export function CriteriaSwitch({ rows }: { rows: Row[] }) {
  const [g, setG] = useState<Key>('certified');
  return (
    <div className="grid gap-5">
      <div role="group" aria-label="Grade" className="segmented !w-full">
        {GRADES.map(([k, l]) => (
          <button key={k} type="button" aria-pressed={g === k} onClick={() => setG(k)} className="flex-1">{l}</button>
        ))}
      </div>
      <dl className="border-t border-[var(--line)]" aria-live="polite">
        {rows.map((r) => (
          <div key={r.factor} className="flex justify-between gap-6 py-3.5 border-b border-[var(--line)] text-[15px]">
            <dt className="font-medium">{r.factor}</dt>
            <dd className="text-right text-[var(--ink-soft)]">{r[g]}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
