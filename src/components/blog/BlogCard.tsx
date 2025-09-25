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
    <article className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col group blog-card-optimized min-h-[420px]">
      
      {/* SEÇÃO 1: IMAGEM DE DESTAQUE (origem: post.image) */}
      {post.image && (
        <div className="image-section relative w-full h-48 sm:h-52 overflow-hidden bg-muted/20">
          <Link href={postUrl} className="block h-full">
            <Image
              src={post.image}
              alt={post.title}
              width={400}
              height={225}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              priority={false}
            />
          </Link>
          {/* Overlay sutil para melhor contraste */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}

      {/* SEÇÃO 2: CONTEÚDO PRINCIPAL */}
      <div className="content-section p-5">
        
        {/* SUBSECÇÃO 2.1: METADADOS (origem: timestamp + keyword) */}
        <div className="metadata-section flex items-center justify-between mb-4 pb-3">
          {/* Data de publicação (origem: post.timestamp) */}
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Calendar size={12} className="text-muted-foreground/70" />
            <time dateTime={post.timestamp} className="font-medium">
              {formatDate(post.timestamp)}
            </time>
          </div>
          
          {/* Categoria/Keyword (origem: post.keyword) */}
          <div className="flex items-center space-x-1.5">
            <Tag size={12} className="text-primary/70" />
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
              {post.keyword}
            </span>
          </div>
        </div>

        {/* SUBSECÇÃO 2.2: TÍTULO PRINCIPAL (origem: post.title) */}
        <div className="title-section mb-4">
          <h2 className="text-xl font-bold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
            <Link href={postUrl} className="block">
              {post.title}
            </Link>
          </h2>
        </div>

        {/* SUBSECÇÃO 2.3: RESUMO/EXCERPT (origem: post.summary) */}
        <div className="summary-section mb-5">
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
            {post.summary}
          </p>
        </div>

        {/* SUBSECÇÃO 2.4: AÇÃO PRINCIPAL (origem: post.url) */}
        <div className="action-section pt-3">
          <Link
            href={postUrl}
            className="inline-flex items-center text-primary hover:text-primary/80 font-semibold text-sm transition-all duration-200 group/link"
          >
            <span className="group-hover/link:underline">Ler artigo completo</span>
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
