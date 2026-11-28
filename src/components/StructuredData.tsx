import { SITE_CONFIG, TIERS, BUSINESS_HOURS, type Unit } from '@/config';
import { SITE_URL } from '@/lib/seo';
import { chipShort, unitName, unitSlug } from '@/lib/unit-helpers';
import type { Faq } from '@/lib/faq';

// JSON-LD text is escaped so it can never close the script tag or inject markup: < > & and the two
// line-separator characters become \u escapes. The only CMS free text that reaches this is the FAQ.
const ESCAPES: Record<string, string> = {
  '<': '\\u003c',
  '>': '\\u003e',
  '&': '\\u0026',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029',
};
const jsonLd = (o: unknown) => ({ __html: JSON.stringify(o).replace(/[<>&\u2028\u2029]/g, (c) => ESCAPES[c]) });

// Schema.org structured data: a JSON-LD script tag that search engines read. Only facts the site really has go in:
// no ratings or reviews (they are shown on the home page only, and a business may not mark up its own reviews),
// no coordinates until SITE_CONFIG.showroom.geo is filled in.

// "9:00 AM" -> "09:00"
const to24 = (t: string) => {
  const m = t.match(/([0-9]{1,2}):([0-9]{2})\s*(AM|PM)/i);
  return m ? `${String(((+m[1] % 12) + (m[3].toUpperCase() === 'PM' ? 12 : 0))).padStart(2, '0')}:${m[2]}` : null;
};

// One entry per run of days with the same hours; a closed day ("Closed") is left out
function openingHours() {
  const byHours = new Map<string, string[]>();
  for (const [day, hours] of Object.entries(BUSINESS_HOURS)) {
    const [from, to] = hours.split(/\s[–-]\s/).map((h) => to24(h.trim()));
    if (!from || !to) continue;
    const key = `${from}-${to}`;
    byHours.set(key, [...(byHours.get(key) ?? []), day.charAt(0).toUpperCase() + day.slice(1)]);
  }
  return [...byHours].map(([key, dayOfWeek]) => {
    const [opens, closes] = key.split('-');
    return { '@type': 'OpeningHoursSpecification', dayOfWeek, opens, closes };
  });
}

/** The business, on every page */
export function StructuredData() {
  const { showroom } = SITE_CONFIG;
  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'ElectronicsStore',
    '@id': `${SITE_URL}/#business`,
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/opengraph-image`,
    telephone: SITE_CONFIG.social.phone,
    email: SITE_CONFIG.social.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: showroom.street,
      addressLocality: showroom.locality,
      postalCode: showroom.postalCode,
      addressRegion: showroom.region,
      addressCountry: 'IN',
    },
    ...(showroom.geo ? { geo: { '@type': 'GeoCoordinates', latitude: showroom.geo.latitude, longitude: showroom.geo.longitude } } : {}),
    openingHoursSpecification: openingHours(),
    areaServed: { '@type': 'Country', name: SITE_CONFIG.areaServed },
    sameAs: [SITE_CONFIG.social.instagram],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(localBusiness)} />;
}

/** The questions shown on the page it is placed on (the home page); pass only the ones that are visible */
export function FaqSchema({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)} />;
}

/** The breadcrumb trail shown at the top of a page, as structured data: [{ name, path }], last item is the page itself */
export function BreadcrumbSchema({ items }: { items: { name: string; path: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: `${SITE_URL}${it.path}` })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)} />;
}

/** Product data for one unit page */
export function UnitSchema({ unit: u }: { unit: Unit }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: unitName(u),
    sku: u.id,
    brand: { '@type': 'Brand', name: 'Apple' },
    category: u.model,
    description: `${chipShort(u.chip)}, ${u.ram}GB, ${u.storage}, ${TIERS[u.grade].label}`,
    image: u.photos.slice(0, 4).map((p) => p.src),
    url: `${SITE_URL}/products/${unitSlug(u)}`,
    offers: {
      '@type': 'Offer',
      price: u.price,
      priceCurrency: 'INR',
      availability: u.status === 'available' ? 'https://schema.org/InStock' : 'https://schema.org/LimitedAvailability',
      itemCondition: 'https://schema.org/UsedCondition',
      seller: { '@type': 'Organization', name: SITE_CONFIG.name },
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)} />;
}
