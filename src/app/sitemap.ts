import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/products',
    '/why-cpo',
    '/warranty',
    '/reviews',
    '/b2b',
    '/contact',
    '/privacy',
    '/terms',
  ];

  return routes.map((route) => ({
    url: `${SITE_CONFIG.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : route === '/products' ? 0.9 : 0.6,
  }));
}
