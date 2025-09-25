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
    <article className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col group blog-card-optimized min-h-[400px]">
      {/* Imagem */}
      {post.image && (
        <div className="relative w-full h-48 sm:h-52 overflow-hidden">
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

      {/* Conteúdo do Card */}
      <div className="flex flex-col flex-grow p-5 space-y-4">
        {/* Meta informações - Layout vertical para evitar sobreposição */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <Calendar size={14} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-medium">{formatDate(post.timestamp)}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Tag size={14} className="text-primary" />
            <span className="text-sm font-semibold text-primary bg-primary/10 px-2 py-1 rounded-md">
              {post.keyword}
            </span>
          </div>
        </div>

        {/* Título */}
        <div className="flex-grow">
          <h2 className="text-xl font-bold text-foreground leading-tight line-clamp-2 mb-3">
            <Link href={postUrl} className="hover:text-primary transition-colors">
              {post.title}
            </Link>
          </h2>
        </div>

        {/* Resumo */}
        <div className="flex-grow">
          <p className="text-muted-foreground text-base leading-relaxed line-clamp-3">
            {post.summary}
          </p>
        </div>

        {/* Link para ler mais - Sempre no final */}
        <div className="pt-2 border-t border-border/50">
          <Link
            href={postUrl}
            className="inline-flex items-center text-primary hover:text-primary/80 font-semibold text-base transition-all duration-200 group/link"
          >
            <span className="group-hover/link:underline">Ler mais</span>
            <svg
              className="ml-2 w-4 h-4 transition-transform group-hover/link:translate-x-1"
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
      </div>
    </article>
  );
};

export default BlogCard;
