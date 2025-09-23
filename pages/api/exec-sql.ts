// API para executar SQL direto (bypass RLS)
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vlayangmpcogxoolcksc.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsYXlhbmdtcGNvZ3hvb2xja3NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NzEwMDIsImV4cCI6MjA2OTU0NzAwMn0.U4jxKlTf_eCX6zochG6wZPxRBvWk90erSNY_IEuYqrY'
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { sql } = req.body;

  if (!sql) {
    return res.status(400).json({ success: false, error: 'SQL query required' });
  }

  try {
    // Executar SQL direto
    const { data, error } = await supabase.rpc('exec_sql', { sql });

    if (error) {
      console.error('Erro SQL:', error);
      return res.status(500).json({
        success: false,
        error: 'Erro ao executar SQL',
        details: error.message
      });
    }

    res.status(200).json({
      success: true,
      data: data,
      message: 'SQL executado com sucesso'
    });

  } catch (error) {
    console.error('Erro inesperado:', error);
    res.status(500).json({
      success: false,
      error: 'Erro inesperado',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}
