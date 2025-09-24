import Head from 'next/head';
import { BlogPost } from '@/types/blog';

interface BlogSEOProps {
  post?: BlogPost;
  isListPage?: boolean;
  page?: number;
  totalPages?: number;
}

const BlogSEO = ({ post, isListPage = false, page = 1, totalPages = 1 }: BlogSEOProps) => {
  if (isListPage) {
    const title = page > 1 ? `Blog - Página ${page} | AtendeSoft` : 'Blog | AtendeSoft';
    const description = 'Descubra as últimas tendências em automação comercial, inteligência artificial e transformação digital. Artigos exclusivos da AtendeSoft.';
    const url = page > 1 ? `https://atendesoft.com/blog?page=${page}` : 'https://atendesoft.com/blog';

    return (
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content="blog, automação comercial, IA, inteligência artificial, transformação digital, artigos, tendências" />
        
        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content="https://atendesoft.com/og-blog.jpg" />
        <meta property="og:site_name" content="AtendeSoft" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://atendesoft.com/og-blog.jpg" />
        
        {/* Canonical */}
        <link rel="canonical" href={url} />
        
        {/* Pagination */}
        {page > 1 && (
          <link rel="prev" href={page === 2 ? 'https://atendesoft.com/blog' : `https://atendesoft.com/blog?page=${page - 1}`} />
        )}
        {page < totalPages && (
          <link rel="next" href={`https://atendesoft.com/blog?page=${page + 1}`} />
        )}
        
        {/* Schema.org */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Blog",
              "name": "Blog AtendeSoft",
              "description": description,
              "url": "https://atendesoft.com/blog",
              "publisher": {
                "@type": "Organization",
                "name": "AtendeSoft",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://atendesoft.com/logo.png"
                }
              }
            })
          }}
        />
      </Head>
    );
  }

  if (!post) return null;

  const postUrl = `https://atendesoft.com/blog/${post.url}`;
  const imageUrl = post.image || 'https://atendesoft.com/og-blog.jpg';
  const publishedDate = new Date(post.timestamp).toISOString();
  const modifiedDate = post.updated_at ? new Date(post.updated_at).toISOString() : publishedDate;

  return (
    <Head>
      <title>{post.title} | Blog AtendeSoft</title>
      <meta name="description" content={post.summary} />
      <meta name="keywords" content={`${post.keyword}, automação comercial, IA, inteligência artificial, blog, ${post.title}`} />
      <meta name="author" content="AtendeSoft" />
      
      {/* Open Graph */}
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={post.summary} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={postUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content="AtendeSoft" />
      <meta property="og:locale" content="pt_BR" />
      
      {/* Article specific */}
      <meta property="article:author" content="AtendeSoft" />
      <meta property="article:publisher" content="https://atendesoft.com" />
      <meta property="article:published_time" content={publishedDate} />
      <meta property="article:modified_time" content={modifiedDate} />
      <meta property="article:section" content={post.keyword} />
      <meta property="article:tag" content={post.keyword} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={post.title} />
      <meta name="twitter:description" content={post.summary} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content="@atendesoft" />
      <meta name="twitter:creator" content="@atendesoft" />
      
      {/* Canonical */}
      <link rel="canonical" href={postUrl} />
      
      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "description": post.summary,
            "image": imageUrl,
            "author": {
              "@type": "Organization",
              "name": "AtendeSoft",
              "url": "https://atendesoft.com"
            },
            "publisher": {
              "@type": "Organization",
              "name": "AtendeSoft",
              "logo": {
                "@type": "ImageObject",
                "url": "https://atendesoft.com/logo.png"
              }
            },
            "datePublished": publishedDate,
            "dateModified": modifiedDate,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": postUrl
            },
            "articleSection": post.keyword,
            "keywords": post.keyword,
            "wordCount": post.content ? post.content.length : 0,
            "inLanguage": "pt-BR"
          })
        }}
      />
    </Head>
  );
};

export default BlogSEO;
