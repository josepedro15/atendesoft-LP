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
    <article className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col group">
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

      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        {/* Meta informações */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs text-muted-foreground mb-2 sm:mb-3">
          <div className="flex items-center space-x-1">
            <Calendar size={10} className="sm:w-3 sm:h-3" />
            <span className="text-xs">{formatDate(post.timestamp)}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Tag size={10} className="sm:w-3 sm:h-3" />
            <span className="truncate text-xs">{post.keyword}</span>
          </div>
        </div>

        {/* Título */}
        <h2 className="text-base sm:text-lg font-bold text-foreground mb-2 hover:text-primary transition-colors line-clamp-2 leading-tight">
          <Link href={postUrl}>
            {post.title}
          </Link>
        </h2>

        {/* Resumo */}
        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-3 flex-grow">
          {post.summary}
        </p>

        {/* Link para ler mais */}
        <Link
          href={postUrl}
          className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-xs sm:text-sm transition-colors mt-auto"
        >
          Ler mais
          <svg
            className="ml-1 w-3 h-3 sm:w-4 sm:h-4"
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
