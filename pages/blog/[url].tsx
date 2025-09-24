import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { BlogPost } from '@/types/blog';
import { fetchPostByUrl, fetchPosts, generatePostMetaTags, getKeywordUrl } from '@/lib/blog';
import PostContent from '@/components/blog/PostContent';
import PostMeta from '@/components/blog/PostMeta';
import PostNavigation from '@/components/blog/PostNavigation';
import RelatedPosts from '@/components/blog/RelatedPosts';
import ShareButtons from '@/components/blog/ShareButtons';
import BlogSidebar from '@/components/blog/BlogSidebar';
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
  const metaTags = generatePostMetaTags(post);

  return (
    <>
      <Head>
        <title>{post.title} - Blog AtendeSoft</title>
        <meta name="description" content={post.summary} />
        <meta name="keywords" content={post.keyword} />
        
        {/* Open Graph */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.summary} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={metaTags.url} />
        {post.image && <meta property="og:image" content={post.image} />}
        <meta property="og:site_name" content="AtendeSoft" />
        <meta property="article:author" content="AtendeSoft" />
        <meta property="article:section" content={post.keyword} />
        <meta property="article:published_time" content={post.timestamp} />
        <meta property="article:modified_time" content={post.updated_at} />
        <meta property="article:tag" content={post.keyword} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.summary} />
        {post.image && <meta name="twitter:image" content={post.image} />}

        {/* Schema.org */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": post.title,
              "description": post.summary,
              "image": post.image,
              "author": {
                "@type": "Organization",
                "name": "AtendeSoft"
              },
              "publisher": {
                "@type": "Organization",
                "name": "AtendeSoft",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://atendesoft.com/logo.png"
                }
              },
              "datePublished": post.timestamp,
              "dateModified": post.updated_at,
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": metaTags.url
              }
            })
          }}
        />

        <link rel="canonical" href={metaTags.url} />
      </Head>

      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-20">
          {/* Breadcrumb */}
          <div className="container mx-auto px-6 py-4">
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
              <button
                onClick={() => router.push('/')}
                className="hover:text-foreground transition-colors"
              >
                Home
              </button>
              <span>/</span>
              <button
                onClick={() => router.push('/blog')}
                className="hover:text-foreground transition-colors"
              >
                Blog
              </button>
              <span>/</span>
              <button
                onClick={() => router.push(getKeywordUrl(post.keyword))}
                className="hover:text-foreground transition-colors"
              >
                {post.keyword}
              </button>
              <span>/</span>
              <span className="text-foreground">{post.title}</span>
            </nav>
          </div>

          <div className="container mx-auto px-6 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Conteúdo Principal */}
              <div className="lg:col-span-3">
                {/* Botão Voltar */}
                <button
                  onClick={() => router.back()}
                  className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
                >
                  <ArrowLeft size={16} />
                  <span>Voltar</span>
                </button>

                {/* Header do Post */}
                <article className="mb-8">
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
                    {post.title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center space-x-1">
                      <Calendar size={16} />
                      <span>{new Date(post.timestamp).toLocaleDateString('pt-BR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Tag size={16} />
                      <button
                        onClick={() => router.push(getKeywordUrl(post.keyword))}
                        className="hover:text-foreground transition-colors"
                      >
                        {post.keyword}
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Eye size={16} />
                      <span>{post.view_count} visualizações</span>
                    </div>
                  </div>

                  {/* Imagem Destacada */}
                  {post.image && (
                    <div className="mb-8">
                      <Image
                        src={post.image}
                        alt={post.title}
                        width={800}
                        height={400}
                        className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                        priority
                      />
                    </div>
                  )}

                  {/* Resumo */}
                  <div className="mb-8 p-6 bg-muted rounded-lg border-l-4 border-primary">
                    <p className="text-lg text-muted-foreground leading-relaxed">
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
                </article>

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
              <div className="lg:col-span-1">
                <BlogSidebar
                  popularKeywords={popularKeywords}
                  onKeywordClick={(keyword) => router.push(getKeywordUrl(keyword))}
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

    // Buscar post por URL
    const postResponse = await fetchPostByUrl(url);
    
    if (!postResponse.success || !postResponse.data) {
      return {
        notFound: true
      };
    }

    const post = postResponse.data;

    // Buscar posts relacionados (mesma keyword, excluindo o post atual)
    const relatedResponse = await fetchPosts({
      keyword: post.keyword,
      limit: 3,
      status: 'published'
    });

    const relatedPosts = relatedResponse.success && relatedResponse.data
      ? relatedResponse.data.posts.filter(p => p.id !== post.id).slice(0, 3)
      : [];

    // Buscar keywords populares para sidebar
    const keywordsResponse = await fetch('/api/blog/keywords?limit=10');
    const keywordsData = await keywordsResponse.json();
    const popularKeywords = keywordsData.success ? keywordsData.data : [];

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
