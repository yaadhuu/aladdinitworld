import Link from 'next/link';
import { TIERS } from '@/config';
import { ArrowRightIcon, CheckIcon } from '@/components/Icons';
import { TIER_ORDER, warrantyShort } from '@/lib/products';

const INSPECTION_AREAS = [
  { title: 'Identity and ownership', checks: 10, summary: 'Serial, model, chip, RAM and storage verified. Activation Lock, MDM and Find My checked first; a device that fails is rejected.' },
  { title: 'Display', checks: 8, summary: 'Checked under torch light for dead or stuck pixels, backlight bleed, burn-in and scratches. A cracked screen is rejected.' },
  { title: 'Chassis and body', checks: 7, summary: 'Every surface checked for scratches and dents. Hinge tested over 10 open and close cycles; ports checked for corrosion.' },
  { title: 'Keyboard and trackpad', checks: 5, summary: 'Every key tested, backlight zones checked for evenness, trackpad click verified across its whole surface.' },
  { title: 'Battery', checks: 5, summary: 'Health percentage and cycle count recorded, charge and discharge tested against the grade’s minimum.' },
  { title: 'Screen and GPU', checks: 5, summary: 'Full white and black screen tests, colour, brightness range and a GPU stress test.' },
  { title: 'Storage', checks: 4, summary: 'S.M.A.R.T. status, real read and write speeds, and capacity against the listing.' },
  { title: 'Memory', checks: 2, summary: 'Size confirmed and a full memory stress test run; zero errors to pass.' },
  { title: 'Ports and wireless', checks: 6, summary: 'Every USB-C and Thunderbolt port, MagSafe, headphone jack and SD slot; Wi-Fi and Bluetooth stability.' },
  { title: 'Audio and camera', checks: 3, summary: 'Both speakers, the microphone recorded and played back, the camera for clarity.' },
  { title: 'System and thermals', checks: 6, summary: 'Apple Diagnostics, a CPU stress test, fans, restart and sleep and wake cycles.' },
  { title: 'Touch ID and keys', checks: 3, summary: 'Touch ID enrolled and tested, every function key confirmed.' },
  { title: 'Repair history', checks: 5, summary: 'Internal check for past repairs. Non-original parts are recorded and set the grade; liquid damage is rejected.' },
];

const CRITERIA: { factor: string; pristine: string; certified: string; refurb: string }[] = [
  { factor: 'Body', pristine: 'No marks', certified: 'Light scratches only', refurb: 'Scratches or minor dents' },
  { factor: 'Screen', pristine: 'Flawless', certified: 'Light scratches only', refurb: 'Scratches or minor marks' },
  { factor: 'Battery health', pristine: '90% or more', certified: 'Report on request', refurb: 'Report on request' },
  { factor: 'Diagnostics', pristine: 'All pass', certified: 'All pass', refurb: 'All pass, after repair if needed' },
  { factor: 'Repair history', pristine: 'None preferred', certified: 'Minor accepted', refurb: 'Repairs accepted' },
  { factor: 'Warranty', pristine: '6 months', certified: '3 months', refurb: '1 month' },
];

const COMPARE: [string, string, string][] = [
  ['Professional inspection', 'No', 'Yes, 100+ points'],
  ['Documented condition grade', 'No', 'Yes'],
  ['Battery health report', 'Sometimes', 'Always, on request'],
  ['Activation Lock checked', 'No', 'Yes'],
  ['Warranty', 'None', '1 to 6 months'],
  ['5-year service plan', 'None', 'Included'],
  ['Exchange or upgrade later', 'No', 'Yes'],
];

const REJECTED = ['Activation Lock present', 'MDM enrolment found', 'Find My still on', 'Cracked screen or body', 'Any failed diagnostic', 'Liquid damage or corrosion'];

