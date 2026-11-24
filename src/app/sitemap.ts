import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/config';
import { getUnitSlugs } from '@/lib/products';

// Rebuilt in the background about every 5 minutes
export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ['', '/products', '/why-cpo', '/warranty', '/reviews', '/b2b', '/contact', '/privacy', '/terms'];
  const units = await getUnitSlugs();

  return [
    ...routes.map((route) => ({
      url: `${SITE_CONFIG.url}${route}`,
      lastModified: new Date(),
      changeFrequency: (route === '' ? 'daily' : 'weekly') as 'daily' | 'weekly',
      priority: route === '' ? 1 : route === '/products' ? 0.9 : 0.6,
    })),
    ...units.map(({ slug, updatedAt }) => ({
      url: `${SITE_CONFIG.url}/products/${slug}`,
      lastModified: updatedAt ? new Date(updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
