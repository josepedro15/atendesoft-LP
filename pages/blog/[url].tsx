import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { BlogPost } from '@/types/blog';
import { fetchPostByUrl, fetchPosts, getKeywordUrl } from '@/lib/blog';
import PostContent from '@/components/blog/PostContent';
import RelatedPosts from '@/components/blog/RelatedPosts';
import ShareButtons from '@/components/blog/ShareButtons';
import BlogSidebar from '@/components/blog/BlogSidebar';
import BlogSEO from '@/components/blog/BlogSEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, Calendar, Tag, Eye } from 'lucide-react';

interface PostPageProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
  popularKeywords: Array<{ keyword: string; count: number }>;
}

const PostPage = ({ post, relatedPosts, popularKeywords }: PostPageProps) => {
  const router = useRouter();

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
              <button
                onClick={() => router.push(getKeywordUrl(post.keyword))}
                className="hover:text-foreground transition-colors whitespace-nowrap"
              >
                {post.keyword}
              </button>
              <span>/</span>
              <span className="text-foreground truncate">{post.title}</span>
            </nav>
          </div>

          <div className="container mx-auto px-4 sm:px-6 pb-8 sm:pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
              {/* Conteúdo Principal */}
              <div className="lg:col-span-3 order-2 lg:order-1">
                {/* Botão Voltar */}
                <button
                  onClick={() => router.back()}
                  className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors mb-4 sm:mb-6"
                >
                  <ArrowLeft size={14} className="sm:w-4 sm:h-4" />
                  <span className="text-sm">Voltar</span>
                </button>

                {/* Header do Post */}
                <div className="mb-8 sm:mb-12">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
                    {post.title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8">
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} className="sm:w-4 sm:h-4" />
                      <span>{new Date(post.timestamp).toLocaleDateString('pt-BR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Tag size={14} className="sm:w-4 sm:h-4" />
                      <button
                        onClick={() => router.push(getKeywordUrl(post.keyword))}
                        className="hover:text-foreground transition-colors"
                      >
                        {post.keyword}
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Eye size={14} className="sm:w-4 sm:h-4" />
                      <span>{post.view_count} visualizações</span>
                    </div>
                  </div>
                </div>

                {/* Imagem Destacada - SEPARADA E ISOLADA */}
                {post.image && (
                  <div className="mb-8 sm:mb-12 w-full">
                    <div className="max-w-3xl mx-auto">
                      <div className="bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden">
                        <div className="w-full h-48 sm:h-64 md:h-80 relative">
                          <Image
                            src={post.image}
                            alt={post.title}
                            width={800}
                            height={400}
                            className="w-full h-full object-cover"
                            priority
                          />
                        </div>
                        <div className="p-2 sm:p-3 bg-gray-100">
                          <p className="text-xs text-gray-500 text-center">
                            {post.title}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Resumo */}
                <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-muted rounded-lg border-l-4 border-primary">
                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                    {post.summary}
                  </p>
                </div>

                {/* Conteúdo */}
                <PostContent content={post.content} />

                {/* Botões de Compartilhamento */}
                <div className="mt-8 pt-8 border-t">
                  <ShareButtons 
                    title={post.title}
                    url={metaTags.url}
                    description={post.summary}
                  />
                </div>

                {/* Posts Relacionados */}
                {relatedPosts.length > 0 && (
                  <div className="mt-12">
                    <RelatedPosts 
                      posts={relatedPosts}
                      currentPostId={post.id}
                    />
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { url } = context.params!;
    
    if (!url || typeof url !== 'string') {
      return {
        notFound: true
      };
    }

    console.log('getServerSideProps - Buscando post com URL:', url);

    // Buscar post por URL usando URL absoluta
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://atendesoft.com';
    const postResponse = await fetchPostByUrl(url, baseUrl);
    
    console.log('getServerSideProps - Post response:', postResponse);
    
    if (!postResponse.success || !postResponse.data) {
      console.log('getServerSideProps - Post não encontrado');
      return {
        notFound: true
      };
    }

    const post = postResponse.data;
    console.log('getServerSideProps - Post encontrado:', post.title);

    // Buscar posts relacionados (mesma keyword, excluindo o post atual)
    const relatedResponse = await fetchPosts({
      keyword: post.keyword,
      limit: 3,
      status: 'published'
    }, baseUrl);

    const relatedPosts = relatedResponse.success && relatedResponse.data
      ? relatedResponse.data.posts.filter((p: BlogPost) => p.id !== post.id).slice(0, 3)
      : [];

    // Buscar keywords populares para sidebar
    const keywordsResponse = await fetch(`${baseUrl}/api/blog/keywords?limit=10`);
    const keywordsData = await keywordsResponse.json();
    const popularKeywords = keywordsData.success ? keywordsData.data : [];

    console.log('getServerSideProps - Posts relacionados encontrados:', relatedPosts.length);

    return {
      props: {
        post,
        relatedPosts,
        popularKeywords
      }
    };
  } catch (error) {
    console.error('Erro no getServerSideProps:', error);
    return {
      notFound: true
    };
  }
};

export default PostPage;
