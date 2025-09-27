-- Schema simplificado para Módulo de Propostas Comerciais
-- Compatível com Supabase

-- Clientes básicos
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  document text,
  email text,
  phone text,
  company_size text,
  segment text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Templates reutilizáveis
CREATE TABLE IF NOT EXISTS proposal_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  content_json jsonb NOT NULL,
  default_variables jsonb,
  is_active boolean DEFAULT true,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Propostas principais
CREATE TABLE IF NOT EXISTS proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  owner_id uuid,
  title text,
  currency text DEFAULT 'BRL',
  status text NOT NULL DEFAULT 'draft',
  valid_until date,
  approval_required boolean DEFAULT false,
  approvals jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Versões publicadas (imutáveis)
CREATE TABLE IF NOT EXISTS proposal_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid REFERENCES proposals(id) ON DELETE CASCADE,
  version_number int NOT NULL,
  snapshot_html text NOT NULL,
  snapshot_json jsonb NOT NULL,
  variables jsonb NOT NULL,
  total_amount numeric(12,2) NOT NULL DEFAULT 0,
  discount_amount numeric(12,2) NOT NULL DEFAULT 0,
  tax_amount numeric(12,2) NOT NULL DEFAULT 0,
  public_token text UNIQUE,
  public_url text,
  pdf_file_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Itens de preço por versão
CREATE TABLE IF NOT EXISTS proposal_version_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version_id uuid REFERENCES proposal_versions(id) ON DELETE CASCADE,
  sku text,
  name text NOT NULL,
  description text,
  quantity numeric(12,2) NOT NULL DEFAULT 1,
  unit_price numeric(12,2) NOT NULL DEFAULT 0,
  discount numeric(12,2) NOT NULL DEFAULT 0,
  tax_rate numeric(5,2) NOT NULL DEFAULT 0
);

-- Eventos de rastreamento
CREATE TABLE IF NOT EXISTS proposal_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid REFERENCES proposals(id) ON DELETE CASCADE,
  version_id uuid REFERENCES proposal_versions(id) ON DELETE SET NULL,
  type text NOT NULL,
  metadata jsonb,
  ip inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Assinaturas
CREATE TABLE IF NOT EXISTS proposal_signatures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid REFERENCES proposals(id) ON DELETE CASCADE,
  version_id uuid REFERENCES proposal_versions(id) ON DELETE SET NULL,
  signer_name text,
  signer_email text,
  method text,
  signature_data text,
  signed_at timestamptz,
  ip inet,
  hash text
);

-- Arquivos
CREATE TABLE IF NOT EXISTS files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL,
  mime text,
  size int,
  created_at timestamptz DEFAULT now()
);

-- Catálogo de produtos/serviços
CREATE TABLE IF NOT EXISTS catalog_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku text UNIQUE,
  name text NOT NULL,
  description text,
  category text,
  unit_price numeric(12,2) NOT NULL DEFAULT 0,
  currency text DEFAULT 'BRL',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_proposal_events_proposal_created ON proposal_events (proposal_id, created_at);
CREATE INDEX IF NOT EXISTS idx_proposal_versions_proposal_version ON proposal_versions (proposal_id, version_number);
CREATE INDEX IF NOT EXISTS idx_proposals_owner_status ON proposals (owner_id, status);
CREATE INDEX IF NOT EXISTS idx_proposals_client ON proposals (client_id);
CREATE INDEX IF NOT EXISTS idx_proposal_versions_token ON proposal_versions (public_token);
CREATE INDEX IF NOT EXISTS idx_proposal_signatures_proposal ON proposal_signatures (proposal_id);

-- Função para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_proposal_templates_updated_at ON proposal_templates;
CREATE TRIGGER update_proposal_templates_updated_at BEFORE UPDATE ON proposal_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_proposals_updated_at ON proposals;
CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON proposals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_catalog_items_updated_at ON catalog_items;
CREATE TRIGGER update_catalog_items_updated_at BEFORE UPDATE ON catalog_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_items ENABLE ROW LEVEL SECURITY;

