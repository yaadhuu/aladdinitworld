import { SITE_CONFIG, TIERS } from '@/config';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <section className="py-14 px-4 sm:px-6 lg:px-8 border-b border-accent/20 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 text-accent">Legal</p>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-black dark:text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">

            <div>
              <h2 className="font-bold text-xl text-black dark:text-white mb-3">1. Acceptance of Terms</h2>
              <p>
                By purchasing from Aladdin IT World or using our website, you agree to the terms outlined here. If you do not agree, please do not use our services.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-xl text-black dark:text-white mb-3">2. Product Condition & Grading</h2>
              <p className="mb-3">
                All devices sold are Certified Pre-Owned (CPO) and graded into one of three tiers:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                {(['refurb', 'certified', 'pristine'] as const).map((key) => (
                  <li key={key}>
                    <span className="font-semibold text-black dark:text-white">{TIERS[key].label}:</span>{' '}
                    {TIERS[key].description}
                  </li>
                ))}
              </ul>
              <p className="mt-3">
                Cosmetic condition and battery health for each unit are disclosed honestly prior to purchase. By completing a purchase, you accept the disclosed condition for that grade.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-xl text-black dark:text-white mb-3">3. Warranty</h2>
              <p className="mb-3">Each purchase includes two layers of coverage:</p>
              <p className="mb-2 font-semibold text-black dark:text-white">Base Warranty (by grade):</p>
              <ul className="list-disc pl-6 space-y-1 mb-3">
                {(['refurb', 'certified', 'pristine'] as const).map((key) => (
                  <li key={key}>{TIERS[key].label}: {TIERS[key].warranty}</li>
                ))}
              </ul>
              <p className="mb-3">
                The base warranty covers manufacturing defects and functional hardware issues existing at the time of sale. It does not cover accidental damage, liquid damage, unauthorized repairs, or normal wear and tear. Exact duration depends on the specific unit, capped at a maximum of 90 days from the date of invoice.
              </p>
              <p className="mb-2 font-semibold text-black dark:text-white">5-Year Service Plan (every grade):</p>
              <p>
                In addition to the base warranty, every purchase includes a 5-year service plan from the date of purchase — service charges are completely free, and spare parts are available at up to 50% discount. Spare parts used are original used/refurbished parts, subject to availability, and replacement of parts does not extend the original warranty period. Full details are available on our{' '}
                <a href="/warranty" className="text-accent hover:underline">Warranty page</a>.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-xl text-black dark:text-white mb-3">4. Pricing & Payment</h2>
              <p>
                Prices listed are in Indian Rupees (₹) and are subject to change without prior notice. Payment must be completed in full before dispatch unless otherwise agreed in writing (e.g. for approved EMI or corporate payment terms).
              </p>
            </div>

            <div>
              <h2 className="font-bold text-xl text-black dark:text-white mb-3">5. Shipping & Delivery</h2>
              <p>
                We aim to dispatch orders promptly and ship via insured courier partners. Delivery timelines may vary based on location. Risk of loss or damage in transit is covered until the product reaches you.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-xl text-black dark:text-white mb-3">6. Returns</h2>
              <p>
                If you believe a device does not match its disclosed grade or condition, contact us within 48 hours of delivery via WhatsApp. We will assess the issue and, if validated, offer a repair, replacement, or refund at our discretion.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-xl text-black dark:text-white mb-3">7. Limitation of Liability</h2>
              <p>
                Aladdin IT World's liability for any claim relating to a purchase is limited to the purchase price of the device in question. We are not liable for indirect, incidental, or consequential damages.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-xl text-black dark:text-white mb-3">8. Governing Law & Jurisdiction</h2>
              <p>
                These terms are governed by the laws of India. All disputes, claims, or legal proceedings arising out of or relating to the sale, warranty, or service of products shall be subject to the exclusive jurisdiction of courts in Thamarassery only.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-xl text-black dark:text-white mb-3">9. Contact</h2>
              <p>
                For any questions regarding these Terms, reach us at{' '}
                <a href={`mailto:${SITE_CONFIG.social.email}`} className="text-accent hover:underline">
                  {SITE_CONFIG.social.email}
                </a>{' '}
                or WhatsApp at {SITE_CONFIG.social.phone}.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
