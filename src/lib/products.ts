// The one data layer for MacBooks. Pages call only this file, never Sanity directly,
// so the CMS or the hosting can change without touching a page.
// Reads come from Sanity and are cached for about 60 seconds. If Sanity is unreachable, the local snapshot in config is used.
import 'server-only';
import { FALLBACK_UNITS, type Tier, type Unit, type UnitPhoto } from '@/config';
import { sanityFetch } from '@/sanity/client';
import { Q_COUNT, Q_FEATURED, Q_LIST, Q_ONE, Q_SLUGS, LIMIT_FEATURED, LIMIT_LIST, LIMIT_SLUGS } from '@/sanity/queries';
import { idFromSlug, TIER_ORDER, unitSlug } from './unit-helpers';

export * from './unit-helpers';

// ── Raw shape from Sanity, checked before it reaches a page ──
type RawPhoto = { src?: unknown; width?: unknown; height?: unknown };
type Raw = Record<string, unknown> & { _id?: unknown; _createdAt?: unknown; photos?: RawPhoto[] | null };

const str = (v: unknown) => (typeof v === 'string' ? v : null);
const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : null);

function toPhoto(p: RawPhoto): UnitPhoto | null {
  const src = str(p.src);
  // Only Sanity's own image host is accepted
  if (!src || !src.startsWith('https://cdn.sanity.io/')) return null;
  return { src, width: num(p.width) ?? 1600, height: num(p.height) ?? 1200 };
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
    featured: r.featured === true,
    description: str(r.description) ?? '',
    createdAt: str(r._createdAt) ?? '',
  };
}

const mapUnits = (rows: Raw[]) => rows.map(toUnit).filter((u): u is Unit => u !== null);

const shelf = FALLBACK_UNITS.filter((u) => u.status !== 'sold');

/** The shop list: up to 60 available or reserved units, newest first */
export async function getUnits(): Promise<{ units: Unit[]; total: number }> {
  const [rows, total] = await Promise.all([sanityFetch<Raw[]>(Q_LIST), sanityFetch<number>(Q_COUNT)]);
  if (!rows) return { units: shelf.slice(0, LIMIT_LIST), total: shelf.length };
  const units = mapUnits(rows);
  return { units, total: Math.max(total ?? units.length, units.length) };
}

/** How many units are on the shelf, for "See all N" */
export async function getCount(): Promise<number> {
  return (await sanityFetch<number>(Q_COUNT)) ?? shelf.length;
}

/** Up to 6 featured, available units, newest first, for the home page */
export async function getFeatured(): Promise<Unit[]> {
  const rows = await sanityFetch<Raw[]>(Q_FEATURED);
  if (!rows) return shelf.filter((u) => u.featured && u.status === 'available').slice(0, LIMIT_FEATURED);
  return mapUnits(rows);
}

/** One unit by its URL part. Null means "not on the shelf": the page shows a 404. */
export async function getUnit(slug: string): Promise<Unit | null> {
  const id = idFromSlug(slug);
  if (!id) return null;
  const row = await sanityFetch<Raw | null>(Q_ONE, { pattern: `*${id}` });
  if (row === null && !(await isReachable())) return shelf.find((u) => u.id === id) ?? null;
  return row ? toUnit(row) : null;
}

// A null result is ambiguous (no match, or Sanity down). Count tells them apart, and it is cached with the list.
async function isReachable() {
  return (await sanityFetch<number>(Q_COUNT)) !== null;
}

/** URL parts and edit times for static pages and the sitemap (up to 200) */
export async function getUnitSlugs(): Promise<{ slug: string; updatedAt: string | null }[]> {
  const rows = await sanityFetch<(Raw & { _updatedAt?: unknown })[]>(Q_SLUGS);
  if (!rows) return shelf.slice(0, LIMIT_SLUGS).map((u) => ({ slug: unitSlug(u), updatedAt: null }));
  return rows.flatMap((r) => {
    const id = str(r._id)?.slice(-8).toLowerCase();
    const model = str(r.model); const chip = str(r.chip); const storage = str(r.storage);
    const screen = num(r.screen); const ram = num(r.ram);
    if (!id || !model || !chip || !storage || !screen || !ram) return [];
    return [{ slug: unitSlug({ id, model, chip, storage, screen, ram }), updatedAt: str(r._updatedAt) }];
  });
}

// ── Legacy shape, still read by the chatbot until it reads the CMS ──
export type Product = { id: string; name: string; chip: string; specs: string[]; tiers: Partial<Record<Tier, { price: number }>> };
export const ALL_PRODUCTS: Product[] = FALLBACK_UNITS.map((u) => ({
  id: u.id,
  name: `${u.model} ${u.screen}"`,
  chip: u.chip,
  specs: [`${u.ram}GB RAM`, `${u.storage} SSD`],
  tiers: { [u.grade]: { price: u.price } },
}));
export const gradesOf = (p: Product) => TIER_ORDER.filter((t) => p.tiers[t]?.price != null);
