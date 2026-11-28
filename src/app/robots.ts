import { MetadataRoute } from 'next';
import { INDEXABLE, SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    // Crawling stays open everywhere so search engines can read the noindex on previews and vercel.app
    // (blocking them here would hide it). The sitemap is offered only when this build may be indexed.
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/admin'] },
    ...(INDEXABLE ? { sitemap: `${SITE_URL}/sitemap.xml` } : {}),
  };
}
