import { BlogPost } from '@/types/blog';
import { getPostUrl, formatDate } from '@/lib/blog';
import { Calendar, Tag, Eye } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  const postUrl = getPostUrl(post);

  return (
    <article className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col group blog-card-optimized">
      {/* Imagem */}
      {post.image && (
        <div className="aspect-video overflow-hidden max-h-40 sm:max-h-48">
          <Link href={postUrl}>
            <Image
              src={post.image}
              alt={post.title}
              width={400}
              height={225}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
        </div>
      )}

      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        {/* Meta informações */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground mb-3 sm:mb-4">
          <div className="flex items-center space-x-1.5 bg-muted/50 px-2 py-1 rounded-full">
            <Calendar size={12} className="text-primary" />
            <span className="text-xs font-medium">{formatDate(post.timestamp)}</span>
          </div>
          
          <div className="flex items-center space-x-1.5 bg-primary/10 px-2 py-1 rounded-full">
            <Tag size={12} className="text-primary" />
            <span className="text-xs font-medium text-primary truncate max-w-24 sm:max-w-none">{post.keyword}</span>
          </div>
        </div>

        {/* Título */}
        <h2 className="text-lg sm:text-xl font-bold text-foreground mb-3 hover:text-primary transition-colors line-clamp-2 leading-tight group-hover:underline">
          <Link href={postUrl} className="block">
            {post.title}
          </Link>
        </h2>

        {/* Resumo */}
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-4 sm:mb-5 line-clamp-3 flex-grow">
          {post.summary}
        </p>

        {/* Link para ler mais */}
        <Link
          href={postUrl}
          className="inline-flex items-center text-primary hover:text-primary/80 font-semibold text-sm sm:text-base transition-all duration-200 mt-auto group/link"
        >
          <span className="group-hover/link:underline">Ler mais</span>
          <svg
            className="ml-2 w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover/link:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </article>
  );
};

export default BlogCard;
