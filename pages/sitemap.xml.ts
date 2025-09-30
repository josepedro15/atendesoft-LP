import { GetStaticProps } from 'next';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

const Sitemap = () => {
  // Este componente não será renderizado, apenas usado para gerar o XML
  return null;
};

export const getStaticProps: GetStaticProps = async () => {
  try {
    // URLs estáticas do site
    const staticUrls: SitemapUrl[] = [
      {
        loc: 'https://atendesoft.com',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: 1.0
      },
      {
        loc: 'https://atendesoft.com/blog',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'daily',
        priority: 0.9
      },
      {
        loc: 'https://atendesoft.com/produtos',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.8
      },
      {
        loc: 'https://atendesoft.com/cases',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.8
      },
      {
        loc: 'https://atendesoft.com/ferramentas',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.8
      },
      {
        loc: 'https://atendesoft.com/demonstracao',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.8
      },
      {
        loc: 'https://atendesoft.com/fluxogramas',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.7
      },
      {
        loc: 'https://atendesoft.com/propostas',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.7
      },
      {
        loc: 'https://atendesoft.com/login',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'yearly',
        priority: 0.5
      },
      {
        loc: 'https://atendesoft.com/dashboard',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'yearly',
        priority: 0.5
      }
    ];

    // Para export estático, não podemos buscar dados dinâmicos do Supabase
    // Usar apenas URLs estáticas
    const allUrls = [...staticUrls];

    // Gerar XML do sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return {
      props: {
        sitemap
      }
    };
  } catch (error) {
    console.error('Erro ao gerar sitemap:', error);
    
    // Em caso de erro, retornar sitemap básico
    const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://atendesoft.com</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://atendesoft.com/blog</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

    return {
      props: {
        sitemap: basicSitemap
      }
    };
  }
};

export default Sitemap;