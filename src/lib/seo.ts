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

/** The site's social image (app/opengraph-image.tsx), used by every page that has no photo of its own */
export const DEFAULT_OG_IMAGE = { url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: SITE_CONFIG.name };

/** Title, description and canonical (plus matching Open Graph and Twitter text) for one page */
export function pageMeta({ title, description, path, image }: {
  title: string; description: string; path: string; image?: { url: string; width: number; height: number; alt: string };
}): Metadata {
  const url = `${SITE_URL}${path}`;
  const img = image ?? DEFAULT_OG_IMAGE;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website', locale: 'en_IN', siteName: SITE_CONFIG.name, images: [img] },
    twitter: { card: 'summary_large_image', title, description, images: [img.url] },
  };
}
