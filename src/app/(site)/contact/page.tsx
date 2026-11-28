import { pageMeta } from '@/lib/seo';
import { SITE_CONFIG } from '@/config';
import { ArrowRightIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from '@/components/Icons';
import { ShowroomHours } from '@/components/ShowroomHours';
import { waLink } from '@/lib/whatsapp';

// Google's keyless embed of the same search the "Get directions" link opens
const MAP_EMBED = 'https://www.google.com/maps?q=E.C.+Building,+Koduvally+Bus+Stand,+Koduvally,+Kerala&z=17&output=embed';

export const metadata = pageMeta({
  title: "Visit Us or Get in Touch | Aladdin IT World",
  description: "Find our showroom at E.C. Building, Koduvally Bus Stand, Kerala, check opening hours, or message us on WhatsApp.",
  path: "/contact",
});

export default function ContactPage() {
  const { phone, email } = SITE_CONFIG.social;
  const { showroom } = SITE_CONFIG;

  const ways = [
    { href: waLink(), label: 'WhatsApp', detail: `${phone} · fastest reply`, Icon: WhatsAppIcon, external: true },
    { href: `tel:${phone.replace(/\s/g, '')}`, label: 'Call', detail: phone, Icon: PhoneIcon },
    { href: `mailto:${email}`, label: 'Email', detail: email, Icon: MailIcon },
    { href: showroom.mapsUrl, label: 'Directions', detail: 'Open in Google Maps', Icon: PinIcon, external: true },
  ];

  return (
    <>
      <section className="pt-10 sm:pt-20 pb-8 sm:pb-12">
        <div className="wrap grid gap-3 sm:gap-4">
          <h1 className="t-h1 !text-[clamp(34px,3vw+22px,64px)]">Visit us or get in touch</h1>
          <p className="lead max-w-[52ch]">WhatsApp is the fastest way to reach us. Most questions are answered within the hour.</p>
        </div>
      </section>

      <section aria-labelledby="showroom" className="pb-14 sm:pb-24">
        <div className="wrap grid gap-4 lg:grid-cols-12 lg:gap-6">
          {/* The ways to reach us first, then the address and live hours */}
          <div className="lg:col-span-5 grid gap-4 content-start">
            <ul className="reach-list" aria-label="Ways to reach us">
              {ways.map(({ href, label, detail, Icon, external }) => (
                <li key={label}>
                  <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="reach-row">
                    <span className="reach-row__icon"><Icon className="w-[18px] h-[18px]" /></span>
                    <span className="min-w-0 flex-1 grid">
                      <span className="text-[15px] font-medium leading-tight">{label}</span>
                      <span className="text-[13px] text-[var(--ink-soft)] leading-tight truncate">{detail}</span>
                    </span>
                    <ArrowRightIcon className="reach-row__arrow w-4 h-4 flex-none" />
                    {external && <span className="sr-only"> (opens in a new tab)</span>}
                  </a>
                </li>
              ))}
            </ul>

            <div className="rounded-[var(--r-lg)] bg-[var(--surface)] p-5 sm:p-7 grid gap-5">
              <div className="grid gap-1.5">
                <h2 id="showroom" className="label">Showroom</h2>
                <address className="not-italic text-[18px] sm:text-[22px] leading-[1.3] tracking-[-0.015em] font-semibold">
                  {showroom.lines.map((l) => <span key={l} className="block">{l}</span>)}
                </address>
              </div>
              <ShowroomHours />
            </div>
          </div>

          {/* The live map */}
          <div className="map-frame lg:col-span-7 aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:min-h-[560px]">
            <iframe src={MAP_EMBED} title="Map of the Aladdin IT World showroom in Koduvally" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 w-full h-full border-0" />
          </div>
        </div>
      </section>
    </>
  );
}
