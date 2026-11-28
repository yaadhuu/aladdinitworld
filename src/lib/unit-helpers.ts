// Pure helpers for a Unit: safe to import from server and client components.
import { TIERS, type Tier, type Unit } from '@/config';

export const TIER_ORDER: Tier[] = ['refurb', 'certified', 'pristine'];

/** "1 month", "3 months", "6 months": the warranty always comes from the grade */
export const warrantyShort = (t: Tier) => TIERS[t].warranty.replace(' Warranty', '').replace('Months', 'months').replace('Month', 'month');

export const gradeName = (t: Tier) => TIERS[t].label.replace('CPO ', '');

/** "M1 Pro", "Intel i7" */
export const chipShort = (chip: string) => chip.replace('Apple ', '').replace('Intel Core ', 'Intel ');

/** The title shown everywhere, built from the fields: MacBook Pro M1 Pro 14" */
export const unitName = (u: Pick<Unit, 'model' | 'chip' | 'screen'>) => `${u.model} ${chipShort(u.chip)} ${u.screen}"`;

/** "16GB · 512GB" */
export const unitMemory = (u: Pick<Unit, 'ram' | 'storage'>) => `${u.ram}GB · ${u.storage}`;

export const sizeOf = (u: Pick<Unit, 'screen'>) => `${u.screen}-inch`;

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

/** URL part: readable words, then the 8-character unit id. Nothing is stored or typed. */
export const unitSlug = (u: Pick<Unit, 'model' | 'chip' | 'screen' | 'ram' | 'storage' | 'id'>) =>
  `${slugify(`${u.model} ${chipShort(u.chip)} ${u.screen} inch ${u.ram}gb ${u.storage}`)}-${u.id}`;

/** The unit id at the end of a URL part, or null if it does not look like one */
export const idFromSlug = (slug: string) => slug.match(/-([a-z0-9]{8})$/)?.[1] ?? null;

/** Alt text for a photo, built from the fields so staff never type it: name, specs, photo number */
export const photoAlt = (u: Pick<Unit, 'model' | 'chip' | 'screen' | 'ram' | 'storage'>, n: number, total: number) =>
  `${unitName(u)}, ${unitMemory(u)}, photo ${n}${total > 1 ? ` of ${total}` : ''}`;

/** RAM and storage as plain words, for the cards and the unit page */
export const unitSpecs = (u: Pick<Unit, 'ram' | 'storage'>) => `${u.ram}GB RAM · ${u.storage} storage`;

/** Page title for a unit: "{Model}, {RAM}/{Storage}, {Grade}". A part that is missing is left out, never invented. */
export const unitTitle = (u: Pick<Unit, 'model' | 'ram' | 'storage' | 'grade'>) =>
  [u.model, [u.ram ? `${u.ram}GB` : '', u.storage].filter(Boolean).join('/'), u.grade ? gradeName(u.grade) : '']
    .filter(Boolean)
    .join(', ') || 'MacBook';
