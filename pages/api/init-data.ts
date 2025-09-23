// API para inicializar dados básicos
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
    // Inserir dados usando SQL direto
    const insertQueries = [
      // Clientes
      `INSERT INTO clients (name, document, email, phone, company_size, segment) VALUES 
       ('TechCorp Ltda', '12.345.678/0001-90', 'contato@techcorp.com', '(11) 99999-9999', 'Média', 'Tecnologia'),
       ('Camilotti Casa e Construção', '98.765.432/0001-10', 'vendas@camilotti.com', '(11) 88888-8888', 'Grande', 'Construção')
       ON CONFLICT (document) DO NOTHING;`,
      
      // Itens do catálogo
      `INSERT INTO catalog_items (sku, name, description, category, unit_price, currency, is_active) VALUES 
       ('AUTO-WA-001', 'Automação WhatsApp Business API', 'Implementação completa de automação WhatsApp com IA', 'Automação', 2500.00, 'BRL', true),
       ('DASH-BI-001', 'Dashboard BI com IA', 'Dashboard personalizado com inteligência artificial', 'Dashboard', 3500.00, 'BRL', true),
       ('TRAIN-001', 'Treinamento da Equipe', 'Capacitação completa da equipe no uso da plataforma', 'Treinamento', 800.00, 'BRL', true),
       ('SUP-001', 'Suporte Técnico Mensal', 'Suporte técnico especializado por 30 dias', 'Suporte', 500.00, 'BRL', true),
       ('DEV-001', 'Desenvolvimento Customizado', 'Desenvolvimento de funcionalidades específicas', 'Desenvolvimento', 150.00, 'BRL', true)
       ON CONFLICT (sku) DO NOTHING;`,
      
      // Template padrão
      `INSERT INTO proposal_templates (name, description, content_json, default_variables, is_active) VALUES 
       ('Padrão — Plataforma de Atendimento Inteligente', 
        'Template padrão para propostas de automação WhatsApp com dashboard BI',
        '{"blocks":[{"type":"hero","props":{"title":"{{projeto.titulo}}","subtitle":"{{fornecedor.nome}} → {{cliente.nome}}"}},{"type":"objective","props":{"text":"Transformar o atendimento em um processo automatizado, ágil e escalável."}},{"type":"scope","props":{"items":["Infraestrutura segura","Fluxos n8n","Disparos em massa","Dashboards"]}},{"type":"pricing","props":{"currency":"{{precos.moeda}}","items":"{{precos.itens}}"}},{"type":"timeline","props":{"weeks":["Kickoff/Infra","Fluxos","Automação/Relatórios","Go-Live"]}},{"type":"terms","props":{"validade":"{{projeto.validade}}","condicoes":"{{precos.condicoes}}"}},{"type":"signature","props":{"cta":"Aceitar e Assinar"}}]}',
        '{"fornecedor":{"nome":"AtendeSoft","marca":"AtendeSoft"},"projeto":{"validade":"7 dias","condicoes":"50% à vista, 50% na entrega"},"precos":{"moeda":"BRL"}}',
        true)
       ON CONFLICT (name) DO NOTHING;`
    ];

    const results = [];

    for (const query of insertQueries) {
      try {
        const { data, error } = await supabase.rpc('exec_sql', { sql: query });
        
        if (error) {
          results.push({ query: query.substring(0, 50) + '...', error: error.message });
        } else {
          results.push({ query: query.substring(0, 50) + '...', success: true });
        }
      } catch (err) {
        results.push({ 
          query: query.substring(0, 50) + '...', 
          error: err instanceof Error ? err.message : 'Erro desconhecido' 
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Dados inicializados',
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
