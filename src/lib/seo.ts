// Configurações de SEO e Analytics

export const SEO_CONFIG = {
  siteName: 'AtendeSoft',
  siteUrl: 'https://atendesoft.com',
  defaultTitle: 'AtendeSoft | Automação Comercial e IA',
  defaultDescription: 'Transforme sua empresa com automação comercial e inteligência artificial. Soluções inovadoras para aumentar vendas e produtividade.',
  defaultKeywords: 'automação comercial, IA, inteligência artificial, vendas, produtividade, CRM, chatbot',
  defaultImage: 'https://atendesoft.com/og-image.jpg',
  twitterHandle: '@atendesoft',
  author: 'AtendeSoft',
  locale: 'pt_BR',
  type: 'website' as const,
};

export const ANALYTICS_CONFIG = {
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || '',
  googleTagManagerId: process.env.NEXT_PUBLIC_GTM_ID || '',
  facebookPixelId: process.env.NEXT_PUBLIC_FB_PIXEL_ID || '',
};

// Função para gerar URLs canônicas
export const getCanonicalUrl = (path: string = ''): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SEO_CONFIG.siteUrl}${cleanPath}`;
};

// Função para gerar meta tags de Open Graph
export const generateOpenGraphTags = (data: {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}) => {
  const {
    title = SEO_CONFIG.defaultTitle,
    description = SEO_CONFIG.defaultDescription,
    image = SEO_CONFIG.defaultImage,
    url = SEO_CONFIG.siteUrl,
    type = 'website',
    publishedTime,
    modifiedTime,
    section,
    tags = []
  } = data;

  return {
    'og:title': title,
    'og:description': description,
    'og:image': image,
    'og:url': url,
    'og:type': type,
    'og:site_name': SEO_CONFIG.siteName,
    'og:locale': SEO_CONFIG.locale,
    ...(type === 'article' && {
      'article:author': SEO_CONFIG.author,
      'article:publisher': SEO_CONFIG.siteUrl,
      ...(publishedTime && { 'article:published_time': publishedTime }),
      ...(modifiedTime && { 'article:modified_time': modifiedTime }),
      ...(section && { 'article:section': section }),
      ...(tags.length > 0 && { 'article:tag': tags.join(', ') })
    })
  };
};

// Função para gerar meta tags do Twitter
export const generateTwitterTags = (data: {
  title?: string;
  description?: string;
  image?: string;
  card?: 'summary' | 'summary_large_image';
}) => {
  const {
    title = SEO_CONFIG.defaultTitle,
    description = SEO_CONFIG.defaultDescription,
    image = SEO_CONFIG.defaultImage,
    card = 'summary_large_image'
  } = data;

  return {
    'twitter:card': card,
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': image,
    'twitter:site': SEO_CONFIG.twitterHandle,
    'twitter:creator': SEO_CONFIG.twitterHandle
  };
};

// Função para gerar Schema.org JSON-LD
export const generateSchemaOrg = (data: {
  type: 'Organization' | 'WebSite' | 'Article' | 'Blog';
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  keywords?: string;
}) => {
  const {
    type,
    title = SEO_CONFIG.defaultTitle,
    description = SEO_CONFIG.defaultDescription,
    image = SEO_CONFIG.defaultImage,
    url = SEO_CONFIG.siteUrl,
    publishedTime,
    modifiedTime,
    author = SEO_CONFIG.author,
    section,
    keywords
  } = data;

  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': type,
    name: title,
    description,
    url,
    ...(image && { image }),
    ...(publishedTime && { datePublished: publishedTime }),
    ...(modifiedTime && { dateModified: modifiedTime }),
    ...(keywords && { keywords })
  };

  switch (type) {
    case 'Organization':
      return {
        ...baseSchema,
        logo: {
          '@type': 'ImageObject',
          url: `${SEO_CONFIG.siteUrl}/logo.png`
        },
        sameAs: [
          'https://www.linkedin.com/company/atendesoft',
          'https://twitter.com/atendesoft',
          'https://www.facebook.com/atendesoft'
        ]
      };

    case 'WebSite':
      return {
        ...baseSchema,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SEO_CONFIG.siteUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      };

    case 'Article':
      return {
        ...baseSchema,
        author: {
          '@type': 'Organization',
          name: author,
          url: SEO_CONFIG.siteUrl
        },
        publisher: {
          '@type': 'Organization',
          name: SEO_CONFIG.siteName,
          logo: {
            '@type': 'ImageObject',
            url: `${SEO_CONFIG.siteUrl}/logo.png`
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': url
        },
        ...(section && { articleSection: section })
      };

    case 'Blog':
      return {
        ...baseSchema,
        publisher: {
          '@type': 'Organization',
          name: SEO_CONFIG.siteName,
          logo: {
            '@type': 'ImageObject',
            url: `${SEO_CONFIG.siteUrl}/logo.png`
          }
        }
      };

    default:
      return baseSchema;
  }
};

// Função para validar URLs
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Função para limpar e otimizar texto para SEO
export const optimizeTextForSEO = (text: string, maxLength: number = 160): string => {
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, maxLength)
    .replace(/\s+\S*$/, '') + (text.length > maxLength ? '...' : '');
};
