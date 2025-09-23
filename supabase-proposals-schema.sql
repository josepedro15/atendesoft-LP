-- Schema para Módulo de Propostas Comerciais
-- Baseado na especificação funcional e técnica

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clientes básicos (ou referenciar tabela de CRM)
CREATE TABLE clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  document text, -- CNPJ/CPF
  email text,
  phone text,
  company_size text,
  segment text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Templates reutilizáveis (com blocos e placeholders)
CREATE TABLE proposal_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  content_json jsonb NOT NULL, -- estrutura do editor (seções/blocos)
  default_variables jsonb,     -- valores padrão
  is_active boolean DEFAULT true,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Propostas (entidade lógica)
CREATE TABLE proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  owner_id uuid, -- vendedor responsável
  title text,
  currency text DEFAULT 'BRL',
  status text NOT NULL DEFAULT 'draft',
  valid_until date,
  approval_required boolean DEFAULT false,
  approvals jsonb, -- histórico/respostas
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Versões publicadas (imutáveis para auditoria)
CREATE TABLE proposal_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid REFERENCES proposals(id) ON DELETE CASCADE,
  version_number int NOT NULL,
  snapshot_html text NOT NULL,  -- render final
  snapshot_json jsonb NOT NULL, -- conteúdo estruturado (seções, preços)
  variables jsonb NOT NULL,     -- valores resolvidos
  total_amount numeric(12,2) NOT NULL DEFAULT 0,
  discount_amount numeric(12,2) NOT NULL DEFAULT 0,
  tax_amount numeric(12,2) NOT NULL DEFAULT 0,
  public_token text UNIQUE,     -- token do link público
  public_url text,              -- URL amigável
  pdf_file_id uuid,             -- referencia em files
  created_at timestamptz DEFAULT now()
);

-- Itens de preço por versão
CREATE TABLE proposal_version_items (
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

-- Eventos (rastreamento)
CREATE TABLE proposal_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid REFERENCES proposals(id) ON DELETE CASCADE,
  version_id uuid REFERENCES proposal_versions(id) ON DELETE SET NULL,
  type text NOT NULL, -- sent, open, download_pdf, signature_start, signature_complete
  metadata jsonb,
  ip inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Assinaturas
CREATE TABLE proposal_signatures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid REFERENCES proposals(id) ON DELETE CASCADE,
  version_id uuid REFERENCES proposal_versions(id) ON DELETE SET NULL,
  signer_name text,
  signer_email text,
  method text, -- draw|type|clickwrap
  signature_data text, -- base64 (se draw), texto (se type), hash (se clickwrap)
  signed_at timestamptz,
  ip inet,
  hash text -- hash do snapshot para imutabilidade
);

-- Arquivos (PDFs, anexos)
CREATE TABLE files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL,
  mime text,
  size int,
  created_at timestamptz DEFAULT now()
);

-- Catálogo de produtos/serviços (opcional)
CREATE TABLE catalog_items (
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
CREATE INDEX idx_proposal_events_proposal_created ON proposal_events (proposal_id, created_at);
CREATE INDEX idx_proposal_versions_proposal_version ON proposal_versions (proposal_id, version_number);
CREATE INDEX idx_proposals_owner_status ON proposals (owner_id, status);
CREATE INDEX idx_proposals_client ON proposals (client_id);
CREATE INDEX idx_proposal_versions_token ON proposal_versions (public_token);
CREATE INDEX idx_proposal_signatures_proposal ON proposal_signatures (proposal_id);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_proposal_templates_updated_at BEFORE UPDATE ON proposal_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON proposals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_catalog_items_updated_at BEFORE UPDATE ON catalog_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) - Configuração básica
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_items ENABLE ROW LEVEL SECURITY;

-- Políticas RLS básicas (ajustar conforme necessário)
-- Admin pode ver tudo
CREATE POLICY "Admin can do everything" ON clients FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin can do everything" ON proposals FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin can do everything" ON proposal_versions FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin can do everything" ON proposal_events FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin can do everything" ON proposal_signatures FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin can do everything" ON files FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin can do everything" ON proposal_templates FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin can do everything" ON catalog_items FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Vendedor pode ver suas próprias propostas
CREATE POLICY "Vendedor can manage own proposals" ON proposals FOR ALL USING (owner_id = auth.uid());
CREATE POLICY "Vendedor can view own proposal versions" ON proposal_versions FOR ALL USING (
  proposal_id IN (SELECT id FROM proposals WHERE owner_id = auth.uid())
);

-- Gestor pode ver propostas da equipe (implementar lógica de equipe conforme necessário)
CREATE POLICY "Gestor can view team proposals" ON proposals FOR SELECT USING (auth.jwt() ->> 'role' = 'gestor');

-- Público pode acessar versões com token válido (para página pública)
CREATE POLICY "Public can view proposal with valid token" ON proposal_versions FOR SELECT USING (
  public_token IS NOT NULL AND 
  created_at > (now() - interval '30 days') -- Token expira em 30 dias
);

-- Inserir dados de exemplo
INSERT INTO clients (name, document, email, phone, company_size, segment) VALUES
('TechCorp Ltda', '12.345.678/0001-90', 'contato@techcorp.com', '(11) 99999-9999', 'Média', 'Tecnologia'),
('Camilotti Casa e Construção', '98.765.432/0001-10', 'vendas@camilotti.com', '(11) 88888-8888', 'Grande', 'Construção'),
('StartupXYZ', '11.222.333/0001-44', 'ceo@startupxyz.com', '(11) 77777-7777', 'Pequena', 'SaaS');

INSERT INTO catalog_items (sku, name, description, category, unit_price) VALUES
('AUTO-WA-001', 'Automação WhatsApp Business API', 'Implementação completa de automação WhatsApp com IA', 'Automação', 2500.00),
('DASH-BI-001', 'Dashboard BI com IA', 'Dashboard personalizado com inteligência artificial', 'Dashboard', 3500.00),
('TRAIN-001', 'Treinamento da Equipe', 'Capacitação completa da equipe no uso da plataforma', 'Treinamento', 800.00),
('SUP-001', 'Suporte Técnico Mensal', 'Suporte técnico especializado por 30 dias', 'Suporte', 500.00),
('DEV-001', 'Desenvolvimento Customizado', 'Desenvolvimento de funcionalidades específicas', 'Desenvolvimento', 150.00);

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
);
