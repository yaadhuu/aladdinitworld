'use client';

import { ChatIcon, CheckIcon } from '@/components/Icons';
import { Reveal } from '@/components/Reveal';
import { SITE_CONFIG } from '@/config';

export default function B2BPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark">

      <section className="py-14 px-4 sm:px-6 lg:px-8 border-b border-accent/20 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto hero-seq">
          <p className="eyebrow mb-3">For Teams</p>
          <h1 className="font-display font-bold text-3xl sm:text-5xl text-black dark:text-white mb-4">
            CPO MacBooks<br />for Growing Teams
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl">
            Bulk pricing, flexible payment terms, and dedicated support for startups, educational institutions, and corporate teams.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-brand-dark">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '💰', title: 'Bulk Pricing', desc: 'Better per-unit pricing as your order quantity grows.' },
              { icon: '⚡', title: 'Fast Turnaround', desc: 'Get your team equipped quickly, without long procurement delays.' },
              { icon: '🛡️', title: 'Consistent Quality', desc: 'Every unit passes the same 100+ point inspection, regardless of order size.' },
              { icon: '👥', title: 'Dedicated Support', desc: 'A single point of contact for your order, delivery, and after-sales needs.' },
            ].map((item, idx) => (
              <Reveal key={idx} delay={(idx % 4) * 70}>
                <div className="h-full p-6 rounded-2xl border border-accent/20 bg-zinc-50 dark:bg-zinc-900 text-center t-ui hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5">
                  <p className="w-14 h-14 mx-auto rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-3xl mb-4" aria-hidden="true">{item.icon}</p>
                  <h3 className="font-bold text-black dark:text-white mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Real Case Studies */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-950 border-y border-accent/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">Case Studies</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-black dark:text-white">
              Real Clients, Real Outcomes
            </h2>
          </div>

          <div className="space-y-8">

          <div className="rounded-2xl border border-accent/20 bg-white dark:bg-zinc-900 overflow-hidden">

            <div className="p-7 sm:p-8 border-b border-accent/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="eyebrow mb-1">Corporate Client</p>
                <h3 className="font-display font-bold text-2xl text-black dark:text-white">
                  Codel Private Limited
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Kozhikode, Kerala</p>
              </div>
              <div className="flex gap-3">
                <div className="px-4 py-2 rounded-xl bg-accent/10 border border-accent/30 text-center">
                  <p className="font-bold text-xl text-accent">10</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Units</p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-accent/10 border border-accent/30 text-center">
                  <p className="font-bold text-xl text-accent">3 days</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Resolution</p>
                </div>
              </div>
            </div>

            <div className="p-7 sm:p-8 space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">The Order</p>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  Codel Private Limited purchased 10 CPO MacBook units from us at corporate bulk rates for their team.
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">What Happened</p>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  About 6 months in, 2 of the 10 units developed an issue — covered under our 5-Year Service Plan, which applies to every unit regardless of CPO grade.
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">How We Handled It</p>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  We didn&apos;t leave their team without machines while repairs were in progress — we issued immediate replacement units so work could continue uninterrupted. Both original units were repaired free of charge under the Service Plan, and the entire issue, from report to resolution, was closed in <span className="font-semibold text-black dark:text-white">3 days</span>.
                </p>
              </div>

              <div className="pt-4 border-t border-accent/10 flex items-start gap-3">
                <CheckIcon className="w-6 h-6 flex-shrink-0 text-accent" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This is what our 5-Year Service Plan looks like in practice — not just words on a page, but a real response when something actually goes wrong, long after the base warranty period.
                </p>
              </div>
            </div>
          </div>

          {/* Catafluence — recurring relationship case study */}
          <div className="rounded-2xl border border-accent/20 bg-white dark:bg-zinc-900 overflow-hidden">

            <div className="p-7 sm:p-8 border-b border-accent/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="eyebrow mb-1">Corporate Client</p>
                <h3 className="font-display font-bold text-2xl text-black dark:text-white">
                  Catafluence
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Influencer Marketing Platform</p>
              </div>
              <div className="flex gap-3">
                <div className="px-4 py-2 rounded-xl bg-accent/10 border border-accent/30 text-center">
                  <p className="font-bold text-xl text-accent">2+ yrs</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Relationship</p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-accent/10 border border-accent/30 text-center">
                  <p className="font-bold text-xl text-accent">Recurring</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Orders</p>
                </div>
              </div>
            </div>

            <div className="p-7 sm:p-8 space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">The Relationship</p>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  Catafluence, an influencer marketing platform, has been sourcing CPO MacBooks from us for over 2 years as their team has grown — not a single bulk order, but recurring purchases as new hires join.
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Why They Keep Coming Back</p>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  For a fast-growing team, reliability matters more than any single transaction. Every unit we&apos;ve supplied has held up consistently, which is why Catafluence returns to us each time their headcount grows rather than shopping around.
                </p>
              </div>

              <div className="pt-4 border-t border-accent/10 flex items-start gap-3">
                <CheckIcon className="w-6 h-6 flex-shrink-0 text-accent" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  A 2-year recurring relationship says more about device reliability than any single order can — this is what it looks like when a corporate client trusts us enough to keep coming back.
                </p>
              </div>
            </div>
          </div>

          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-brand-dark">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl text-black dark:text-white mb-4">
            Tell Us What You Need
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Share your requirements on WhatsApp — number of units, budget range, and timeline — and we&apos;ll get back with a custom quote.
          </p>
          <a
            href={`${SITE_CONFIG.social.whatsapp}?text=${encodeURIComponent("Hi! We're looking for CPO MacBooks for our team. Could you share bulk pricing options?")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold"
          >
            <ChatIcon className="w-5 h-5" />
            Get a Bulk Quote
          </a>
        </div>
      </section>
    </div>
  );
}
