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

// Default SoftwareApplication schema — injected on every page
const defaultSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'RestauMargin',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, iOS, Android',
  url: BASE_URL,
  description:
    'Logiciel de calcul de marge et food cost pour restaurants independants. Fiches techniques automatiques, IA vocale, balance Bluetooth et commandes fournisseurs.',
  offers: [
    {
      '@type': 'Offer',
      name: 'Pro',
      price: '29.00',
      priceCurrency: 'EUR',
      priceValidUntil: '2027-01-01',
      description: 'Plan Pro pour restaurateurs independants',
    },
    {
      '@type': 'Offer',
      name: 'Business',
      price: '79.00',
      priceCurrency: 'EUR',
      priceValidUntil: '2027-01-01',
      description: 'Plan Business pour groupes multi-etablissements',
    },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '150',
    bestRating: '5',
    worstRating: '1',
  },
  publisher: {
    '@type': 'Organization',
    name: 'RestauMargin',
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/icon-512.png`,
    },
  },
};

export function buildBreadcrumbSchema(crumbs: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url.startsWith('http') ? c.url : `${BASE_URL}${c.url}`,
    })),
  };
}

export function buildFAQSchema(items: { question: string; answer: string }[]) {
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

  const schemas: Record<string, unknown>[] = [defaultSchema];
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
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}
