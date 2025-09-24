// API para estatísticas do blog
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { BlogStatsResponse } from '@/types/blog';

// Cliente Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vlayangmpcogxoolcksc.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsYXlhbmdtcGNvZ3hvb2xja3NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NzEwMDIsImV4cCI6MjA2OTU0NzAwMn0.U4jxKlTf_eCX6zochG6wZPxRBvWk90erSNY_IEuYqrY'
);

export default async function handler(req: NextApiRequest, res: NextApiResponse<BlogStatsResponse>) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Buscar estatísticas gerais
    const [
      { count: totalPosts },
      { count: publishedPosts },
      { count: draftPosts },
      { data: allPosts }
    ] = await Promise.all([
      supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
      supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
      supabase.from('blog_posts').select('view_count, keyword').eq('status', 'published')
    ]);

    // Calcular total de visualizações
    const totalViews = allPosts?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0;

    // Calcular keywords populares
    const keywordCount: Record<string, number> = {};
    allPosts?.forEach(post => {
      if (post.keyword) {
        keywordCount[post.keyword] = (keywordCount[post.keyword] || 0) + 1;
      }
    });

    const popularKeywords = Object.entries(keywordCount)
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const stats = {
      total_posts: totalPosts || 0,
      published_posts: publishedPosts || 0,
      draft_posts: draftPosts || 0,
      total_views: totalViews,
      popular_keywords: popularKeywords
    };

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Erro inesperado:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}
