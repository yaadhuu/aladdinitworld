'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MAIN_ACTION, waLink } from '@/lib/whatsapp';

export const NAV_LINKS = [
  { label: 'MacBooks', href: '/products' },
  { label: 'Grades', href: '/why-cpo' },
  { label: 'Warranty', href: '/warranty' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Business', href: '/b2b' },
  { label: 'Visit us', href: '/contact' },
];

/** The client's lamp mark beside the name; the footer repeats it */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} translate="no">
      <Image src="/logo.png" alt="" width={517} height={256} priority className="h-7 sm:h-8 w-auto flex-none" />
      <span className="text-[17px] sm:text-[18px] font-semibold leading-none tracking-[-0.02em] whitespace-nowrap">Aladdin IT World</span>
    </span>
  );
}

export function Navigation() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[rgba(255,255,255,0.88)] backdrop-blur-xl backdrop-saturate-150 border-b border-[var(--line)]">
      <div className="wrap h-[var(--nav)] flex items-center justify-between gap-6">
        <Link href="/" aria-label="Aladdin IT World, home" className="text-[var(--ink)]">
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="hidden lg:flex items-center gap-9 xl:gap-11">
          {NAV_LINKS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`relative py-2 text-[15px] whitespace-nowrap transition-colors duration-200 hover:text-[var(--ink)]
                  after:absolute after:left-0 after:right-0 after:-bottom-[3px] after:h-px after:bg-[var(--ink)] after:origin-left after:transition-transform after:duration-300
                  ${active ? 'text-[var(--ink)] font-medium after:scale-x-100' : 'text-[var(--ink-soft)] after:scale-x-0 hover:after:scale-x-100'}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <a data-main-action href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn--primary btn--sm">
          {MAIN_ACTION}
          <span className="sr-only"> on WhatsApp</span>
        </a>
      </div>
    </header>
  );
}
