import { BlogPost } from '@/types/blog';
import { getPostUrl, formatDate } from '@/lib/blog';
import { Calendar, Tag, Eye } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface BlogCardProps {
  post: BlogPost;
  onKeywordClick?: (keyword: string) => void;
}

const BlogCard = ({ post, onKeywordClick }: BlogCardProps) => {
  const postUrl = getPostUrl(post);

  return (
    <article className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Imagem */}
      {post.image && (
        <div className="aspect-video overflow-hidden">
          <Link href={postUrl}>
            <Image
              src={post.image}
              alt={post.title}
              width={400}
              height={225}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </Link>
        </div>
      )}

      <div className="p-6">
        {/* Meta informações */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center space-x-1">
            <Calendar size={14} />
            <span>{formatDate(post.timestamp)}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Tag size={14} />
            {onKeywordClick ? (
              <button
                onClick={() => onKeywordClick(post.keyword)}
                className="hover:text-foreground transition-colors"
              >
                {post.keyword}
              </button>
            ) : (
              <span>{post.keyword}</span>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            <Eye size={14} />
            <span>{post.view_count}</span>
          </div>
        </div>

        {/* Título */}
        <h2 className="text-2xl font-bold text-foreground mb-3 hover:text-primary transition-colors">
          <Link href={postUrl}>
            {post.title}
          </Link>
        </h2>

        {/* Resumo */}
        <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-3">
          {post.summary}
        </p>

        {/* Link para ler mais */}
        <Link
          href={postUrl}
          className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
        >
          Ler mais
          <svg
            className="ml-1 w-4 h-4"
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
