// API para listagem de posts do blog
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { BlogPostsResponse, BlogFilters } from '@/types/blog';

// Cliente Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vlayangmpcogxoolcksc.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsYXlhbmdtcGNvZ3hvb2xja3NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NzEwMDIsImV4cCI6MjA2OTU0NzAwMn0.U4jxKlTf_eCX6zochG6wZPxRBvWk90erSNY_IEuYqrY'
);

export default async function handler(req: NextApiRequest, res: NextApiResponse<BlogPostsResponse>) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { 
      page = 1, 
      limit = 10, 
      keyword, 
      search, 
      status = 'published' 
    } = req.query as BlogFilters;

    console.log('API: Buscando posts com filtros:', { page, limit, keyword, search, status });

    // Construir query base
    let query = supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .eq('status', status)
      .order('timestamp', { ascending: false });

    // Aplicar filtros apenas se fornecidos e não vazios
    if (keyword && keyword.trim() !== '') {
      query = query.eq('keyword', keyword);
    }

    if (search && search.trim() !== '') {
      query = query.or(`title.ilike.%${search}%,summary.ilike.%${search}%`);
    }

    // Aplicar paginação
    const from = (Number(page) - 1) * Number(limit);
    const to = from + Number(limit) - 1;
    query = query.range(from, to);

    const { data: posts, error, count } = await query;

    console.log('API: Resultado da query:', { posts: posts?.length, error, count });

    if (error) {
      console.error('Erro ao buscar posts:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Erro interno do servidor' 
      });
    }

    const total = count || 0;
    const pages = Math.ceil(total / Number(limit));

    console.log('API: Retornando dados:', { total, pages, postsCount: posts?.length });

    res.status(200).json({
      success: true,
      data: {
        posts: posts || [],
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages
        }
      }
    });

  } catch (error) {
    console.error('Erro inesperado:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}
