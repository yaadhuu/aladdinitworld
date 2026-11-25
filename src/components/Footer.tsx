import Link from 'next/link';
import { SITE_CONFIG, BUSINESS_HOURS } from '@/config';
import { ArrowRightIcon, InstagramIcon, MailIcon, WhatsAppIcon } from '@/components/Icons';
import { Wordmark } from '@/components/Navigation';
import { ChatButton } from '@/components/ChatButton';
import { FooterClose } from '@/components/FooterClose';
import { waLink } from '@/lib/whatsapp';

const columns = [
  {
    title: 'Shop',
    links: [
      { label: 'MacBooks in stock', href: '/products' },
      { label: 'Grades and checks', href: '/why-cpo' },
      { label: 'Business orders', href: '/b2b' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Warranty and service plan', href: '/warranty' },
      { label: 'FAQ', href: '/#faq' },
      { label: 'Customer reviews', href: '/#reviews' },
      { label: 'Contact and hours', href: '/contact' },
    ],
  },
];

// footer.closing: row 1 the close ("Need help?"), row 2 the directory, then the legal row
export function Footer() {
  const year = new Date().getFullYear();
  const { showroom } = SITE_CONFIG;
  return (
    <footer id="contact" className="bg-[var(--surface)] text-[var(--ink)]">
      <div className="wrap pt-12 sm:pt-20 pb-6 sm:pb-8">
        {/* Close (not on the home page, which has its own Need help section) */}
        <FooterClose>
          <div className="grid gap-5 sm:gap-8 lg:grid-cols-12 lg:items-end pb-10 sm:pb-16 mb-10 sm:mb-14 border-b border-[var(--line)]">
            <div className="lg:col-span-7 grid gap-2 sm:gap-4">
              <h2 className="t-h2">Need help choosing a MacBook?</h2>
              <p className="lead">Message our team with the model you want or your budget. We reply with live photos and the battery report.</p>
            </div>
            <div className="lg:col-span-5 lg:justify-self-end btn-row">
              <a data-main-action href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
                Contact us
              </a>
              <ChatButton>Ask in chat</ChatButton>
            </div>
          </div>
        </FooterClose>

        {/* Directory */}
        <div className="grid gap-x-5 gap-y-8 sm:gap-x-6 sm:gap-y-10 grid-cols-2 lg:grid-cols-12">
          <div className="col-span-2 lg:col-span-4 grid gap-3 sm:gap-4 content-start">
            <Link href="/" aria-label="Aladdin IT World, home" className="justify-self-start">
              <Wordmark />
            </Link>
            <p className="text-[14px] sm:text-[15px] leading-relaxed text-[var(--ink-soft)] max-w-[34ch]">
              Certified pre-owned MacBooks from Koduvally, Kerala, delivered insured across India.
            </p>
            <div className="flex gap-2 pt-1">
              {[
                { href: SITE_CONFIG.social.instagram, label: 'Aladdin IT World on Instagram', Icon: InstagramIcon },
                { href: `mailto:${SITE_CONFIG.social.email}`, label: 'Email Aladdin IT World', Icon: MailIcon },
                { href: waLink(), label: 'Aladdin IT World on WhatsApp', Icon: WhatsAppIcon },
              ].map(({ href, label, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-11 h-11 rounded-full border border-[var(--line)] inline-flex items-center justify-center text-[var(--ink)] transition-colors duration-200 hover:border-[var(--ink)]">
                  <Icon className="w-[18px] h-[18px]" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title} className="lg:col-span-2 min-w-0">
              <h3 className="label mb-1 sm:mb-2">{col.title}</h3>
              <ul>
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="link !min-h-[40px] sm:!min-h-[44px] text-[14px] sm:text-[15px] leading-snug">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="col-span-2 lg:col-span-4 grid grid-cols-2 gap-x-5 gap-y-8 sm:gap-x-6 content-start pt-6 border-t border-[var(--line)] lg:pt-0 lg:border-0">
            <div className="min-w-0">
              <h3 className="label mb-2 sm:mb-3">Showroom</h3>
              <address className="not-italic text-[14px] sm:text-[15px] leading-[1.55]">
                {showroom.lines.map((l) => <span key={l} className="block">{l}</span>)}
              </address>
              <a href={showroom.mapsUrl} target="_blank" rel="noopener noreferrer" className="link !min-h-[40px] text-[14px] sm:text-[15px] mt-1">
                Get directions
                <ArrowRightIcon className="w-4 h-4" />
              </a>
            </div>
            <div className="min-w-0">
              <h3 className="label mb-2 sm:mb-3">Hours</h3>
              <dl className="text-[14px] sm:text-[15px] leading-[1.55] grid grid-cols-1 [&>dd]:mb-2 sm:grid-cols-[auto_1fr] sm:gap-x-3 sm:[&>dd]:mb-0">
                <dt>Mon to Fri</dt><dd className="text-[var(--ink-soft)]">{BUSINESS_HOURS.monday.replace(':00', '').replace(':00', '').replace('AM', 'am').replace('PM', 'pm')}</dd>
                <dt>Saturday</dt><dd className="text-[var(--ink-soft)]">{BUSINESS_HOURS.saturday.replace(':00', '').replace(':00', '').replace('AM', 'am').replace('PM', 'pm')}</dd>
                <dt>Sunday</dt><dd className="text-[var(--ink-soft)]">{BUSINESS_HOURS.sunday}</dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Legal row */}
        <div className="mt-10 sm:mt-14 pt-5 pb-16 lg:pb-0 border-t border-[var(--line)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 text-[13px] text-[var(--ink-soft)]">
          <p>&copy; {year} Aladdin IT World</p>
          <div className="flex flex-wrap gap-x-5 sm:gap-x-6">
            <Link href="/privacy" className="link">Privacy</Link>
            <Link href="/terms" className="link">Terms</Link>
            <span className="inline-flex items-center min-h-[44px]">Photographs via Unsplash</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
