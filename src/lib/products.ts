import { SITE_CONFIG, TIERS, type Tier, type Product } from '@/config';

export const TIER_ORDER: Tier[] = ['refurb', 'certified', 'pristine'];

/** Lowest listed price across a product's grades */
export const priceOf = (p: Product) =>
  Math.min(...Object.values(p.tiers).map((t) => t?.price ?? Infinity));

/** Grades a product is listed in, in grade order */
export const gradesOf = (p: Product) => TIER_ORDER.filter((t) => (p.tiers[t]?.price ?? null) !== null);

/**
 * The picture for a product: the client's own photo, else a stand-in of the same design
 * (Intel 16-inch: a silver Unsplash frame; Apple silicon: Apple's press image of the current design).
 * Replace stand-ins by setting hasRealPhotos with real images in config.
 */
const STAND_INS: Record<string, string> = {
  'macbook-pro-i7': '/img/standin-intel.jpg',
  'macbook-pro-i9': '/img/standin-intel-2.jpg',
  'macbook-pro-m2-pro-14-16gb': '/img/standin-apple-silicon-2.jpg',
  'macbook-pro-m1-pro-16-16gb': '/img/standin-apple-silicon.jpg',
  'macbook-pro-m1-pro-16-32gb': '/img/standin-apple-silicon-3.jpg',
};

// Each product gets its own picture so no image repeats on a page
export const imageOf = (p: Product) =>
  p.hasRealPhotos ? p.images[0] : STAND_INS[p.id] ?? (p.chip.startsWith('Intel') ? '/img/standin-intel.jpg' : '/img/standin-apple-silicon.jpg');

export const warrantyShort = (t: Tier) => TIERS[t].warranty.replace(' Warranty', '').replace('Months', 'months').replace('Month', 'month');

/** Screen size from the name ("14\"") for grouping; Intel A2141 is 16-inch */
export const sizeOf = (p: Product) => (p.name.match(/1[46]"/)?.[0].replace('"', '-inch') ?? (p.name.includes('A2141') ? '16-inch' : ''));

export const ALL_PRODUCTS = SITE_CONFIG.products;
