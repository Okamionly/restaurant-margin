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

// NOTE: SoftwareApplication schema is declared globally in client/index.html.
// We do NOT inject another one here to avoid duplication (Google detected 3
// instances which triggers "non-critical issues" + ranking penalty).

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

  // Schemas to inject. SoftwareApplication is in index.html globally — we don't
  // duplicate it here. Pages can pass page-specific schemas via the `schema` prop.
  const schemas: Record<string, unknown>[] = [];
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
