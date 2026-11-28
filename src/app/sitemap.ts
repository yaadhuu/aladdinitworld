import { MetadataRoute } from 'next';
import { getUnitSlugs } from '@/lib/products';
import { SITE_URL } from '@/lib/seo';

// Rebuilt in the background about every 5 minutes
export const revalidate = 300;

const ROUTES = ['', '/products', '/why-cpo', '/warranty', '/reviews', '/b2b', '/contact', '/privacy', '/terms'];

// Dates come only from Sanity (a MacBook's _updatedAt). Pages with no such date have no lastModified:
// a missing date is honest, a made-up one is not.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const units = await getUnitSlugs();
  const newestUnit = units.reduce<string | null>((a, u) => (u.updatedAt && (!a || u.updatedAt > a) ? u.updatedAt : a), null);

  return [
    ...ROUTES.map((route) => ({
      url: `${SITE_URL}${route}`,
      ...(route === '/products' && newestUnit ? { lastModified: new Date(newestUnit) } : {}),
      changeFrequency: (route === '' ? 'daily' : 'weekly') as 'daily' | 'weekly',
      priority: route === '' ? 1 : route === '/products' ? 0.9 : 0.6,
    })),
    ...units.map(({ slug, updatedAt }) => ({
      url: `${SITE_URL}/products/${slug}`,
      ...(updatedAt ? { lastModified: new Date(updatedAt) } : {}),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
