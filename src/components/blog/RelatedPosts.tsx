import { BlogPost } from '@/types/blog';
import { getPostUrl, formatDate } from '@/lib/blog';
import { Calendar, Tag } from 'lucide-react';
import Link from 'next/link';

interface RelatedPostsProps {
  posts: BlogPost[];
  currentPostId: string;
}

const RelatedPosts = ({ posts, currentPostId }: RelatedPostsProps) => {
  // Filtrar o post atual e pegar apenas os primeiros 3
  const relatedPosts = posts.filter(post => post.id !== currentPostId).slice(0, 3);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="bg-muted/30 rounded-lg p-6">
      <h3 className="text-2xl font-bold text-foreground mb-6">
        Artigos Relacionados
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map((post) => {
          const postUrl = getPostUrl(post);
          
          return (
            <article key={post.id} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              {/* Imagem */}
              {post.image && (
                <div className="aspect-video overflow-hidden">
                  <Link href={postUrl}>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                </div>
              )}

              <div className="p-4">
                {/* Meta informações */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                  <div className="flex items-center space-x-1">
                    <Calendar size={12} />
                    <span>{formatDate(post.timestamp)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Tag size={12} />
                    <span>{post.keyword}</span>
                  </div>
                </div>

                {/* Título */}
                <h4 className="font-semibold text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors">
                  <Link href={postUrl}>
                    {post.title}
                  </Link>
                </h4>

                {/* Resumo */}
                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                  {post.summary}
                </p>

                {/* Link para ler mais */}
                <Link
                  href={postUrl}
                  className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Ler mais →
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default RelatedPosts;
