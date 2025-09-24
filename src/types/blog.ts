// Tipos para o Blog - AtendeSoft
// Campos enviados pelo n8n: timestamp, title, keyword, summary, url, image, content

export interface BlogPost {
  id: string;
  timestamp: string;
  title: string;
  keyword: string;
  summary: string;
  url: string;
  image?: string;
  content: string;
  status: 'published' | 'draft';
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPostResponse {
  success: boolean;
  data?: BlogPost;
  error?: string;
}

export interface BlogPostsResponse {
  success: boolean;
  data?: {
    posts: BlogPost[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
  error?: string;
}

export interface KeywordStats {
  keyword: string;
  count: number;
}

export interface KeywordsResponse {
  success: boolean;
  data?: KeywordStats[];
  error?: string;
}

export interface BlogFilters {
  page?: number;
  limit?: number;
  keyword?: string;
  search?: string;
  status?: 'published' | 'draft';
}

export interface BlogStats {
  total_posts: number;
  published_posts: number;
  draft_posts: number;
  total_views: number;
  popular_keywords: KeywordStats[];
}

export interface BlogStatsResponse {
  success: boolean;
  data?: BlogStats;
  error?: string;
}
