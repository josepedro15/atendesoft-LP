import { GetServerSideProps } from 'next';

const Robots = () => {
  // Este componente não será renderizado, apenas usado para gerar o robots.txt
  return null;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
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

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400'); // Cache por 24 horas
  res.write(robotsTxt);
  res.end();

  return {
    props: {}
  };
};

export default Robots;
