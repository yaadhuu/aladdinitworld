import { TIERS, EXTENDED_SERVICE_PLAN, WARRANTY_TERMS } from '@/config';
import { CheckIcon } from '@/components/Icons';
import { FaqSearch } from '@/components/home/FaqSearch';
import { TIER_ORDER, warrantyShort } from '@/lib/products';
import { waLink } from '@/lib/whatsapp';

const FAQ = [
  { question: 'What does the base warranty cover?', answer: 'Manufacturing defects and functional hardware faults present at the time of sale: display, battery, ports, keyboard. Its length follows the grade: 1 month Refurbished, 3 months Certified, 6 months Pristine.' },
  { question: 'What is the 5-year service plan?', answer: 'Every purchase, in every grade, includes 5 years of free service charges and up to 50% off spare parts. It runs alongside the base warranty and lasts much longer.' },
  { question: 'Does a part replacement extend my warranty?', answer: 'No. A replaced part does not extend or renew the warranty; it runs from your original invoice date.' },
  { question: 'What is not covered?', answer: 'Physical, liquid or burn damage, breakage, software issues or data loss, misuse or unauthorised repairs, and consumables such as batteries, chargers and cables unless agreed in writing.' },
  { question: 'How do I claim warranty or service?', answer: 'Message us on WhatsApp with your invoice and the problem. The unit is inspected at our service location and we repair or replace the faulty part.' },
  { question: 'What parts are used in service repairs?', answer: 'Original used or refurbished parts, subject to availability, so small cosmetic differences are possible.' },
  { question: 'Does the warranty transfer if I resell?', answer: 'No. The warranty and service plan belong to the original purchase and invoice.' },
];

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
      <section className="pt-14 sm:pt-20 pb-16 sm:pb-20">
        <div className="wrap grid gap-5 max-w-none">
          <h1 className="t-h1 !text-[clamp(40px,3vw+24px,64px)] max-w-[16ch]">Warranty and 5&#8209;year service plan</h1>
          <p className="lead">Every MacBook has a base warranty set by its grade, plus a 5-year service plan on every purchase.</p>
        </div>
      </section>

      {/* Base warranty by grade */}
      <section className="py-16 sm:py-24 bg-[var(--surface)]">
        <div className="wrap">
          <h2 className="t-h2 mb-10 sm:mb-12">Base warranty by grade</h2>
          <ul className="grid gap-6 md:grid-cols-3">
            {TIER_ORDER.map((k) => {
              const t = TIERS[k];
              return (
                <li key={k} className="card p-7 sm:p-8 gap-4">
                  <p className="label">{t.label.replace('CPO ', '')}</p>
                  <p className="text-[40px] leading-none tracking-[-0.03em]">{warrantyShort(k)}</p>
                  <p className="text-[16px] leading-[1.6] text-[var(--ink-soft)]">{t.description}</p>
                  <a href={waLink(`Hi, which ${t.label} MacBooks do you have in stock?`)} target="_blank" rel="noopener noreferrer" className="link link--static mt-auto justify-self-start text-[15px]">
                    Ask about {t.label.replace('CPO ', '')} stock
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Service plan */}
      <section className="py-16 sm:py-24">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5 grid gap-4 content-start">
            <h2 className="t-h2">5-year service plan, on every MacBook</h2>
            <p className="lead">For {EXTENDED_SERVICE_PLAN.duration.toLowerCase()} from the date of purchase, in every grade.</p>
          </div>
          <div className="lg:col-span-7 grid gap-6">
            <div className="grid sm:grid-cols-2 gap-6">
              {[['Free', 'service charges for 5 years'], ['Up to 50%', 'off spare parts']].map(([v, l]) => (
                <div key={v} className="card p-7 !bg-[var(--inv-bg)] text-[var(--inv-ink)] !border-transparent gap-2">
                  <p className="text-[40px] leading-none tracking-[-0.03em]">{v}</p>
                  <p className="text-[16px] text-[var(--inv-muted)]">{l}</p>
                </div>
              ))}
            </div>
            <ul className="grid gap-3">
              {EXTENDED_SERVICE_PLAN.notes.map((n) => (
                <li key={n} className="flex gap-3 text-[15px] leading-[1.6] text-[var(--ink-soft)]">
                  <span aria-hidden="true" className="w-4 flex-none text-center">·</span>{n}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Coverage table */}
      <section className="py-16 sm:py-24 bg-[var(--surface)]">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <h2 className="t-h2 lg:col-span-4">What each grade covers</h2>
          <div className="relative lg:col-span-8 min-w-0 overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0" role="region" aria-label="Coverage by grade" tabIndex={0}>
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
                  <tr key={item} className="border-b border-[var(--line)] text-[15px] sm:text-[16px]">
                    <th scope="row" className="py-4 pr-4 font-medium">{item}</th>
                    {cells.map((c, i) => (
                      <td key={i} className="py-4 pr-4 text-[var(--ink-soft)]">
                        {c === 'Yes' ? <span className="inline-flex items-center gap-2"><CheckIcon className="w-4 h-4 text-[var(--accent)]" /><span className="sr-only">Yes</span></span> : c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Claims */}
      <section className="py-16 sm:py-24">
        <div className="wrap">
          <div className="sec-head lg:grid-cols-12 lg:items-end">
            <h2 className="t-h2 lg:col-span-7">How a warranty claim works</h2>
            <div className="lg:col-span-5 lg:justify-self-end">
              <a href={waLink('Hi, I would like to raise a warranty claim. Invoice number: ')} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
                Start a claim
              </a>
            </div>
          </div>
          <ol className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(([title, text], i) => (
              <li key={title} className="py-6 border-t border-[var(--line)] grid gap-2 content-start">
                <p className="label tabular-nums">Step {i + 1}</p>
                <h3 className="text-[19px] font-medium">{title}</h3>
                <p className="text-[15px] leading-[1.6] text-[var(--ink-soft)]">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Questions */}
      <section className="py-16 sm:py-24 bg-[var(--surface)]">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <h2 className="t-h2 lg:col-span-4">Warranty questions</h2>
          <div className="lg:col-span-7 lg:col-start-6"><FaqSearch items={FAQ} /></div>
        </div>
      </section>

      {/* Terms */}
      <section className="py-16 sm:py-24">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <h2 className="t-h3 lg:col-span-4">Warranty terms and conditions</h2>
          <div className="lg:col-span-7 lg:col-start-6 grid gap-8 text-[15px] leading-[1.65] text-[var(--ink-soft)]">
            {Object.values(WARRANTY_TERMS).map((s) => (
              <div key={s.title} className="grid gap-3">
                <h3 className="text-[17px] font-medium text-[var(--ink)]">{s.title}</h3>
                <ul className="grid gap-2 list-disc pl-5">{s.points.map((p) => <li key={p}>{p}</li>)}</ul>
                {'exclusions' in s && (
                  <>
                    <p className="text-[15px] font-medium text-[var(--ink)] pt-1">Not covered</p>
                    <ul className="grid gap-2 list-disc pl-5">{s.exclusions.map((e) => <li key={e}>{e}</li>)}</ul>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
