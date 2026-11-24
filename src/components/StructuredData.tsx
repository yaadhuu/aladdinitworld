import { SITE_CONFIG, TIERS, type Unit } from '@/config';
import { chipShort, unitName, unitSlug } from '@/lib/unit-helpers';
import { getFaqs } from '@/lib/faq';
import { getReviews } from '@/lib/reviews';

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

// Schema.org structured data — this is what AI answer engines (ChatGPT,
// Perplexity, Google AI Overviews) and Google's rich results parse to
// understand exactly what your business is, sells, and is rated.
// This is NOT visible to humans — it's a JSON-LD script tag read by machines.

export async function StructuredData() {
  const [faqs, reviewList] = await Promise.all([getFaqs(), getReviews()]);
  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'ElectronicsStore',
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    telephone: SITE_CONFIG.social.phone,
    email: SITE_CONFIG.social.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.showroom.street,
      addressLocality: SITE_CONFIG.showroom.locality,
      postalCode: SITE_CONFIG.showroom.postalCode,
      addressRegion: 'Kerala',
      addressCountry: 'IN',
    },
    priceRange: '₹₹',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: SITE_CONFIG.stats.rating,
      reviewCount: SITE_CONFIG.stats.reviews.replace('+', ''),
      bestRating: '5',
    },
    review: reviewList.slice(0, 10).map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.name },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
        bestRating: '5',
      },
      reviewBody: r.text,
    })),
    sameAs: [SITE_CONFIG.social.instagram],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };


  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(localBusiness)}
      />
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(faqSchema)}
        />
      )}
    </>
  );
}

/** Product data for one unit page */
export function UnitSchema({ unit: u }: { unit: Unit }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: unitName(u),
    brand: { '@type': 'Brand', name: 'Apple' },
    category: u.model,
    description: `${chipShort(u.chip)}, ${u.ram}GB, ${u.storage}, ${TIERS[u.grade].label}`,
    image: u.photos.slice(0, 4).map((p) => p.src),
    url: `${SITE_CONFIG.url}/products/${unitSlug(u)}`,
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
