import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
  canonical?: string;
}

const SEO = ({
  title = 'AtendeSoft | Automação Comercial e IA',
  description = 'Transforme sua empresa com automação comercial e inteligência artificial. Soluções inovadoras para aumentar vendas e produtividade.',
  keywords = 'automação comercial, IA, inteligência artificial, vendas, produtividade, CRM, chatbot',
  image = 'https://atendesoft.com/og-image.jpg',
  url = 'https://atendesoft.com',
  type = 'website',
  author = 'AtendeSoft',
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  noindex = false,
  canonical
}: SEOProps) => {
  const fullTitle = title.includes('AtendeSoft') ? title : `${title} | AtendeSoft`;
  const canonicalUrl = canonical || url;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow'} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#3b82f6" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="AtendeSoft" />
      <meta property="og:locale" content="pt_BR" />
      
      {/* Article specific Open Graph */}
      {type === 'article' && (
        <>
          <meta property="article:author" content={author} />
          <meta property="article:publisher" content="https://atendesoft.com" />
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@atendesoft" />
      <meta name="twitter:creator" content="@atendesoft" />
      
      {/* Additional Meta Tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="AtendeSoft" />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Head>
  );
};

export default SEO;
