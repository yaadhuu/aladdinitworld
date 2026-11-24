'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/** The footer's "Need help?" close. The home page already has its own Need help section, so it is left out there. */
export function FooterClose({ children }: { children: ReactNode }) {
  return usePathname() === '/' ? null : <>{children}</>;
}
