import { TIERS, type Tier } from '@/config';
import { CheckIcon } from '@/components/Icons';
import { SpotlightCard } from '@/components/SpotlightCard';
import { TIER_ORDER, gradeName, warrantyShort } from '@/lib/unit-helpers';

// How much of the original condition each grade keeps, shown as a three-step meter
const LEVEL: Record<Tier, number> = { refurb: 1, certified: 2, pristine: 3 };

function ConditionMeter({ tier }: { tier: Tier }) {
  const level = LEVEL[tier];
  return (
    <div className="grid gap-2">
      <div className="flex gap-1.5" role="img" aria-label={`Condition: ${level} of 3`}>
        {[1, 2, 3].map((n) => (
          <span key={n} className={`h-1.5 flex-1 rounded-full ${n <= level ? 'bg-[var(--ink)]' : 'bg-[#e3e3e8]'}`} />
        ))}
      </div>
      <p className="text-[13px] text-[var(--muted)]">Condition</p>
    </div>
  );
}

/**
 * The three grades side by side. `compact` keeps the name, warranty, meter and description;
 * the full version adds what each grade includes and its limits.
 */
export function GradeCards({ compact = false }: { compact?: boolean }) {
  return (
    <ul className={`grid gap-4 sm:gap-5 md:grid-cols-3 md:gap-y-6 ${compact ? "md:grid-rows-[repeat(4,auto)]" : "md:grid-rows-[repeat(4,auto)_1fr]"}`}>
      {TIER_ORDER.map((t) => {
        const tier = TIERS[t];
        const popular = t === 'certified';
        return (
          <li key={t} className={`md:grid md:grid-rows-subgrid ${compact ? "md:row-span-4" : "md:row-span-5"}`}>
            <SpotlightCard
              className={`flex flex-col gap-6 md:grid md:grid-rows-subgrid ${compact ? "md:row-span-4" : "md:row-span-5"} rounded-[var(--r-lg)] bg-white p-6 sm:p-8 border ${popular ? 'border-[var(--ink)]' : 'border-[var(--line)]'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-[22px] sm:text-[24px] font-semibold tracking-[-0.02em] leading-tight">{gradeName(t)}</h3>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[12px] font-medium ${popular ? 'bg-[var(--ink)] text-white' : 'bg-[var(--surface)] text-[var(--ink-soft)]'}`}>
                  {tier.tagline}
                </span>
              </div>

              <p className="flex items-baseline gap-2">
                <span className="text-[34px] sm:text-[40px] font-semibold tracking-[-0.03em] leading-none tabular-nums">{warrantyShort(t)}</span>
                <span className="text-[15px] text-[var(--ink-soft)]">warranty</span>
              </p>

              <ConditionMeter tier={t} />

              <p className="text-[15px] leading-[1.6] text-[var(--ink-soft)]">{tier.description}</p>

              {!compact && (
                <ul className="grid gap-2.5 content-start pt-5 border-t border-[var(--line)]">
                  {tier.includes.map((inc) => (
                    <li key={inc} className="flex gap-3 text-[15px] leading-snug">
                      <CheckIcon className="w-4 h-4 mt-0.5 flex-none text-[var(--ink)]" />
                      {inc}
                    </li>
                  ))}
                  {tier.caveats.map((c) => (
                    <li key={c} className="flex gap-3 text-[15px] leading-snug text-[var(--ink-soft)]">
                      <svg viewBox="0 0 16 16" aria-hidden="true" className="w-4 h-4 mt-0.5 flex-none" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M4 8h8" /></svg>
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </SpotlightCard>
          </li>
        );
      })}
    </ul>
  );
}
