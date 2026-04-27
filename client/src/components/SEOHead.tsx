import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  type?: string;
  noindex?: boolean;
  schema?: Record<string, unknown> | Record<string, unknown>[];
}

const BASE_URL = 'https://www.restaumargin.fr';

// Default SoftwareApplication schema for RestauMargin
const defaultSchema: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'RestauMargin',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: 'https://www.restaumargin.fr',
  description: 'Logiciel de gestion des marges pour restaurants. Calcul food cost, fiches techniques, IA, commandes fournisseurs.',
  offers: [
    {
      '@type': 'Offer',
      name: 'Pro',
      price: '29',
      priceCurrency: 'EUR',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '29',
        priceCurrency: 'EUR',
        unitText: 'MONTH',
      },
    },
    {
      '@type': 'Offer',
      name: 'Business',
      price: '79',
      priceCurrency: 'EUR',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '79',
        priceCurrency: 'EUR',
        unitText: 'MONTH',
      },
    },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '150',
    bestRating: '5',
    worstRating: '1',
  },
};

/**
 * Build a FAQPage schema from an array of Q&A pairs.
 */
export function buildFAQSchema(
  items: { question: string; answer: string }[]
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

/**
 * Build a BreadcrumbList schema from an array of {name, url} crumbs.
 */
export function buildBreadcrumbSchema(
  crumbs: { name: string; url: string }[]
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

export default function SEOHead({
  title,
  description,
  path = '',
  ogImage = '/og-image.png',
  type = 'website',
  noindex = false,
  schema,
}: SEOHeadProps) {
  const fullUrl = `${BASE_URL}${path}`;
  const fullImage = ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`;
  const fullTitle = title.includes('RestauMargin') ? title : `${title} | RestauMargin`;

  // Schemas to inject: only include default SoftwareApplication on landing.
  // index.html already contains a global SoftwareApplication schema, so we
  // avoid duplicating it on every page (Google sees double = ranks worse).
  const schemas: Record<string, unknown>[] = path === '/' ? [defaultSchema] : [];
  if (schema) {
    if (Array.isArray(schema)) {
      schemas.push(...schema);
    } else {
      schemas.push(schema);
    }
  }

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:site_name" content="RestauMargin" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* Schema.org JSON-LD */}
      {schemas.map((s, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}