-- Políticas RLS básicas
CREATE POLICY "Enable all access for authenticated users" ON clients FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for authenticated users" ON proposals FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for authenticated users" ON proposal_versions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for authenticated users" ON proposal_events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for authenticated users" ON proposal_signatures FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for authenticated users" ON files FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for authenticated users" ON proposal_templates FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for authenticated users" ON catalog_items FOR ALL USING (auth.role() = 'authenticated');

-- Política para acesso público às versões com token
CREATE POLICY "Public can view proposal with valid token" ON proposal_versions FOR SELECT USING (
  public_token IS NOT NULL AND 
  created_at > (now() - interval '30 days')
);

-- Inserir dados de exemplo
INSERT INTO clients (name, document, email, phone, company_size, segment) VALUES
('TechCorp Ltda', '12.345.678/0001-90', 'contato@techcorp.com', '(11) 99999-9999', 'Média', 'Tecnologia'),
('Camilotti Casa e Construção', '98.765.432/0001-10', 'vendas@camilotti.com', '(11) 88888-8888', 'Grande', 'Construção'),
('StartupXYZ', '11.222.333/0001-44', 'ceo@startupxyz.com', '(11) 77777-7777', 'Pequena', 'SaaS')
ON CONFLICT DO NOTHING;

INSERT INTO catalog_items (sku, name, description, category, unit_price) VALUES
('AUTO-WA-001', 'Automação WhatsApp Business API', 'Implementação completa de automação WhatsApp com IA', 'Automação', 2500.00),
('DASH-BI-001', 'Dashboard BI com IA', 'Dashboard personalizado com inteligência artificial', 'Dashboard', 3500.00),
('TRAIN-001', 'Treinamento da Equipe', 'Capacitação completa da equipe no uso da plataforma', 'Treinamento', 800.00),
('SUP-001', 'Suporte Técnico Mensal', 'Suporte técnico especializado por 30 dias', 'Suporte', 500.00),
('DEV-001', 'Desenvolvimento Customizado', 'Desenvolvimento de funcionalidades específicas', 'Desenvolvimento', 150.00)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO proposal_templates (name, description, content_json, default_variables) VALUES
(
  'Padrão — Plataforma de Atendimento Inteligente',
  'Template padrão para propostas de automação WhatsApp com dashboard BI',
  '{
    "blocks": [
      {
        "type": "hero",
        "props": {
          "title": "{{projeto.titulo}}",
          "subtitle": "{{fornecedor.nome}} → {{cliente.nome}}"
        }
      },
      {
        "type": "objective",
        "props": {
          "text": "Transformar o atendimento em um processo automatizado, ágil e escalável."
        }
      },
      {
        "type": "scope",
        "props": {
          "items": [
            "Infraestrutura segura",
            "Fluxos n8n",
            "Disparos em massa",
            "Dashboards"
          ]
        }
      },
      {
        "type": "pricing",
        "props": {
          "currency": "{{precos.moeda}}",
          "items": "{{precos.itens}}"
        }
      },
      {
        "type": "timeline",
        "props": {
          "weeks": [
            "Kickoff/Infra",
            "Fluxos",
            "Automação/Relatórios",
            "Go-Live"
          ]
        }
      },
      {
        "type": "terms",
        "props": {
          "validade": "{{projeto.validade}}",
          "condicoes": "{{precos.condicoes}}"
        }
      },
      {
        "type": "signature",
        "props": {
          "cta": "Aceitar e Assinar"
        }
      }
    ]
  }',
  '{
    "fornecedor": {
      "nome": "AtendeSoft",
      "marca": "AtendeSoft"
    },
    "projeto": {
      "validade": "7 dias",
      "condicoes": "50% à vista, 50% na entrega"
    },
    "precos": {
      "moeda": "BRL"
    }
  }'
)
ON CONFLICT DO NOTHING;
