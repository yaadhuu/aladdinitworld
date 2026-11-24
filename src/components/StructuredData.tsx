import { SITE_CONFIG, TIERS } from '@/config';

// Schema.org structured data — this is what AI answer engines (ChatGPT,
// Perplexity, Google AI Overviews) and Google's rich results parse to
// understand exactly what your business is, sells, and is rated.
// This is NOT visible to humans — it's a JSON-LD script tag read by machines.

export function StructuredData() {
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
    review: SITE_CONFIG.customerReviews.map((r) => ({
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
    mainEntity: SITE_CONFIG.faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  const productSchema = SITE_CONFIG.products.map((product) => {
    const availableTiers = (Object.keys(product.tiers) as Array<keyof typeof product.tiers>)
      .filter((t) => product.tiers[t]?.price != null);

    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      brand: { '@type': 'Brand', name: 'Apple' },
      category: product.category,
      description: `${product.chip} · ${product.specs.join(' · ')} · Certified Pre-Owned`,
      offers: availableTiers.map((tier) => ({
        '@type': 'Offer',
        price: product.tiers[tier]?.price,
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/UsedCondition',
        seller: { '@type': 'Organization', name: SITE_CONFIG.name },
        description: TIERS[tier].description,
      })),
    };
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {productSchema.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
