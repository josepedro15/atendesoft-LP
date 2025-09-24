// API para buscar keywords populares
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { KeywordsResponse } from '@/types/blog';

// Cliente Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vlayangmpcogxoolcksc.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsYXlhbmdtcGNvZ3hvb2xja3NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NzEwMDIsImV4cCI6MjA2OTU0NzAwMn0.U4jxKlTf_eCX6zochG6wZPxRBvWk90erSNY_IEuYqrY'
);

export default async function handler(req: NextApiRequest, res: NextApiResponse<KeywordsResponse>) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { limit = 10 } = req.query;

    // Buscar todas as keywords de posts publicados
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('keyword')
      .eq('status', 'published');

    if (error) {
      console.error('Erro ao buscar keywords:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Erro interno do servidor' 
      });
    }

    // Contar frequência de keywords
    const keywordCount: Record<string, number> = {};
    
    posts?.forEach(post => {
      if (post.keyword) {
        keywordCount[post.keyword] = (keywordCount[post.keyword] || 0) + 1;
      }
    });

    // Converter para array e ordenar por frequência
    const popularKeywords = Object.entries(keywordCount)
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, Number(limit));

    res.status(200).json({
      success: true,
      data: popularKeywords
    });

  } catch (error) {
    console.error('Erro inesperado:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}
