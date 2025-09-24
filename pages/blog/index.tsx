import { useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { BlogPost, BlogFilters, KeywordStats } from '@/types/blog';
import { fetchPosts, fetchPopularKeywords } from '@/lib/blog';
import BlogHero from '@/components/blog/BlogHero';
import BlogCard from '@/components/blog/BlogCard';
import BlogSidebar from '@/components/blog/BlogSidebar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface BlogPageProps {
  initialPosts: BlogPost[];
  initialPagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  popularKeywords: KeywordStats[];
  filters: BlogFilters;
}

const BlogPage = ({ 
  initialPosts, 
  initialPagination, 
  popularKeywords, 
  filters 
}: BlogPageProps) => {
  const [posts] = useState<BlogPost[]>(initialPosts);
  const [pagination] = useState(initialPagination);

  return (
    <>
      <Head>
        <title>Blog - AtendeSoft | Automação Comercial e IA</title>
        <meta 
          name="description" 
          content="Descubra as últimas tendências em automação comercial, inteligência artificial e transformação digital. Artigos exclusivos da AtendeSoft." 
        />
        <meta property="og:title" content="Blog - AtendeSoft" />
        <meta property="og:description" content="Artigos sobre automação comercial e IA" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://atendesoft.com/blog" />
        <link rel="canonical" href="https://atendesoft.com/blog" />
      </Head>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Conteúdo Principal */}
              <div className="lg:col-span-3">
                {/* Hero Section */}
                <BlogHero 
                  latestPost={posts[0]} 
                />

                {/* Lista de Posts */}
                {posts.length > 0 ? (
                  <div className="space-y-8">
                    {posts.map((post) => (
                      <BlogCard 
                        key={post.id} 
                        post={post} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                      Nenhum post encontrado
                    </h3>
                    <p className="text-muted-foreground">
                      Não há posts disponíveis no momento.
                    </p>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <BlogSidebar
                  popularKeywords={popularKeywords}
                />
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Buscar TODOS os posts publicados, sem filtros
    const filters: BlogFilters = {
      page: 1,
      limit: 50, // Aumentar limite para mostrar mais posts
      status: 'published'
    };

    console.log('getServerSideProps - Buscando TODOS os posts:', filters);

    // Buscar posts e keywords em paralelo
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://atendesoft.com';
    const [postsResponse, popularKeywords] = await Promise.all([
      fetchPosts(filters, baseUrl),
      fetchPopularKeywords(10)
    ]);

    console.log('getServerSideProps - Posts response:', postsResponse);
    console.log('getServerSideProps - Popular keywords:', popularKeywords);

    if (!postsResponse.success) {
      console.error('getServerSideProps - Erro na resposta dos posts:', postsResponse.error);
      throw new Error('Erro ao buscar dados');
    }

    const posts = postsResponse.data?.posts || [];
    const pagination = postsResponse.data?.pagination || {
      page: 1,
      limit: 50,
      total: posts.length,
      pages: 1
    };

    console.log('getServerSideProps - Posts encontrados:', posts.length);
    console.log('getServerSideProps - Pagination:', pagination);

    return {
      props: {
        initialPosts: posts,
        initialPagination: pagination,
        popularKeywords: popularKeywords || [],
        filters
      }
    };
  } catch (error) {
    console.error('getServerSideProps - Erro geral:', error);
    return {
      props: {
        initialPosts: [],
        initialPagination: {
          page: 1,
          limit: 50,
          total: 0,
          pages: 0
        },
        popularKeywords: [],
        filters: { page: 1, limit: 50, status: 'published' }
      }
    };
  }
};

export default BlogPage;