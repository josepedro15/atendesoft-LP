import { GetStaticProps } from 'next';

const Robots = () => {
  // Este componente não será renderizado, apenas usado para gerar o robots.txt
  return null;
};

export const getStaticProps: GetStaticProps = async () => {
  const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: https://atendesoft.com/sitemap.xml

# Disallow admin and private areas
Disallow: /dashboard
Disallow: /propostas
Disallow: /fluxogramas
Disallow: /api/
Disallow: /_next/
Disallow: /admin/

# Allow blog posts
Allow: /blog/

# Crawl delay (optional)
Crawl-delay: 1`;

  return {
    props: {
      robotsTxt
    }
  };
};

export default Robots;