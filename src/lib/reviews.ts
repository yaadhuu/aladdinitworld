// Customer reviews for the website. Read from Sanity (cached about 60 seconds); the snapshot in config is used only if Sanity is unreachable.
import 'server-only';
import { SITE_CONFIG } from '@/config';
import { sanityFetch } from '@/sanity/client';
import { Q_REVIEWS } from '@/sanity/queries';

export type Review = { name: string; role: string; source: string; rating: number; text: string };

const s = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function getReviews(): Promise<Review[]> {
  const rows = await sanityFetch<Record<string, unknown>[]>(Q_REVIEWS);
  if (!rows) return SITE_CONFIG.customerReviews;
  return rows.flatMap((r) => {
    const name = s(r.name, 60);
    const text = s(r.text, 600);
    const rating = typeof r.rating === 'number' ? Math.min(5, Math.max(1, Math.round(r.rating))) : 5;
    return name && text ? [{ name, role: s(r.role, 40), source: s(r.source, 40), rating, text }] : [];
  });
}
