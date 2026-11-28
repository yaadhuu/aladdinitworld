import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/config';

/** The one canonical address, from SITE_CONFIG.url (no trailing slash) */
export const SITE_URL = SITE_CONFIG.url.replace(/\/$/, '');

/**
 * Search engines are asked to index only when SEO_INDEX=1 is set for the build (set it on Production
 * once the real domain serves the site). Previews and every other build say noindex. The vercel.app
 * host is always noindex too: see next.config.ts.
 */
export const INDEXABLE = process.env.SEO_INDEX === '1';

/** Title, description and canonical (plus matching Open Graph and Twitter text) for one page */
export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website', locale: 'en_IN', siteName: SITE_CONFIG.name },
    twitter: { card: 'summary_large_image', title, description },
  };
}

/**
 * When each page's own content last changed (the date of its last git commit). Update a date when you
 * change that page. /products and the home page also follow the newest MacBook change (see sitemap.ts).
 */
export const PAGE_MODIFIED: Record<string, string> = {
  '': '2026-11-26T05:24:56+05:30',
  '/products': '2026-11-25T04:46:33+05:30',
  '/why-cpo': '2026-11-26T05:03:59+05:30',
  '/warranty': '2026-11-26T05:03:59+05:30',
  '/reviews': '2026-11-25T04:46:33+05:30',
  '/b2b': '2026-11-26T05:03:59+05:30',
  '/contact': '2026-11-26T05:03:59+05:30',
  '/privacy': '2026-11-25T04:46:33+05:30',
  '/terms': '2026-11-25T04:46:33+05:30',
};
