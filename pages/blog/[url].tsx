import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { BlogPost } from '@/types/blog';
import PostContent from '@/components/blog/PostContent';
import RelatedPosts from '@/components/blog/RelatedPosts';
import ShareButtons from '@/components/blog/ShareButtons';
import BlogSidebar from '@/components/blog/BlogSidebar';
import BlogSEO from '@/components/blog/BlogSEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, Calendar, Tag, Eye } from 'lucide-react';

const PostPage = () => {
  const router = useRouter();
  const { url } = router.query;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [popularKeywords, setPopularKeywords] = useState<Array<{ keyword: string; count: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!url || typeof url !== 'string') return;

    const fetchPost = async () => {
      try {
        // Buscar dados diretamente do Supabase (client-side)
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vlayangmpcogxoolcksc.supabase.co';
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsYXlhbmdtcGNvZ3hvb2xja3NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NzEwMDIsImV4cCI6MjA2OTU0NzAwMn0.U4jxKlTf_eCX6zochG6wZPxRBvWk90erSNY_IEuYqrY';
        
        // Buscar post por URL
        const postResponse = await fetch(`${supabaseUrl}/rest/v1/blog_posts?url=eq.${url}&status=eq.published&select=*`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json'
          }
        });

        const postData = await postResponse.json();
        if (!postData || postData.length === 0) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        
        const foundPost = postData[0];
        setPost(foundPost);

        // Buscar posts relacionados
        const relatedResponse = await fetch(`${supabaseUrl}/rest/v1/blog_posts?keyword=eq.${foundPost.keyword}&status=eq.published&select=*&order=timestamp.desc`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json'
          }
        });
        
        const relatedData = await relatedResponse.json();
        if (relatedData) {
          setRelatedPosts(relatedData.filter((p: BlogPost) => p.id !== foundPost.id).slice(0, 3));
        }

        // Buscar keywords populares
        const keywordsResponse = await fetch(`${supabaseUrl}/rest/v1/blog_posts?status=eq.published&select=keyword`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json'
          }
        });

        const keywordsData = await keywordsResponse.json();
        if (keywordsData) {
          // Contar frequência de keywords
          const keywordCount: Record<string, number> = {};
          keywordsData.forEach((post: any) => {
            if (post.keyword) {
              keywordCount[post.keyword] = (keywordCount[post.keyword] || 0) + 1;
            }
          });
          
          const popularKeywords = Object.entries(keywordCount)
            .map(([keyword, count]) => ({ keyword, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
            
          setPopularKeywords(popularKeywords);
        }

      } catch (error) {
        console.error('Erro ao carregar post:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [url]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando post...</p>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Post não encontrado</h1>
          <p className="text-muted-foreground mb-6">O post que você está procurando não existe.</p>
          <button 
            onClick={() => router.push('/blog')}
            className="btn-primary"
          >
            Voltar ao Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <BlogSEO post={post} />

      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-24">
          {/* Breadcrumb */}
          <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-muted-foreground overflow-x-auto">
              <button
                onClick={() => router.push('/')}
                className="hover:text-foreground transition-colors whitespace-nowrap"
              >
                Home
              </button>
              <span>/</span>
              <button
                onClick={() => router.push('/blog')}
                className="hover:text-foreground transition-colors whitespace-nowrap"
              >
                Blog
              </button>
              <span>/</span>
              <span className="text-foreground font-medium truncate">
                {post.title}
              </span>
            </nav>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
              {/* Conteúdo Principal */}
              <div className="lg:col-span-3 order-2 lg:order-1">
                <PostContent post={post} />
                <RelatedPosts posts={relatedPosts} currentPostId={post.id} />
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

export default PostPage;