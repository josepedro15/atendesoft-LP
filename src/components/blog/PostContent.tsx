import { useEffect, useMemo } from 'react';
import { BlogPost } from '@/types/blog';
import PostImageCard from './PostImageCard';
import { renderProcessedContent } from '@/hooks/use-processed-content';

interface PostContentProps {
  post: BlogPost;
}

const PostContent = ({ post }: PostContentProps) => {
  // Processar o conteúdo para aplicar containment às imagens
  const processedContent = useMemo(() => {
    return renderProcessedContent(post.content, post.content);
  }, [post.content]);

  useEffect(() => {
    // Adicionar estilos customizados para o conteúdo do post
    const style = document.createElement('style');
    style.textContent = `
      .post-content {
        line-height: 1.7;
        color: hsl(var(--foreground));
      }
      
      .post-content h1,
      .post-content h2,
      .post-content h3,
      .post-content h4,
      .post-content h5,
      .post-content h6 {
        font-weight: 600;
        margin-top: 2rem;
        margin-bottom: 1rem;
        color: hsl(var(--foreground));
      }
      
      .post-content h1 {
        font-size: 2.25rem;
        line-height: 1.2;
      }
      
      .post-content h2 {
        font-size: 1.875rem;
        line-height: 1.3;
      }
      
      .post-content h3 {
        font-size: 1.5rem;
        line-height: 1.4;
      }
      
      .post-content h4 {
        font-size: 1.25rem;
        line-height: 1.4;
      }
      
      .post-content p {
        margin-bottom: 1.5rem;
        color: hsl(var(--muted-foreground));
      }
      
      .post-content ul,
      .post-content ol {
        margin-bottom: 1.5rem;
        padding-left: 1.5rem;
      }
      
      .post-content li {
        margin-bottom: 0.5rem;
        color: hsl(var(--muted-foreground));
      }
      
      .post-content blockquote {
        border-left: 4px solid hsl(var(--primary));
        padding-left: 1.5rem;
        margin: 2rem 0;
        font-style: italic;
        color: hsl(var(--muted-foreground));
        background: hsl(var(--muted) / 0.3);
        padding: 1rem 1.5rem;
        border-radius: 0 0.5rem 0.5rem 0;
      }
      
      .post-content code {
        background: hsl(var(--muted));
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.875rem;
        color: hsl(var(--foreground));
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      }
      
      .post-content pre {
        background: hsl(var(--muted));
        padding: 1.5rem;
        border-radius: 0.5rem;
        overflow-x: auto;
        margin: 1.5rem 0;
        border: 1px solid hsl(var(--border));
      }
      
      .post-content pre code {
        background: none;
        padding: 0;
        border-radius: 0;
        font-size: 0.875rem;
      }
      
      .post-content a {
        color: hsl(var(--primary));
        text-decoration: underline;
        text-decoration-color: hsl(var(--primary) / 0.3);
        text-underline-offset: 2px;
        transition: all 0.2s ease;
      }
      
      .post-content a:hover {
        text-decoration-color: hsl(var(--primary));
        color: hsl(var(--primary) / 0.8);
      }
      
      .post-content img {
        max-width: 100%;
        height: auto;
        border-radius: 0.5rem;
        margin: 1.5rem 0;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        contain: layout style paint;
        isolation: isolate;
      }

      /* Estilos para o PostImageCard */
      .post-image-card {
        contain: layout style paint;
        isolation: isolate;
        position: relative;
        z-index: 1;
      }

      .post-image-card * {
        position: relative;
        z-index: inherit;
        box-sizing: border-box;
      }

      /* Garantir que a imagem nunca vaze do container */
      .post-image-card img {
        width: 100% !important;
        height: 100% !important;
        max-width: 100% !important;
        max-height: 100% !important;
        object-fit: cover !important;
        object-position: center !important;
        display: block !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
      }
      
      .post-content table {
        width: 100%;
        border-collapse: collapse;
        margin: 1.5rem 0;
        border: 1px solid hsl(var(--border));
        border-radius: 0.5rem;
        overflow: hidden;
      }
      
      .post-content th,
      .post-content td {
        padding: 0.75rem 1rem;
        text-align: left;
        border-bottom: 1px solid hsl(var(--border));
      }
      
      .post-content th {
        background: hsl(var(--muted));
        font-weight: 600;
        color: hsl(var(--foreground));
      }
      
      .post-content td {
        color: hsl(var(--muted-foreground));
      }
      
      .post-content hr {
        border: none;
        height: 1px;
        background: hsl(var(--border));
        margin: 2rem 0;
      }
      
      .post-content strong {
        font-weight: 600;
        color: hsl(var(--foreground));
      }
      
      .post-content em {
        font-style: italic;
      }
      
      /* Responsividade */
      @media (max-width: 768px) {
        .post-content h1 {
          font-size: 1.875rem;
        }
        
        .post-content h2 {
          font-size: 1.5rem;
        }
        
        .post-content h3 {
          font-size: 1.25rem;
        }
        
        .post-content pre {
          padding: 1rem;
          font-size: 0.8rem;
        }
      }
    `;
    
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div 
      className="post-content prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
};

export default PostContent;
