'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MAIN_ACTION, waLink } from '@/lib/whatsapp';

export const NAV_LINKS = [
  { label: 'MacBooks', href: '/products' },
  { label: 'Grades', href: '/why-cpo' },
  { label: 'Warranty', href: '/warranty' },
  { label: 'Business', href: '/b2b' },
  { label: 'Visit us', href: '/contact' },
];

/** The client's lamp mark beside the name; the footer repeats it */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} translate="no">
      <Image src="/logo.png" alt="" width={517} height={256} priority className="h-[22px] sm:h-6 w-auto flex-none" />
      <span className="text-[15px] sm:text-[16px] font-semibold leading-none tracking-[-0.015em] whitespace-nowrap">Aladdin IT World</span>
    </span>
  );
}

export function Navigation() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname.startsWith(href);

  // On the home page the header floats over the dark hero with light text, then turns white
  // Start dark on the home page so the first paint already matches the hero (no white flash)
  const [dark, setDark] = useState(pathname === '/');
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => { setMenu(false); }, [pathname]);
  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menu]);
  useEffect(() => {
    const hero = pathname === '/' ? document.getElementById('hero') : null;
    if (!hero) { setDark(false); return; }
    // one measurement per frame at most; React skips the render when nothing changed
    let raf = 0;
    const measure = () => { raf = 0; setDark(hero.getBoundingClientRect().bottom > 72); setScrolled(window.scrollY > 8); };
    const check = () => { if (!raf) raf = requestAnimationFrame(measure); };
    measure();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', check); window.removeEventListener('resize', check); };
  }, [pathname]);

  return (
    <header data-dark={dark && !menu} data-scrolled={scrolled} className="site-header fixed inset-x-0 top-0 z-50 bg-[rgba(255,255,255,0.88)] backdrop-blur-xl backdrop-saturate-150 border-b border-[var(--line)]">
      <div className="wrap h-[var(--nav)] flex items-center justify-between gap-6">
        <Link href="/" aria-label="Aladdin IT World, home" className="text-[var(--ink)]">
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="hidden lg:flex items-center gap-9 xl:gap-11">
          {[{ label: 'Home', href: '/' }, ...NAV_LINKS].map((item) => {
            const active = item.href === '/' ? pathname === '/' : isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`relative py-2 text-[14px] whitespace-nowrap transition-colors duration-200 hover:text-[var(--ink)]
                  after:absolute after:left-0 after:right-0 after:-bottom-[3px] after:h-px after:bg-[var(--ink)] after:origin-left after:transition-transform after:duration-300
                  ${active ? 'text-[var(--ink)] font-medium after:scale-x-100' : 'text-[var(--ink-soft)] after:scale-x-0 hover:after:scale-x-100'}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <a data-main-action href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn--secondary btn--sm">
            {MAIN_ACTION}
            <span className="sr-only"> on WhatsApp</span>
          </a>
          <button type="button" className="menu-btn lg:hidden" aria-expanded={menu} aria-controls="site-menu" aria-label={menu ? 'Close menu' : 'Open menu'} onClick={() => setMenu((m) => !m)}>
            <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              {menu ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 9h16M4 15h16" />}
            </svg>
          </button>
        </div>
      </div>
      {menu && (
        <nav id="site-menu" aria-label="Menu" className="menu-sheet lg:hidden">
          <ul className="wrap py-2">
            {[{ label: 'Home', href: '/' }, ...NAV_LINKS].map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={(item.href === '/' ? pathname === '/' : isActive(item.href)) ? 'page' : undefined} onClick={() => setMenu(false)}>
                  {item.label}
                  <svg viewBox="0 0 20 20" className="w-4 h-4 text-[#6e6e73]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M8 5l5 5-5 5" /></svg>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
