import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  type?: string;
  noindex?: boolean;
}

const BASE_URL = 'https://www.restaumargin.fr';

export default function SEOHead({
  title,
  description,
  path = '',
  ogImage = '/og-image.png',
  type = 'website',
  noindex = false,
}: SEOHeadProps) {
  const fullUrl = `${BASE_URL}${path}`;
  const fullImage = ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`;
  const fullTitle = title.includes('RestauMargin') ? title : `${title} | RestauMargin`;

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
    </Helmet>
  );
}
