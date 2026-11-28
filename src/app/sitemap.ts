import { MetadataRoute } from 'next';
import { getUnitSlugs } from '@/lib/products';
import { PAGE_MODIFIED, SITE_URL } from '@/lib/seo';

// Rebuilt in the background about every 5 minutes
export const revalidate = 300;

const newest = (...dates: (string | null | undefined)[]) =>
  new Date(Math.max(...dates.filter((d): d is string => !!d).map((d) => new Date(d).getTime())));

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const units = await getUnitSlugs();
  // the shop and the home page change whenever a MacBook does
  const lastUnitChange = units.reduce<string | null>((a, u) => (u.updatedAt && (!a || u.updatedAt > a) ? u.updatedAt : a), null);

  return [
    ...Object.entries(PAGE_MODIFIED).map(([route, modified]) => ({
      url: `${SITE_URL}${route}`,
      lastModified: route === '' || route === '/products' ? newest(modified, lastUnitChange) : new Date(modified),
      changeFrequency: (route === '' ? 'daily' : 'weekly') as 'daily' | 'weekly',
      priority: route === '' ? 1 : route === '/products' ? 0.9 : 0.6,
    })),
    ...units.map(({ slug, updatedAt }) => ({
      url: `${SITE_URL}/products/${slug}`,
      // a MacBook with no change date is left without one rather than given today's
      ...(updatedAt ? { lastModified: new Date(updatedAt) } : {}),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
