import { TIERS, EXTENDED_SERVICE_PLAN, WARRANTY_TERMS, type Tier } from '@/config';
import { CheckIcon } from '@/components/Icons';
import { SpotlightCard } from '@/components/SpotlightCard';
import { TIER_ORDER, warrantyShort } from '@/lib/products';
import { waLink } from '@/lib/whatsapp';

// Base warranty length in months, drawn against the longest (6)
const MONTHS: Record<Tier, number> = { refurb: 1, certified: 3, pristine: 6 };

const COVERAGE: [string, string, string, string][] = [
  ['Hardware defects and functional failures', 'Yes', 'Yes', 'Yes'],
  ['Display, battery, keyboard and trackpad faults', 'Yes', 'Yes', 'Yes'],
  ['Genuine Apple parts', '—', 'Yes', 'Yes'],
  ['No dents', '—', 'Yes', 'Yes'],
  ['No scratches, battery 90% or more', '—', '—', 'Yes'],
  ['Base warranty', '1 month', '3 months', '6 months'],
  ['5-year service plan', 'Yes', 'Yes', 'Yes'],
  ['Accidental or liquid damage', 'No', 'No', 'No'],
];

const STEPS = [
  ['Message us', 'Send your invoice and the problem on WhatsApp.'],
  ['Hand in the MacBook', 'Bring or send it to our service location for inspection.'],
  ['Repair or replacement', 'We repair or replace the faulty part.'],
  ['Back to you', 'Tested again and returned, usually in 5 to 7 working days.'],
];

