// API para buscar post individual por URL
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { BlogPostResponse } from '@/types/blog';

// Cliente Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vlayangmpcogxoolcksc.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsYXlhbmdtcGNvZ3hvb2xja3NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NzEwMDIsImV4cCI6MjA2OTU0NzAwMn0.U4jxKlTf_eCX6zochG6wZPxRBvWk90erSNY_IEuYqrY'
);

export default async function handler(req: NextApiRequest, res: NextApiResponse<BlogPostResponse>) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { url } = req.query;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ 
        success: false, 
        error: 'URL é obrigatória' 
      });
    }

    // Buscar post por URL
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('url', url)
      .eq('status', 'published')
      .single();

    if (error || !post) {
      return res.status(404).json({ 
        success: false, 
        error: 'Post não encontrado' 
      });
    }

    // Incrementar contador de visualizações
    await supabase
      .from('blog_posts')
      .update({ view_count: post.view_count + 1 })
      .eq('id', post.id);

    res.status(200).json({
      success: true,
      data: post
    });

  } catch (error) {
    console.error('Erro inesperado:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}
