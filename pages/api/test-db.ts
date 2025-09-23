// API para testar conexão com o banco de dados
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
    // Testar conexão básica
    const { data: connectionTest, error: connectionError } = await supabase
      .from('catalog_items')
      .select('count')
      .limit(1);

    if (connectionError) {
      console.error('Erro de conexão:', connectionError);
      return res.status(500).json({
        success: false,
        error: 'Erro de conexão com o banco',
        details: connectionError.message
      });
    }

    // Testar inserção
    const { data: insertTest, error: insertError } = await supabase
      .from('catalog_items')
      .insert({
        sku: 'TEST-001',
        name: 'Item de Teste',
        description: 'Teste de inserção',
        category: 'Teste',
        unit_price: 100.00,
        currency: 'BRL',
        is_active: true
      })
      .select()
      .single();

    if (insertError) {
      console.error('Erro de inserção:', insertError);
      return res.status(500).json({
        success: false,
        error: 'Erro de inserção',
        details: insertError.message
      });
    }

    // Limpar item de teste
    await supabase
      .from('catalog_items')
      .delete()
      .eq('id', insertTest.id);

    res.status(200).json({
      success: true,
      message: 'Conexão com banco funcionando',
      testData: insertTest
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
