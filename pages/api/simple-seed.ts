// API simples para inserir dados de exemplo
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

  try {
    const results = [];

    // 1. Inserir cliente
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .insert({
        name: 'TechCorp Ltda',
        document: '12.345.678/0001-90',
        email: 'contato@techcorp.com',
        phone: '(11) 99999-9999',
        company_size: 'Média',
        segment: 'Tecnologia'
      })
      .select()
      .single();

    if (clientError) {
      results.push({ type: 'client', error: clientError.message });
    } else {
      results.push({ type: 'client', success: true, id: client.id });
    }

    // 2. Inserir item do catálogo
    const { data: item, error: itemError } = await supabase
      .from('catalog_items')
      .insert({
        sku: 'AUTO-WA-001',
        name: 'Automação WhatsApp Business API',
        description: 'Implementação completa de automação WhatsApp com IA',
        category: 'Automação',
        unit_price: 2500.00,
        currency: 'BRL',
        is_active: true
      })
      .select()
      .single();

    if (itemError) {
      results.push({ type: 'catalog_item', error: itemError.message });
    } else {
      results.push({ type: 'catalog_item', success: true, id: item.id });
    }

    // 3. Inserir template
    const { data: template, error: templateError } = await supabase
      .from('proposal_templates')
      .insert({
        name: 'Template Padrão',
        description: 'Template básico para propostas',
        content_json: {
          blocks: [
            {
              type: 'hero',
              props: {
                title: 'Proposta Comercial',
                subtitle: 'AtendeSoft'
              }
            }
          ]
        },
        default_variables: {
          fornecedor: { nome: 'AtendeSoft' }
        },
        is_active: true
      })
      .select()
      .single();

    if (templateError) {
      results.push({ type: 'template', error: templateError.message });
    } else {
      results.push({ type: 'template', success: true, id: template.id });
    }

    res.status(200).json({
      success: true,
      message: 'Dados inseridos',
      results: results
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
