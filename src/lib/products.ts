// The one data layer for MacBooks. Pages call only this file, never Sanity directly,
// so the CMS or the hosting can change without touching a page.
// Reads come from Sanity and are cached for about 60 seconds. If Sanity is unreachable, the local snapshot in config is used.
import 'server-only';
import { type Tier, type Unit, type UnitPhoto } from '@/config';
import { sanityFetch } from '@/sanity/client';
import { Q_COUNT, Q_FEATURED, Q_LIST, Q_ONE, Q_SLUGS } from '@/sanity/queries';
import { idFromSlug, TIER_ORDER, unitSlug } from './unit-helpers';

export * from './unit-helpers';

// ── Raw shape from Sanity, checked before it reaches a page ──
type RawPhoto = { src?: unknown; width?: unknown; height?: unknown; lqip?: unknown };
type Raw = Record<string, unknown> & { _id?: unknown; _createdAt?: unknown; photos?: RawPhoto[] | null };

const str = (v: unknown) => (typeof v === 'string' ? v : null);
const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : null);

function toPhoto(p: RawPhoto): UnitPhoto | null {
  const src = str(p.src);
  // Only Sanity's own image host is accepted
  if (!src || !src.startsWith('https://cdn.sanity.io/')) return null;
  // only a real image data URL is used as the blurred preview
  const lqip = str(p.lqip);
  return { src, width: num(p.width) ?? 1600, height: num(p.height) ?? 1200, ...(lqip?.startsWith('data:image/') ? { lqip } : {}) };
}

function toUnit(r: Raw): Unit | null {
  const id = str(r._id)?.slice(-8).toLowerCase();
  const model = str(r.model);
  const chip = str(r.chip);
  const storage = str(r.storage);
  const screen = num(r.screen);
  const ram = num(r.ram);
  const price = num(r.price);
  const grade = r.grade as Tier;
  const status = r.status;
  if (!id || !/^[a-z0-9]{8}$/.test(id) || !model || !chip || !storage || !screen || !ram || !price) return null;
  if (!TIER_ORDER.includes(grade) || (status !== 'available' && status !== 'reserved')) return null;
  const photos = (r.photos ?? []).map(toPhoto).filter((p): p is UnitPhoto => p !== null);
  if (photos.length === 0) return null;
  return {
    id, model, chip, storage, screen, ram, price, grade, status, photos,
    year: num(r.year),
    headline: str(r.headline)?.trim().slice(0, 60) || null,
    // only an offer when it is higher than the price
    originalPrice: num(r.originalPrice) !== null && (num(r.originalPrice) as number) > price ? num(r.originalPrice) : null,
    battery: num(r.battery),
    cosmetic: str(r.cosmetic),
    included: Array.isArray(r.included) ? r.included.filter((i): i is string => typeof i === 'string') : [],
    description: str(r.description) ?? '',
    createdAt: str(r._createdAt) ?? '',
  };
}

const mapUnits = (rows: Raw[]) => rows.map(toUnit).filter((u): u is Unit => u !== null);

/** The shop list: up to 60 available or reserved units, newest first */
export async function getUnits(): Promise<{ units: Unit[]; total: number }> {
  const [rows, total] = await Promise.all([sanityFetch<Raw[]>(Q_LIST, {}, true), sanityFetch<number>(Q_COUNT, {}, true)]);
  const units = mapUnits(rows ?? []);
  return { units, total: Math.max(total ?? units.length, units.length) };
}

/** How many units are on the shelf, for "See all N" */
export async function getCount(): Promise<number> {
  return (await sanityFetch<number>(Q_COUNT, {}, true)) ?? 0;
}

/** The MacBooks picked on the Home page document (up to 6), in the order staff chose */
export async function getFeatured(): Promise<Unit[]> {
  return mapUnits((await sanityFetch<Raw[]>(Q_FEATURED, {}, true)) ?? []);
}

/** One unit by its URL part. Null means "not on the shelf": the page shows a 404. */
export async function getUnit(slug: string): Promise<Unit | null> {
  const id = idFromSlug(slug);
  if (!id) return null;
  const row = await sanityFetch<Raw | null>(Q_ONE, { pattern: `*${id}` }, true);
  return row ? toUnit(row) : null;
}

/** URL parts and edit times for static pages and the sitemap (up to 200) */
export async function getUnitSlugs(): Promise<{ slug: string; updatedAt: string | null }[]> {
  const rows = await sanityFetch<(Raw & { _updatedAt?: unknown })[]>(Q_SLUGS, {}, true);
  return (rows ?? []).flatMap((r) => {
    const id = str(r._id)?.slice(-8).toLowerCase();
    const model = str(r.model); const chip = str(r.chip); const storage = str(r.storage);
    const screen = num(r.screen); const ram = num(r.ram);
    if (!id || !model || !chip || !storage || !screen || !ram) return [];
    return [{ slug: unitSlug({ id, model, chip, storage, screen, ram }), updatedAt: str(r._updatedAt) }];
  });
}
