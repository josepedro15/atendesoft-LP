// API para inserir dados de exemplo no banco
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vlayangmpcogxoolcksc.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsYXlhbmdtcGNvZ3hvb2xja3NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NzEwMDIsImV4cCI6MjA2OTU0NzAwMn0.U4jxKlTf_eCX6zochG6wZPxRBvWk90erSNY_IEuYqrY'
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const results = [];

    // 1. Inserir clientes
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
      },
      {
        name: 'StartupXYZ',
        document: '11.222.333/0001-44',
        email: 'ceo@startupxyz.com',
        phone: '(11) 77777-7777',
        company_size: 'Pequena',
        segment: 'SaaS'
      }
    ];

    for (const client of clients) {
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .upsert(client, { onConflict: 'document' })
        .select()
        .single();

      if (clientError) {
        console.error('Erro ao inserir cliente:', clientError);
      } else {
        results.push({ type: 'client', data: clientData });
      }
    }

    // 2. Inserir itens do catálogo
    const catalogItems = [
      {
        sku: 'AUTO-WA-001',
        name: 'Automação WhatsApp Business API',
        description: 'Implementação completa de automação WhatsApp com IA',
        category: 'Automação',
        unit_price: 2500.00
      },
      {
        sku: 'DASH-BI-001',
        name: 'Dashboard BI com IA',
        description: 'Dashboard personalizado com inteligência artificial',
        category: 'Dashboard',
        unit_price: 3500.00
      },
      {
        sku: 'TRAIN-001',
        name: 'Treinamento da Equipe',
        description: 'Capacitação completa da equipe no uso da plataforma',
        category: 'Treinamento',
        unit_price: 800.00
      },
      {
        sku: 'SUP-001',
        name: 'Suporte Técnico Mensal',
        description: 'Suporte técnico especializado por 30 dias',
        category: 'Suporte',
        unit_price: 500.00
      },
      {
        sku: 'DEV-001',
        name: 'Desenvolvimento Customizado',
        description: 'Desenvolvimento de funcionalidades específicas',
        category: 'Desenvolvimento',
        unit_price: 150.00
      }
    ];

    for (const item of catalogItems) {
      const { data: itemData, error: itemError } = await supabase
        .from('catalog_items')
        .upsert(item, { onConflict: 'sku' })
        .select()
        .single();

      if (itemError) {
        console.error('Erro ao inserir item:', itemError);
      } else {
        results.push({ type: 'catalog_item', data: itemData });
      }
    }

    // 3. Inserir template padrão
    const template = {
      name: 'Padrão — Plataforma de Atendimento Inteligente',
      description: 'Template padrão para propostas de automação WhatsApp com dashboard BI',
      content_json: {
        blocks: [
          {
            type: 'hero',
            props: {
              title: '{{projeto.titulo}}',
              subtitle: '{{fornecedor.nome}} → {{cliente.nome}}'
            }
          },
          {
            type: 'objective',
            props: {
              text: 'Transformar o atendimento em um processo automatizado, ágil e escalável.'
            }
          },
          {
            type: 'scope',
            props: {
              items: [
                'Infraestrutura segura',
                'Fluxos n8n',
                'Disparos em massa',
                'Dashboards'
              ]
            }
          },
          {
            type: 'pricing',
            props: {
              currency: '{{precos.moeda}}',
              items: '{{precos.itens}}'
            }
          },
          {
            type: 'timeline',
            props: {
              weeks: [
                'Kickoff/Infra',
                'Fluxos',
                'Automação/Relatórios',
                'Go-Live'
              ]
            }
          },
          {
            type: 'terms',
            props: {
              validade: '{{projeto.validade}}',
              condicoes: '{{precos.condicoes}}'
            }
          },
          {
            type: 'signature',
            props: {
              cta: 'Aceitar e Assinar'
            }
          }
        ]
      },
      default_variables: {
        fornecedor: {
          nome: 'AtendeSoft',
          marca: 'AtendeSoft'
        },
        projeto: {
          validade: '7 dias',
          condicoes: '50% à vista, 50% na entrega'
        },
        precos: {
          moeda: 'BRL'
        }
      }
    };

    const { data: templateData, error: templateError } = await supabase
      .from('proposal_templates')
      .upsert(template, { onConflict: 'name' })
      .select()
      .single();

    if (templateError) {
      console.error('Erro ao inserir template:', templateError);
    } else {
      results.push({ type: 'template', data: templateData });
    }

    res.status(200).json({
      success: true,
      message: 'Dados de exemplo inseridos com sucesso',
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
