import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { BlogPost, BlogFilters, KeywordStats } from '@/types/blog';
import { fetchPosts, fetchPopularKeywords, generatePostMetaTags } from '@/lib/blog';
import BlogHero from '@/components/blog/BlogHero';
import BlogCard from '@/components/blog/BlogCard';
import BlogSidebar from '@/components/blog/BlogSidebar';
import BlogPagination from '@/components/blog/BlogPagination';
import BlogSearch from '@/components/blog/BlogSearch';
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
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<BlogFilters>(filters);

  // Função para buscar posts com filtros
  const searchPosts = async (newFilters: BlogFilters) => {
    setLoading(true);
    try {
      const response = await fetchPosts(newFilters);
      if (response.success && response.data) {
        setPosts(response.data.posts);
        setPagination(response.data.pagination);
        setCurrentFilters(newFilters);
        
        // Atualizar URL sem recarregar a página
        const params = new URLSearchParams();
        if (newFilters.page && newFilters.page > 1) params.append('page', newFilters.page.toString());
        if (newFilters.keyword) params.append('keyword', newFilters.keyword);
        if (newFilters.search) params.append('search', newFilters.search);
        
        const queryString = params.toString();
        const newUrl = queryString ? `/blog?${queryString}` : '/blog';
        router.push(newUrl, undefined, { shallow: true });
      }
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para mudar página
  const handlePageChange = (page: number) => {
    searchPosts({ ...currentFilters, page });
  };

  // Função para buscar por keyword
  const handleKeywordClick = (keyword: string) => {
    searchPosts({ ...currentFilters, keyword, page: 1 });
  };

  // Função para buscar por texto
  const handleSearch = (search: string) => {
    searchPosts({ ...currentFilters, search, page: 1 });
  };

  // Função para limpar filtros
  const handleClearFilters = () => {
    searchPosts({ page: 1 });
  };

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
        
        <main className="pt-20">
          {/* Hero Section */}
          <BlogHero 
            title="Blog AtendeSoft"
            subtitle="Descubra as últimas tendências em automação comercial, inteligência artificial e transformação digital"
            searchValue={currentFilters.search || ''}
            onSearch={handleSearch}
          />

          <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Conteúdo Principal */}
              <div className="lg:col-span-3">
                {/* Filtros Ativos */}
                {(currentFilters.keyword || currentFilters.search) && (
                  <div className="mb-6 p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">Filtros ativos:</span>
                        {currentFilters.keyword && (
                          <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded">
                            {currentFilters.keyword}
                          </span>
                        )}
                        {currentFilters.search && (
                          <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded">
                            "{currentFilters.search}"
                          </span>
                        )}
                      </div>
                      <button
                        onClick={handleClearFilters}
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        Limpar filtros
                      </button>
                    </div>
                  </div>
                )}

                {/* Lista de Posts */}
                {loading ? (
                  <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-48 bg-muted rounded-lg mb-4"></div>
                        <div className="h-4 bg-muted rounded mb-2"></div>
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : posts.length > 0 ? (
                  <div className="space-y-8">
                    {posts.map((post) => (
                      <BlogCard 
                        key={post.id} 
                        post={post} 
                        onKeywordClick={handleKeywordClick}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                      Nenhum post encontrado
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Tente ajustar os filtros ou fazer uma nova busca.
                    </p>
                    <button
                      onClick={handleClearFilters}
                      className="btn-primary"
                    >
                      Ver todos os posts
                    </button>
                  </div>
                )}

                {/* Paginação */}
                {pagination.pages > 1 && (
                  <div className="mt-12">
                    <BlogPagination
                      currentPage={pagination.page}
                      totalPages={pagination.pages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <BlogSidebar
                  popularKeywords={popularKeywords}
                  onKeywordClick={handleKeywordClick}
                  activeKeyword={currentFilters.keyword}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { page = 1, keyword, search } = context.query;
    
    const filters: BlogFilters = {
      page: Number(page),
      limit: 10,
      keyword: keyword as string,
      search: search as string,
      status: 'published'
    };

    // Buscar posts e keywords em paralelo
    const [postsResponse, keywordsResponse] = await Promise.all([
      fetchPosts(filters),
      fetchPopularKeywords(10)
    ]);

    if (!postsResponse.success || !keywordsResponse.success) {
      throw new Error('Erro ao buscar dados');
    }

    return {
      props: {
        initialPosts: postsResponse.data?.posts || [],
        initialPagination: postsResponse.data?.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          pages: 0
        },
        popularKeywords: keywordsResponse.data || [],
        filters
      }
    };
  } catch (error) {
    console.error('Erro no getServerSideProps:', error);
    return {
      props: {
        initialPosts: [],
        initialPagination: {
          page: 1,
          limit: 10,
          total: 0,
          pages: 0
        },
        popularKeywords: [],
        filters: { page: 1, limit: 10, status: 'published' }
      }
    };
  }
};

export default BlogPage;
