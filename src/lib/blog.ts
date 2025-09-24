// Utilitários para o Blog - AtendeSoft
import { BlogPost, BlogFilters, KeywordStats } from '@/types/blog';

// Função para buscar posts
export async function fetchPosts(filters: BlogFilters = {}, baseUrl?: string) {
  const params = new URLSearchParams();
  
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.keyword) params.append('keyword', filters.keyword);
  if (filters.search) params.append('search', filters.search);
  if (filters.status) params.append('status', filters.status);

  // Usar URL absoluta no servidor, relativa no cliente
  const url = baseUrl 
    ? `${baseUrl}/api/blog/posts?${params.toString()}`
    : `/api/blog/posts?${params.toString()}`;

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Erro ao buscar posts');
  }
  
  return response.json();
}

// Função para buscar post por URL
export async function fetchPostByUrl(url: string, baseUrl?: string) {
  const apiUrl = baseUrl 
    ? `${baseUrl}/api/blog/posts/${encodeURIComponent(url)}`
    : `/api/blog/posts/${encodeURIComponent(url)}`;
    
  const response = await fetch(apiUrl);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Post não encontrado');
    }
    throw new Error('Erro ao buscar post');
  }
  
  return response.json();
}

// Função para buscar keywords populares
export async function fetchPopularKeywords(limit: number = 10): Promise<KeywordStats[]> {
  const response = await fetch(`/api/blog/keywords?limit=${limit}`);
  
  if (!response.ok) {
    throw new Error('Erro ao buscar keywords');
  }
  
  const data = await response.json();
  return data.data || [];
}

// Função para buscar estatísticas do blog
export async function fetchBlogStats() {
  const response = await fetch('/api/blog/stats');
  
  if (!response.ok) {
    throw new Error('Erro ao buscar estatísticas');
  }
  
  return response.json();
}

// Função para gerar URL do post
export function getPostUrl(post: BlogPost): string {
  return `/blog/${post.url}`;
}

// Função para gerar URL de posts por keyword
export function getKeywordUrl(keyword: string): string {
  return `/blog?keyword=${encodeURIComponent(keyword)}`;
}

// Função para calcular tempo de leitura estimado
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200; // Palavras por minuto
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Função para extrair excerpt do conteúdo
export function extractExcerpt(content: string, maxLength: number = 160): string {
  const text = content.replace(/<[^>]*>/g, '').trim();
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

// Função para formatar data
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Função para gerar meta tags do post
export function generatePostMetaTags(post: BlogPost) {
  return {
    title: post.title,
    description: post.summary,
    image: post.image,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://atendesoft.com'}/blog/${post.url}`,
    type: 'article',
    publishedTime: post.timestamp,
    modifiedTime: post.updated_at,
    author: 'AtendeSoft',
    section: post.keyword,
    tags: [post.keyword]
  };
}

// Função para gerar breadcrumb
export function generateBreadcrumb(post?: BlogPost, keyword?: string) {
  const breadcrumb = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' }
  ];

  if (keyword) {
    breadcrumb.push({ name: keyword, href: `/blog?keyword=${encodeURIComponent(keyword)}` });
  }

  if (post) {
    breadcrumb.push({ name: post.title, href: `/blog/${post.url}` });
  }

  return breadcrumb;
}
