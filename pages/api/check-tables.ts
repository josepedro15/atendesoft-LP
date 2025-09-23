// API para verificar se as tabelas existem
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vlayangmpcogxoolcksc.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsYXlhbmdtcGNvZ3hvb2xja3NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NzEwMDIsImV4cCI6MjA2OTU0NzAwMn0.U4jxKlTf_eCX6zochG6wZPxRBvWk90erSNY_IEuYqrY'
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const tables = [
      'clients',
      'catalog_items', 
      'proposal_templates',
      'proposals',
      'proposal_versions',
      'proposal_version_items',
      'proposal_events',
      'proposal_signatures',
      'files'
    ];

    const results: Record<string, any> = {};

    for (const table of tables) {
      try {
        const { data, error, count } = await supabase
          .from(table)
          .select('*', { count: 'exact' })
          .limit(1);

        results[table] = {
          exists: !error,
          error: error?.message || null,
          count: count || 0,
          sample: data?.[0] || null
        };
      } catch (err) {
        results[table] = {
          exists: false,
          error: err instanceof Error ? err.message : 'Erro desconhecido',
          count: 0,
          sample: null
        };
      }
    }

    res.status(200).json({
      success: true,
      tables: results
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
