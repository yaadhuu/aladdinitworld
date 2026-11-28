import { pageMeta } from '@/lib/seo';
import { waLink } from '@/lib/whatsapp';
import { SpotlightCard } from '@/components/SpotlightCard';
import { CaseSwitcher } from '@/components/b2b/CaseSwitcher';

const BENEFITS = [
  { title: 'Bulk pricing', desc: 'Better per-unit pricing as your order grows.' },
  { title: 'Fast turnaround', desc: 'Units ready to ship in days, not weeks.' },
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

// Simple line icons for the four benefits, in the same order
const ICONS = [
  <path key='a' d='M4 12.5 11.5 5H19v7.5L11.5 20 4 12.5Z M15 9h.01' />,
  <path key='b' d='M13 3 5 13.5h6L10 21l9-11.5h-6L13 3Z' />,
  <path key='c' d='M12 3 5 6v5.5c0 4.2 3 7.8 7 9.5 4-1.7 7-5.3 7-9.5V6l-7-3Z M9 12l2 2 4-4' />,
  <path key='d' d='M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M4.5 20a7.5 7.5 0 0 1 15 0' />,
];

export const metadata = pageMeta({
  title: "MacBooks for Teams and Businesses | Aladdin IT World",
  description: "Bulk pricing, flexible payment terms and dedicated support for startups, colleges and companies buying MacBooks.",
  path: "/b2b",
});

export default function B2BPage() {
  return (
    <>
      <section className="pt-10 sm:pt-20 pb-10 sm:pb-14">
        <div className="wrap grid gap-5 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8 grid gap-3 sm:gap-4">
            <h1 className="t-h1 !text-[clamp(34px,3vw+22px,64px)] max-w-[16ch]">MacBooks for growing teams</h1>
            <p className="lead max-w-[52ch]">Bulk pricing, flexible payment terms and dedicated support for startups, colleges and companies.</p>
          </div>
          <div className="lg:col-span-4 lg:justify-self-end">
            <a href={waLink(QUOTE_TEXT)} target="_blank" rel="noopener noreferrer" className="btn btn--primary">Get a bulk quote</a>
          </div>
        </div>
      </section>

      {/* What teams get: four cards, the icon fills on hover */}
      <section aria-label="What teams get" className="pb-14 sm:pb-24">
        <ul className="wrap grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {BENEFITS.map((b, i) => (
            <li key={b.title}>
              <SpotlightCard className="benefit h-full rounded-[var(--r-lg)] border border-[var(--line)] p-4 sm:p-6 grid gap-3 content-start">
                <span className="benefit__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{ICONS[i]}</svg>
                </span>
                <h2 className="text-[16px] sm:text-[19px] font-semibold tracking-[-0.01em] leading-snug">{b.title}</h2>
                <p className="text-[13px] sm:text-[15px] leading-[1.55] text-[var(--ink-soft)]">{b.desc}</p>
              </SpotlightCard>
            </li>
          ))}
        </ul>
      </section>

      {/* Client stories, one at a time */}
      <section aria-labelledby="teams" className="py-14 sm:py-24 bg-[var(--surface)]">
        <div className="wrap grid gap-7 sm:gap-10">
          <div className="grid gap-2 sm:gap-3">
            <h2 id="teams" className="t-h2">Teams that buy from us</h2>
            <p className="lead">Two companies, in their own situations.</p>
          </div>
          <CaseSwitcher cases={CASES} />
        </div>
      </section>

      {/* Close: one dark band */}
      <section className="py-14 sm:py-24 bg-[var(--inv-bg)] text-[var(--inv-ink)]">
        <div className="wrap grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7 grid gap-3">
            <h2 className="t-h2">Tell us what your team needs</h2>
            <p className="lead !text-[var(--inv-muted)]">Send the number of units, a budget range and your timeline on WhatsApp. We reply with a quote.</p>
          </div>
          <div className="lg:col-span-5 lg:justify-self-end">
            <a href={waLink(QUOTE_TEXT)} target="_blank" rel="noopener noreferrer" className="btn bg-white text-black hover:bg-[#e8e8ed]">Get a bulk quote</a>
          </div>
        </div>
      </section>
    </>
  );
}
