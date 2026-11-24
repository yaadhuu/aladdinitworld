import { SITE_CONFIG, BUSINESS_HOURS } from '@/config';
import { ArrowRightIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from '@/components/Icons';
import { waLink } from '@/lib/whatsapp';

const icon = 'w-5 h-5 flex-none text-[var(--ink)]';
const fmt = (h: string) => h.replace(/:00/g, '').replace(/AM/g, 'am').replace(/PM/g, 'pm');

export default function ContactPage() {
  const { phone, email } = SITE_CONFIG.social;
  const { showroom } = SITE_CONFIG;
  const days = Object.entries(BUSINESS_HOURS);

  return (
    <>
      <section className="pt-10 sm:pt-20 pb-10 sm:pb-14">
        <div className="wrap grid gap-3 sm:gap-4">
          <h1 className="t-h1 !text-[clamp(34px,3vw+22px,64px)]">Visit us or get in touch</h1>
          <p className="lead">WhatsApp is the fastest way to reach us. Most questions are answered within the hour.</p>
        </div>
      </section>

      <section className="pb-14 sm:pb-24">
        <div className="wrap grid gap-5 lg:grid-cols-12">
          {/* Showroom */}
          <div className="lg:col-span-7 card card--grey p-6 sm:p-10 gap-6">
            <div className="grid gap-2">
              <p className="label">Showroom</p>
              <address className="not-italic text-[22px] sm:text-[28px] leading-[1.25] tracking-[-0.02em]">
                {showroom.lines.map((l) => <span key={l} className="block">{l}</span>)}
              </address>
            </div>
            <dl className="grid gap-0 max-w-[420px]">
              {days.map(([day, hours]) => (
                <div key={day} className="flex justify-between gap-6 py-2.5 border-b border-[var(--line)] text-[15px]">
                  <dt className="capitalize">{day}</dt>
                  <dd className="text-[var(--ink-soft)] tabular-nums">{fmt(hours)}</dd>
                </div>
              ))}
            </dl>
            <div className="btn-row mt-auto">
              <a href={showroom.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
                Get directions<span className="sr-only"> (opens Google Maps)</span>
              </a>
            </div>
          </div>

          {/* Ways to reach us */}
          <div className="lg:col-span-5 grid gap-5 content-start order-first lg:order-none">
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="card card--lift p-6 sm:p-8 gap-3 !bg-[var(--ink)] text-white">
              <WhatsAppIcon className="w-6 h-6" />
              <span className="text-[22px] font-medium tracking-[-0.015em]">Message us</span>
              <span className="text-[15px] text-white/70">On WhatsApp. Send a model, a budget or a question: we reply with live photos and the battery report.</span>
              <span className="inline-flex items-center gap-2 text-[15px] font-medium mt-1">Start a chat <ArrowRightIcon className="w-4 h-4" /></span>
            </a>
            <ul className="card card--grey px-4 sm:px-6 py-1 gap-0">
              <li className="border-b border-[var(--line)]">
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="help-row"><PhoneIcon className={icon} /><span className="flex-1">{phone}</span><ArrowRightIcon className="w-4 h-4" /></a>
              </li>
              <li className="border-b border-[var(--line)]">
                <a href={`mailto:${email}`} className="help-row"><MailIcon className={icon} /><span className="flex-1 break-all">{email}</span><ArrowRightIcon className="w-4 h-4" /></a>
              </li>
              <li>
                <a href={showroom.mapsUrl} target="_blank" rel="noopener noreferrer" className="help-row"><PinIcon className={icon} /><span className="flex-1">Open in Google Maps</span><ArrowRightIcon className="w-4 h-4" /></a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
