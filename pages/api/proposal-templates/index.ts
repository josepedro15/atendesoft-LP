// API para gerenciamento de templates de propostas
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { ProposalTemplate, ApiResponse } from '@/types/proposals';

// Usa a mesma lógica do sistema de autenticação
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vlayangmpcogxoolcksc.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsYXlhbmdtcGNvZ3hvb2xja3NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NzEwMDIsImV4cCI6MjA2OTU0NzAwMn0.U4jxKlTf_eCX6zochG6wZPxRBvWk90erSNY_IEuYqrY'
);

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method === 'GET') {
    return handleGetTemplates(req, res);
  }
  
  if (req.method === 'POST') {
    return handleCreateTemplate(req, res);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).json({ success: false, error: 'Method not allowed' });
}

async function handleGetTemplates(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    const { active_only = 'true' } = req.query;

    // Dados mockados temporários
    const mockData = [
      {
        id: '1',
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
        },
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    let filteredData = mockData;

    // Aplicar filtros
    if (active_only === 'true') {
      filteredData = filteredData.filter(template => template.is_active);
    }

    res.status(200).json({
      success: true,
      data: filteredData
    });

  } catch (error) {
    console.error('Erro inesperado:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}

async function handleCreateTemplate(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    const { name, description, content_json, default_variables } = req.body;

    // Validar dados obrigatórios
    if (!name || !content_json) {
      return res.status(400).json({
        success: false,
        error: 'Nome e conteúdo são obrigatórios'
      });
    }

    // Obter usuário da sessão
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não autenticado'
      });
    }

    // Criar template
    const { data: template, error } = await supabase
      .from('proposal_templates')
      .insert({
        name,
        description,
        content_json,
        default_variables: default_variables || {},
        is_active: true,
        created_by: userId
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar template:', error);
      return res.status(500).json({
        success: false,
        error: 'Erro ao criar template'
      });
    }

    res.status(201).json({
      success: true,
      data: template,
      message: 'Template criado com sucesso'
    });

  } catch (error) {
    console.error('Erro inesperado:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}
