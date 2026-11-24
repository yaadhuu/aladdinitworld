import { waLink } from '@/lib/whatsapp';

const BENEFITS = [
  { title: 'Bulk pricing', desc: 'Better per-unit pricing as your order grows.' },
  { title: 'Fast turnaround', desc: 'Your team equipped quickly, without long procurement delays.' },
  { title: 'Consistent quality', desc: 'Every unit passes the same inspection, whatever the order size.' },
  { title: 'One point of contact', desc: 'One person for your order, delivery and after-sales needs.' },
];

const CASES = [
  {
    client: 'Codel Private Limited',
    meta: 'Corporate client · Kozhikode, Kerala',
    facts: [['10', 'MacBooks'], ['3 days', 'issue to resolution']],
    rows: [
      ['The order', 'Codel bought 10 certified pre-owned MacBooks from us at corporate rates for their team.'],
      ['What happened', 'About six months in, two of the ten units developed an issue, covered under our 5-year service plan, which applies to every unit whatever its grade.'],
      ['How we handled it', 'We sent replacement units straight away so their team could keep working, repaired both originals free of charge under the plan, and closed the whole issue in three days.'],
    ],
  },
  {
    client: 'Catafluence',
    meta: 'Corporate client · Influencer marketing platform',
    facts: [['2+ years', 'working together'], ['Recurring', 'orders']],
    rows: [
      ['The relationship', 'Catafluence has sourced its MacBooks from us for over two years, buying again each time new people join the team.'],
      ['Why they come back', 'For a growing team, reliability matters more than any single order. The units we supply hold up, so they return to us instead of shopping around.'],
    ],
  },
];

const QUOTE_TEXT = "Hi, we're looking for MacBooks for our team. Number of units: , budget per unit: , needed by: ";

export default function B2BPage() {
  return (
    <>
      <section className="pt-10 sm:pt-20 pb-12 sm:pb-16">
        <div className="wrap grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8 grid gap-3 sm:gap-4">
            <h1 className="t-h1 !text-[clamp(34px,3vw+22px,64px)] max-w-[16ch]">MacBooks for growing teams</h1>
            <p className="lead">Bulk pricing, flexible payment terms and dedicated support for startups, colleges and companies.</p>
          </div>
          <div className="lg:col-span-4 lg:justify-self-end">
            <a href={waLink(QUOTE_TEXT)} target="_blank" rel="noopener noreferrer" className="btn btn--primary">Get a bulk quote</a>
          </div>
        </div>
      </section>

      <section aria-label="What teams get" className="pb-14 sm:pb-24">
        <ol className="wrap grid gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b, i) => (
            <li key={b.title} className="py-6 border-t border-[var(--line)] grid gap-2 content-start">
              <p className="label tabular-nums">{String(i + 1).padStart(2, '0')}</p>
              <h2 className="text-[19px] font-medium tracking-[-0.01em]">{b.title}</h2>
              <p className="text-[15px] leading-[1.6] text-[var(--ink-soft)]">{b.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="py-14 sm:py-24 bg-[var(--surface)]">
        <div className="wrap">
          <div className="sec-head">
            <h2 className="t-h2">Teams that buy from us</h2>
            <p className="lead">Two companies, in their own situations.</p>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {CASES.map((c) => (
              <article key={c.client} className="card p-6 sm:p-8 gap-6">
                <header className="grid gap-1">
                  <p className="label">{c.meta}</p>
                  <h3 className="t-h3">{c.client}</h3>
                </header>
                <dl className="grid grid-cols-2 gap-4">
                  {c.facts.map(([v, l]) => (
                    <div key={l} className="border-t border-[var(--line)] pt-3">
                      <dt className="text-[24px] sm:text-[28px] font-semibold tracking-[-0.02em] leading-none tabular-nums">{v}</dt>
                      <dd className="text-[14px] text-[var(--ink-soft)] mt-1.5">{l}</dd>
                    </div>
                  ))}
                </dl>
                <dl className="grid gap-4">
                  {c.rows.map(([k, v]) => (
                    <div key={k} className="grid gap-1">
                      <dt className="text-[15px] font-medium">{k}</dt>
                      <dd className="text-[15px] leading-[1.6] text-[var(--ink-soft)]">{v}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-24">
        <div className="wrap grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7 grid gap-3">
            <h2 className="t-h2">Tell us what your team needs</h2>
            <p className="lead">Send the number of units, a budget range and your timeline on WhatsApp. We reply with a quote.</p>
          </div>
          <div className="lg:col-span-5 lg:justify-self-end">
            <a href={waLink(QUOTE_TEXT)} target="_blank" rel="noopener noreferrer" className="btn btn--primary">Get a bulk quote</a>
          </div>
        </div>
      </section>
    </>
  );
}
