// API para listagem de posts do blog
import { NextApiRequest, NextApiResponse } from 'next';
import { BlogPostsResponse, BlogFilters } from '@/types/blog';
import { blogFiltersSchema, validateQuery } from '@/lib/validations';
import { createErrorResponse, createSuccessResponse, handleApiError } from '@/lib/errors';
import { config } from '@/lib/config';
import { createClient } from '@supabase/supabase-js';

// Cliente Supabase
const supabase = createClient(config.supabase.url, config.supabase.anonKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse<BlogPostsResponse>) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json(createErrorResponse(new Error('Method not allowed')));
  }

  try {
    // Validar parâmetros da query
    const filters = validateQuery(blogFiltersSchema, req.query);

    console.log('API: Buscando posts com filtros:', filters);

    // Construir query base
    let query = supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .eq('status', filters.status)
      .order('timestamp', { ascending: false });

    // Aplicar filtros apenas se fornecidos e não vazios
    if (filters.keyword && filters.keyword.trim() !== '') {
      query = query.eq('keyword', filters.keyword);
    }

    if (filters.search && filters.search.trim() !== '') {
      query = query.or(`title.ilike.%${filters.search}%,summary.ilike.%${filters.search}%`);
    }

    // Aplicar paginação
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: posts, error, count } = await query;

    console.log('API: Resultado da query:', { posts: posts?.length, error, count });

    if (error) {
      throw new Error(`Erro ao buscar posts: ${error.message}`);
    }

    const total = count || 0;
    const pages = Math.ceil(total / limit);

    console.log('API: Retornando dados:', { total, pages, postsCount: posts?.length });

    res.status(200).json(createSuccessResponse({
      posts: posts || [],
      pagination: {
        page,
        limit,
        total,
        pages
      }
    }));

  } catch (error) {
    const { status } = handleApiError(error);
    res.status(status).json(createErrorResponse(error));
  }
}
