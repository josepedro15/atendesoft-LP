// API para configurar dados iniciais
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

    // Primeiro, vamos tentar inserir dados ignorando conflitos
    const insertData = async () => {
      // Clientes
      const clients = [
        {
          name: 'TechCorp Ltda',
          document: '12.345.678/0001-90',
          email: 'contato@techcorp.com',
          phone: '(11) 99999-9999',
          company_size: 'Média',
          segment: 'Tecnologia'
        },
        {
          name: 'Camilotti Casa e Construção',
          document: '98.765.432/0001-10',
          email: 'vendas@camilotti.com',
          phone: '(11) 88888-8888',
          company_size: 'Grande',
          segment: 'Construção'
        }
      ];

      for (const client of clients) {
        try {
          const { data, error } = await supabase
            .from('clients')
            .upsert(client, { onConflict: 'document' })
            .select()
            .single();

          if (error) {
            results.push({ type: 'client', name: client.name, error: error.message });
          } else {
            results.push({ type: 'client', name: client.name, success: true, id: data.id });
          }
        } catch (err) {
          results.push({ type: 'client', name: client.name, error: err instanceof Error ? err.message : 'Erro desconhecido' });
        }
      }

      // Itens do catálogo
      const items = [
        {
          sku: 'AUTO-WA-001',
          name: 'Automação WhatsApp Business API',
          description: 'Implementação completa de automação WhatsApp com IA',
          category: 'Automação',
          unit_price: 2500.00,
          currency: 'BRL',
          is_active: true
        },
        {
          sku: 'DASH-BI-001',
          name: 'Dashboard BI com IA',
          description: 'Dashboard personalizado com inteligência artificial',
          category: 'Dashboard',
          unit_price: 3500.00,
          currency: 'BRL',
          is_active: true
        },
        {
          sku: 'TRAIN-001',
          name: 'Treinamento da Equipe',
          description: 'Capacitação completa da equipe no uso da plataforma',
          category: 'Treinamento',
          unit_price: 800.00,
          currency: 'BRL',
          is_active: true
        }
      ];

      for (const item of items) {
        try {
          const { data, error } = await supabase
            .from('catalog_items')
            .upsert(item, { onConflict: 'sku' })
            .select()
            .single();

          if (error) {
            results.push({ type: 'catalog_item', name: item.name, error: error.message });
          } else {
            results.push({ type: 'catalog_item', name: item.name, success: true, id: data.id });
          }
        } catch (err) {
          results.push({ type: 'catalog_item', name: item.name, error: err instanceof Error ? err.message : 'Erro desconhecido' });
        }
      }

      // Template
      const template = {
        name: 'Template Padrão',
        description: 'Template básico para propostas comerciais',
        content_json: {
          blocks: [
            {
              type: 'hero',
              props: {
                title: 'Proposta Comercial',
                subtitle: 'AtendeSoft'
              }
            },
            {
              type: 'pricing',
              props: {
                currency: 'BRL',
                items: []
              }
            }
          ]
        },
        default_variables: {
          fornecedor: { nome: 'AtendeSoft' },
          projeto: { validade: '7 dias' }
        },
        is_active: true
      };

      try {
        const { data, error } = await supabase
          .from('proposal_templates')
          .upsert(template, { onConflict: 'name' })
          .select()
          .single();

        if (error) {
          results.push({ type: 'template', name: template.name, error: error.message });
        } else {
          results.push({ type: 'template', name: template.name, success: true, id: data.id });
        }
      } catch (err) {
        results.push({ type: 'template', name: template.name, error: err instanceof Error ? err.message : 'Erro desconhecido' });
      }
    };

    await insertData();

    res.status(200).json({
      success: true,
      message: 'Tentativa de inserção de dados concluída',
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
