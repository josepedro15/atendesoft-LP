import { useState, useEffect } from 'react';
import { BlogPost, BlogFilters, KeywordStats } from '@/types/blog';
import BlogHero from '@/components/blog/BlogHero';
import BlogCard from '@/components/blog/BlogCard';
import BlogSidebar from '@/components/blog/BlogSidebar';
import BlogSEO from '@/components/blog/BlogSEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface BlogPageProps {
  // Removido getServerSideProps - agora usa client-side rendering
}

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [popularKeywords, setPopularKeywords] = useState<KeywordStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://atendesoft.com';
        
        const [postsResponse, keywordsResponse] = await Promise.all([
          fetch(`${baseUrl}/api/blog/posts?page=1&limit=50&status=published`),
          fetch(`${baseUrl}/api/blog/keywords?limit=10`)
        ]);

        if (postsResponse.ok) {
          const postsData = await postsResponse.json();
          if (postsData.success) {
            setPosts(postsData.data?.posts || []);
            setPagination(prev => postsData.data?.pagination || prev);
          }
        }

        if (keywordsResponse.ok) {
          const keywordsData = await keywordsResponse.json();
          if (keywordsData.success) {
            setPopularKeywords(keywordsData.data || []);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados do blog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando blog...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <BlogSEO 
        isListPage={true}
        page={pagination.page}
        totalPages={pagination.pages}
      />

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="bg-background">
          {/* Hero Section */}
          <BlogHero 
            latestPost={posts[0]} 
          />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
              {/* Conteúdo Principal */}
              <div className="lg:col-span-3 order-2 lg:order-1">
                {/* Lista de Posts em Grade */}
                {posts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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
              <div className="lg:col-span-1 order-1 lg:order-2">
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

export default BlogPage;