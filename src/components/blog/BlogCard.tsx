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
    <article className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col group blog-card-optimized min-h-[450px] max-h-[600px]">
      
      {/* SEÇÃO 1: IMAGEM DE DESTAQUE - CONTAINER RÍGIDO */}
      {post.image && (
        <div className="image-section relative w-full h-48 sm:h-52 flex-shrink-0 overflow-hidden bg-muted/20">
          <Link href={postUrl} className="block w-full h-full">
            <Image
              src={post.image}
              alt={post.title}
              width={400}
              height={225}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              priority={false}
              style={{ 
                maxWidth: '100%', 
                maxHeight: '100%',
                objectFit: 'cover',
                objectPosition: 'center'
              }}
            />
          </Link>
          {/* Overlay sutil para melhor contraste */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
      )}

      {/* SEÇÃO 2: CONTEÚDO PRINCIPAL - CONTAINER FLEXÍVEL */}
      <div className="content-section flex flex-col flex-grow p-5 min-h-0">
        
        {/* SUBSECÇÃO 2.1: METADADOS - ALTURA FIXA */}
        <div className="metadata-section flex items-center justify-between mb-4 pb-3 flex-shrink-0 border-b border-border/30">
          {/* Data de publicação (origem: post.timestamp) */}
          <div className="flex items-center space-x-2 text-xs text-muted-foreground min-w-0">
            <Calendar size={12} className="text-muted-foreground/70 flex-shrink-0" />
            <time dateTime={post.timestamp} className="font-medium truncate">
              {formatDate(post.timestamp)}
            </time>
          </div>
          
          {/* Categoria/Keyword (origem: post.keyword) */}
          <div className="flex items-center space-x-1.5 min-w-0 ml-2">
            <Tag size={12} className="text-primary/70 flex-shrink-0" />
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full truncate max-w-32">
              {post.keyword}
            </span>
          </div>
        </div>

        {/* SUBSECÇÃO 2.2: TÍTULO PRINCIPAL - ALTURA FIXA */}
        <div className="title-section mb-4 flex-shrink-0">
          <h2 className="text-xl font-bold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200 min-h-[3.5rem]">
            <Link href={postUrl} className="block">
              {post.title}
            </Link>
          </h2>
        </div>

        {/* SUBSECÇÃO 2.3: RESUMO/EXCERPT - FLEXÍVEL */}
        <div className="summary-section mb-5 flex-grow min-h-0">
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 min-h-[4.5rem] max-h-[6rem] overflow-hidden">
            {post.summary}
          </p>
        </div>

        {/* SUBSECÇÃO 2.4: AÇÃO PRINCIPAL - ALTURA FIXA */}
        <div className="action-section pt-3 flex-shrink-0 border-t border-border/30">
          <Link
            href={postUrl}
            className="inline-flex items-center text-primary hover:text-primary/80 font-semibold text-sm transition-all duration-200 group/link"
          >
            <span className="group-hover/link:underline">Ler artigo completo</span>
            <svg
              className="ml-2 w-4 h-4 transition-transform group-hover/link:translate-x-1 flex-shrink-0"
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
