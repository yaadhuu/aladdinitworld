'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/** The footer's "Need help?" close. Pages with their own closing call (home, reviews, business, visit us) leave it out. */
const OWN_CLOSE = ['/', '/reviews', '/b2b', '/contact'];
export function FooterClose({ children }: { children: ReactNode }) {
  return OWN_CLOSE.includes(usePathname()) ? null : <>{children}</>;
}
