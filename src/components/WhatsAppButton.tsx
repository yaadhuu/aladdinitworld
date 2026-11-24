'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { openChat } from '@/lib/whatsapp';

const icon = 'w-[22px] h-[22px]';
const TABS = [
  {
    label: 'Home', href: '/',
    svg: <svg viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"><path d="M3.5 10.5 12 4l8.5 6.5V20H15v-5.5H9V20H3.5z" /></svg>,
  },
  {
    label: 'MacBooks', href: '/products',
    svg: <svg viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"><rect x="4.5" y="5" width="15" height="10.5" rx="1.5" /><path d="M2.5 18.5h19" strokeLinecap="round" /></svg>,
  },
  {
    label: 'Grades', href: '/why-cpo',
    svg: <svg viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"><path d="M12 3.5 19 6v5.5c0 4.2-3 7.4-7 9-4-1.6-7-4.8-7-9V6z" /><path d="m9 12 2.2 2.2L15.5 10" strokeLinecap="round" /></svg>,
  },
  {
    label: 'Help', href: '/#faq',
    svg: <svg viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><circle cx="12" cy="12" r="8.5" /><path d="M9.6 9.5a2.5 2.5 0 1 1 3.3 2.4c-.6.2-.9.8-.9 1.4v.4" /><circle cx="12" cy="16.8" r=".4" fill="currentColor" /></svg>,
  },
];

/**
 * Bottom tab bar under 1024px: the site's navigation on phones and narrow windows (no hidden
 * menu). The last tab opens the chat panel.
 */
export function WhatsAppButton() {
  const pathname = usePathname();
  const isActive = (href: string) => (href === '/' ? pathname === '/' : !href.includes('#') && pathname.startsWith(href));

  return (
    <nav aria-label="Main" className="tabbar lg:hidden">
      <ul className="grid grid-cols-5">
        {TABS.map((t) => {
          const active = isActive(t.href);
          return (
            <li key={t.label}>
              <Link href={t.href} aria-current={active ? 'page' : undefined} className={`tabbar__item ${active ? 'is-active' : ''}`}>
                {t.svg}
                <span>{t.label}</span>
              </Link>
            </li>
          );
        })}
        <li>
          <button type="button" onClick={openChat} className="tabbar__item w-full">
            <svg viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"><path d="M20 11.5a7.5 7.5 0 0 1-10.9 6.7L4 19.5l1.4-4.6A7.5 7.5 0 1 1 20 11.5Z" /></svg>
            <span>Chat</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
