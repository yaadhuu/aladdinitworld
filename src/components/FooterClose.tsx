'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { WarrantyFaq } from '@/components/WarrantyFaq';

/**
 * The footer's "Need help?" close. Pages with their own closing call (home, reviews, business, visit us)
 * leave it out, and the warranty page swaps it for its questions.
 */
const OWN_CLOSE = ['/', '/reviews', '/b2b', '/contact'];
export function FooterClose({ children }: { children: ReactNode }) {
  const path = usePathname();
  if (path === '/warranty') return <WarrantyFaq />;
  return OWN_CLOSE.includes(path) ? null : <>{children}</>;
}