export default function WarrantyPage() {
  return (
    <>
      <section className="pt-10 sm:pt-20 pb-12 sm:pb-16">
        <div className="wrap grid gap-3 sm:gap-5">
          <h1 className="t-h1 !text-[clamp(34px,3vw+22px,64px)] max-w-[16ch]">Warranty and 5&#8209;year service plan</h1>
          <p className="lead max-w-[52ch]">Every MacBook has a base warranty set by its grade, plus a 5-year service plan on every purchase.</p>
        </div>
      </section>

      {/* Base warranty by grade: one bar each, drawn against six months */}
      <section aria-labelledby="by-grade" className="py-14 sm:py-24 bg-[var(--surface)]">
        <div className="wrap grid gap-8 sm:gap-10">
          <h2 id="by-grade" className="t-h2">Base warranty by grade</h2>
          <ul className="grid gap-3 sm:gap-4">
            {TIER_ORDER.map((k) => {
              const t = TIERS[k];
              const name = t.label.replace('CPO ', '');
              return (
                <li key={k}>
                  <SpotlightCard className="wbar rounded-[var(--r-lg)] bg-white p-5 sm:p-7 grid gap-4 lg:grid-cols-12 lg:items-center lg:gap-8">
                    <div className="lg:col-span-4 grid gap-1.5">
                      <div className="flex items-baseline justify-between gap-4 lg:block">
                        <h3 className="text-[20px] sm:text-[22px] font-semibold tracking-[-0.015em]">{name}</h3>
                        <p className="lg:hidden text-[20px] font-semibold tracking-[-0.02em] tabular-nums">{warrantyShort(k)}</p>
                      </div>
                      <p className="text-[14px] sm:text-[15px] leading-[1.55] text-[var(--ink-soft)] max-w-[46ch]">{t.description}</p>
                    </div>
                    <div className="lg:col-span-5 grid gap-2">
                      <div className="wbar__track" role="img" aria-label={`${warrantyShort(k)} of a possible 6 months`}>
                        <span className="wbar__fill" style={{ ['--w' as string]: `${(MONTHS[k] / 6) * 100}%` }} />
                      </div>
                      <div className="flex justify-between text-[12px] text-[var(--muted)] tabular-nums" aria-hidden="true">
                        <span>0</span><span>3 months</span><span>6 months</span>
                      </div>
                    </div>
                    <div className="lg:col-span-3 flex items-center justify-between gap-4 lg:grid lg:justify-end lg:justify-items-end lg:gap-1">
                      <p className="max-lg:hidden text-[32px] font-semibold leading-none tracking-[-0.03em] tabular-nums whitespace-nowrap">{warrantyShort(k)}</p>
                      <a href={waLink(`Hi, which ${t.label} MacBooks do you have in stock?`)} target="_blank" rel="noopener noreferrer" className="link text-[14px] whitespace-nowrap">
                        Ask about {name} stock
                      </a>
                    </div>
                  </SpotlightCard>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Service plan: one dark band, five years drawn as five blocks */}
      <section aria-labelledby="plan" className="py-14 sm:py-24 bg-[var(--inv-bg)] text-[var(--inv-ink)]">
        <div className="wrap grid gap-10 sm:gap-14">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-6 grid gap-3 sm:gap-4">
              <h2 id="plan" className="t-h2">5-year service plan, on every MacBook</h2>
              <p className="lead !text-[var(--inv-muted)]">For {EXTENDED_SERVICE_PLAN.duration.toLowerCase()} from the date of purchase, in every grade.</p>
            </div>
            <dl className="lg:col-span-6 grid grid-cols-2 gap-3 sm:gap-4">
              {[['Free', 'service charges for 5 years'], ['Up to 50%', 'off spare parts']].map(([v, l]) => (
                <SpotlightCard key={v} className="spotlight--dark rounded-[var(--r-lg)] border border-white/15 p-5 sm:p-7 grid gap-2 content-start">
                  <dt className="text-[30px] sm:text-[44px] font-semibold leading-none tracking-[-0.03em] whitespace-nowrap">{v}</dt>
                  <dd className="text-[14px] sm:text-[16px] text-[var(--inv-muted)]">{l}</dd>
                </SpotlightCard>
              ))}
            </dl>
          </div>

          <ol className="years" aria-label="Covered for five years from purchase">
            {[1, 2, 3, 4, 5].map((y) => (
              <li key={y} className="years__block">
                <span className="years__bar" aria-hidden="true" />
                <span className="text-[13px] sm:text-[14px] text-[var(--inv-muted)] tabular-nums">Year {y}</span>
              </li>
            ))}
          </ol>

          <ul className="grid gap-3 sm:grid-cols-3 sm:gap-6 pt-6 border-t border-white/15">
            {EXTENDED_SERVICE_PLAN.notes.map((n) => (
              <li key={n} className="flex gap-3 text-[14px] leading-[1.55] text-[var(--inv-muted)]">
                <CheckIcon className="w-4 h-4 mt-0.5 flex-none text-[var(--inv-ink)]" />{n}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Coverage table */}
      <section aria-labelledby="coverage" className="py-14 sm:py-24">
        <div className="wrap grid gap-8 sm:gap-10 lg:grid-cols-12">
          <h2 id="coverage" className="t-h2 lg:col-span-4">What each grade covers</h2>
          <div className="relative lg:col-span-8 min-w-0 overflow-x-auto -mx-[var(--gut)] px-[var(--gut)] sm:mx-0 sm:px-0" role="region" aria-label="Coverage by grade" tabIndex={0}>
            <table className="w-full min-w-[560px] text-left">
              <thead>
                <tr className="label border-b border-[var(--line)]">
                  <th scope="col" className="py-3 pr-4 font-medium">Coverage</th>
                  <th scope="col" className="py-3 pr-4 font-medium">Refurbished</th>
                  <th scope="col" className="py-3 pr-4 font-medium">Certified</th>
                  <th scope="col" className="py-3 font-medium">Pristine</th>
                </tr>
              </thead>
              <tbody>
                {COVERAGE.map(([item, ...cells]) => (
                  <tr key={item} className="cov-row border-b border-[var(--line)] text-[15px] sm:text-[16px]">
                    <th scope="row" className="py-4 pr-4 font-medium">{item}</th>
                    {cells.map((c, i) => (
                      <td key={i} className="py-4 pr-4 text-[var(--ink-soft)]">
                        {c === 'Yes' ? <span className="inline-flex items-center gap-2"><CheckIcon className="w-4 h-4 text-[var(--ink)]" /><span className="sr-only">Yes</span></span> : c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Claims: four steps joined by a line */}
      <section aria-labelledby="claims" className="py-14 sm:py-24 bg-[var(--surface)]">
        <div className="wrap grid gap-8 sm:gap-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="claims" className="t-h2">How a warranty claim works</h2>
            <a href={waLink('Hi, I would like to raise a warranty claim. Invoice number: ')} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
              Start a claim
            </a>
          </div>
          <ol className="steps grid gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
            {STEPS.map(([title, text], i) => (
              <li key={title} className="steps__item rounded-[var(--r-lg)] bg-white p-5 sm:p-6 grid gap-2 content-start">
                <span className="steps__num" aria-hidden="true">{i + 1}</span>
                <h3 className="text-[17px] sm:text-[18px] font-semibold tracking-[-0.01em] mt-2"><span className="sr-only">Step {i + 1}: </span>{title}</h3>
                <p className="text-[14px] sm:text-[15px] leading-[1.55] text-[var(--ink-soft)]">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Terms: the full legal text, one section open at a time to read */}
      <section aria-labelledby="terms" className="py-14 sm:py-24">
        <div className="wrap grid gap-8 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-4 grid gap-3 content-start">
            <h2 id="terms" className="t-h2">Warranty terms and conditions</h2>
          </div>
          <div className="faq lg:col-span-7 lg:col-start-6 border-t border-[var(--line)]">
            {Object.values(WARRANTY_TERMS).map((s) => (
              <details key={s.title} className="border-b border-[var(--line)]">
                <summary className="flex items-center justify-between gap-6 py-5 text-[16px] sm:text-[17px] font-medium leading-snug">
                  {s.title.replace(/^\d+\.\s*/, '')}
                  <span aria-hidden="true" className="faq-plus" />
                </summary>
                <div className="pb-6 pr-6 grid gap-4 text-[15px] leading-[1.6] text-[var(--ink-soft)] max-w-[64ch]">
                  <ul className="grid gap-2.5">
                    {s.points.map((p) => (
                      <li key={p} className="flex gap-3"><span aria-hidden="true" className="mt-[9px] w-1 h-1 rounded-full bg-[var(--muted)] flex-none" />{p}</li>
                    ))}
                  </ul>
                  {'exclusions' in s && (
                    <div className="grid gap-2.5 rounded-[var(--r-md)] bg-[var(--surface)] p-4 sm:p-5">
                      <p className="text-[14px] font-medium text-[var(--ink)]">Not covered</p>
                      <ul className="grid gap-2">
                        {s.exclusions.map((e) => (
                          <li key={e} className="flex gap-3 text-[14px]">
                            <svg viewBox="0 0 16 16" aria-hidden="true" className="w-4 h-4 mt-0.5 flex-none" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M4 8h8" /></svg>
                            {e}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