export default function WhyCPOPage() {
  return (
    <>
      <section className="pt-14 sm:pt-20 pb-16 sm:pb-20">
        <div className="wrap grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7 grid gap-5">
            <h1 className="t-h1 !text-[clamp(40px,3vw+24px,64px)] max-w-[14ch]">How we grade every MacBook</h1>
            <p className="lead">Each MacBook goes through a documented 100+ point inspection across 13 areas, then gets one of three grades with its own warranty.</p>
          </div>
          <dl className="lg:col-span-5 grid grid-cols-2 gap-x-6 gap-y-6">
            {[['100+', 'inspection points'], ['13', 'areas checked'], ['3', 'grades'], ['5 years', 'service plan']].map(([v, l]) => (
              <div key={l} className="border-t border-[var(--line)] pt-4">
                <dt className="text-[32px] leading-none tracking-[-0.02em] tabular-nums">{v}</dt>
                <dd className="text-[15px] text-[var(--ink-soft)] mt-1.5">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Grades */}
      <section className="py-16 sm:py-24 bg-[var(--surface)]">
        <div className="wrap">
          <h2 className="t-h2 mb-10 sm:mb-12">The three grades</h2>
          <ul className="grid gap-6 md:grid-cols-3">
            {TIER_ORDER.map((k) => {
              const t = TIERS[k];
              return (
                <li key={k} className="card p-7 sm:p-8 gap-5">
                  <div className="grid gap-1">
                    <p className="label">{t.tagline}</p>
                    <h3 className="t-h3">{t.label.replace('CPO ', '')}</h3>
                    <p className="text-[17px] text-[var(--ink-soft)]">{warrantyShort(k)} warranty</p>
                  </div>
                  <p className="text-[16px] leading-[1.6] text-[var(--ink-soft)]">{t.description}</p>
                  <ul className="grid gap-2.5 pt-5 border-t border-[var(--line)] mt-auto">
                    {t.includes.map((inc) => (
                      <li key={inc} className="flex gap-3 text-[15px] leading-snug">
                        <CheckIcon className="w-4 h-4 mt-0.5 flex-none text-[var(--accent)]" />
                        {inc}
                      </li>
                    ))}
                    {t.caveats.map((c) => (
                      <li key={c} className="flex gap-3 text-[15px] leading-snug text-[var(--ink-soft)]">
                        <span aria-hidden="true" className="w-4 flex-none text-center">·</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Criteria table */}
      <section className="py-16 sm:py-24">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4 grid gap-4 content-start">
            <h2 className="t-h2">How a grade is set</h2>
            <p className="lead">After the inspection, the lowest result decides the grade. When in doubt, we grade lower.</p>
          </div>
          <div className="lg:col-span-8 min-w-0 overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0" role="region" aria-label="Grade criteria" tabIndex={0}>
            <table className="w-full min-w-[560px] text-left">
              <thead>
                <tr className="label border-b border-[var(--line)]">
                  <th scope="col" className="py-3 pr-4 font-medium">Factor</th>
                  <th scope="col" className="py-3 pr-4 font-medium">Pristine</th>
                  <th scope="col" className="py-3 pr-4 font-medium">Certified</th>
                  <th scope="col" className="py-3 font-medium">Refurbished</th>
                </tr>
              </thead>
              <tbody>
                {CRITERIA.map((r) => (
                  <tr key={r.factor} className="border-b border-[var(--line)] text-[15px] sm:text-[16px]">
                    <th scope="row" className="py-4 pr-4 font-medium">{r.factor}</th>
                    <td className="py-4 pr-4 text-[var(--ink-soft)]">{r.pristine}</td>
                    <td className="py-4 pr-4 text-[var(--ink-soft)]">{r.certified}</td>
                    <td className="py-4 text-[var(--ink-soft)]">{r.refurb}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Inspection areas */}
      <section className="py-16 sm:py-24 bg-[var(--surface)]">
        <div className="wrap">
          <div className="sec-head lg:grid-cols-12 lg:items-end">
            <h2 className="t-h2 lg:col-span-6">The 13 inspection areas</h2>
            <p className="lead lg:col-span-5 lg:col-start-8">The core checks below, plus sub-checks for every port, key and component.</p>
          </div>
          <ol className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
            {INSPECTION_AREAS.map((a, i) => (
              <li key={a.title} className="py-6 border-t border-[var(--line)] grid gap-2 content-start">
                <p className="label tabular-nums">{String(i + 1).padStart(2, '0')} · {a.checks} checks</p>
                <h3 className="text-[19px] font-medium tracking-[-0.01em]">{a.title}</h3>
                <p className="text-[15px] leading-[1.6] text-[var(--ink-soft)]">{a.summary}</p>
              </li>
            ))}
          </ol>

          <div className="mt-12 card p-7 sm:p-8">
            <h3 className="text-[19px] font-medium mb-5">Rejected outright, in every grade</h3>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {REJECTED.map((r) => (
                <li key={r} className="flex items-center gap-3 text-[15px]">
                  <span aria-hidden="true" className="w-5 h-5 rounded-full border border-[var(--line)] inline-flex items-center justify-center text-[11px] text-[var(--ink-soft)] flex-none">✕</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Compared with buying used */}
      <section className="py-16 sm:py-24">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4 grid gap-4 content-start">
            <h2 className="t-h2">Compared with buying used</h2>
            <p className="lead">A private sale on OLX or Facebook comes with none of this.</p>
            <Link href="/products" className="link link--static justify-self-start">
              Shop MacBook
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
          <div className="lg:col-span-8">
            <div className="grid grid-cols-[1.4fr_0.8fr_1fr] gap-4 pb-3 label border-b border-[var(--line)]">
              <span>What you get</span><span>Private sale</span><span>Aladdin IT World</span>
            </div>
            {COMPARE.map(([item, used, us]) => (
              <div key={item} className="grid grid-cols-[1.4fr_0.8fr_1fr] gap-4 py-4 border-b border-[var(--line)] text-[15px] sm:text-[16px]">
                <span className="font-medium">{item}</span>
                <span className="text-[var(--muted)]">{used}</span>
                <span className="flex gap-2"><CheckIcon className="w-4 h-4 mt-1 flex-none text-[var(--accent)]" />{us}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
