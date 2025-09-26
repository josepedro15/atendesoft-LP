-- Schema completo para Sistema de Propostas - AtendeSoft
-- Este arquivo contém todas as tabelas necessárias para o sistema de propostas

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de clientes
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  document text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de itens do catálogo
CREATE TABLE IF NOT EXISTS catalog_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  category text NOT NULL,
  unit_price decimal(10,2) NOT NULL,
  currency text DEFAULT 'BRL',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de templates de propostas
CREATE TABLE IF NOT EXISTS proposal_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  content_json jsonb NOT NULL,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela principal de propostas
CREATE TABLE IF NOT EXISTS proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  client_id uuid REFERENCES clients(id),
  owner_id uuid REFERENCES auth.users(id) NOT NULL,
  currency text DEFAULT 'BRL',
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'signed', 'rejected')),
  valid_until timestamptz,
  approval_required boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de versões de propostas (imutáveis)
CREATE TABLE IF NOT EXISTS proposal_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid REFERENCES proposals(id) ON DELETE CASCADE,
  version_number int NOT NULL,
  content_json jsonb NOT NULL,
  total_amount decimal(10,2),
  published_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Tabela de itens por versão de proposta
CREATE TABLE IF NOT EXISTS proposal_version_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version_id uuid REFERENCES proposal_versions(id) ON DELETE CASCADE,
  catalog_item_id uuid REFERENCES catalog_items(id),
  quantity int DEFAULT 1,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  description text
);

-- Tabela de eventos de rastreamento
CREATE TABLE IF NOT EXISTS proposal_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid REFERENCES proposals(id) ON DELETE CASCADE,
  version_id uuid REFERENCES proposal_versions(id) ON DELETE CASCADE,
  event_type text NOT NULL CHECK (event_type IN ('created', 'sent', 'opened', 'viewed', 'signed', 'rejected')),
  event_data jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Tabela de assinaturas
CREATE TABLE IF NOT EXISTS proposal_signatures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version_id uuid REFERENCES proposal_versions(id) ON DELETE CASCADE,
  signer_name text NOT NULL,
  signer_email text NOT NULL,
  signer_document text,
  signature_data jsonb, -- Dados da assinatura (imagem, texto, etc.)
  signed_at timestamptz DEFAULT now(),
  ip_address text,
  user_agent text
);

-- Tabela de analytics (opcional)
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event text NOT NULL,
  properties jsonb,
  user_id uuid REFERENCES auth.users(id),
  session_id text,
  ip_address text,
  user_agent text,
  timestamp timestamptz DEFAULT now()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_proposals_owner_id ON proposals(owner_id);
CREATE INDEX IF NOT EXISTS idx_proposals_client_id ON proposals(client_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_created_at ON proposals(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_proposal_versions_proposal_id ON proposal_versions(proposal_id);
CREATE INDEX IF NOT EXISTS idx_proposal_versions_published_at ON proposal_versions(published_at DESC);

CREATE INDEX IF NOT EXISTS idx_proposal_events_proposal_id ON proposal_events(proposal_id);
CREATE INDEX IF NOT EXISTS idx_proposal_events_created_at ON proposal_events(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_proposal_signatures_version_id ON proposal_signatures(version_id);
CREATE INDEX IF NOT EXISTS idx_proposal_signatures_signed_at ON proposal_signatures(signed_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event ON analytics_events(event);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clients_updated_at 
    BEFORE UPDATE ON clients 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_catalog_items_updated_at 
    BEFORE UPDATE ON catalog_items 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proposal_templates_updated_at 
    BEFORE UPDATE ON proposal_templates 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proposals_updated_at 
    BEFORE UPDATE ON proposals 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_version_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para clients
CREATE POLICY "Users can view all clients" ON clients
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create clients" ON clients
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their clients" ON clients
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Políticas RLS para catalog_items
CREATE POLICY "Anyone can view active catalog items" ON catalog_items
    FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage catalog items" ON catalog_items
    FOR ALL USING (auth.role() = 'authenticated');

-- Políticas RLS para proposal_templates
CREATE POLICY "Users can view active templates" ON proposal_templates
    FOR SELECT USING (is_active = true);

CREATE POLICY "Users can create templates" ON proposal_templates
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their templates" ON proposal_templates
    FOR UPDATE USING (auth.uid() = created_by);

-- Políticas RLS para proposals
CREATE POLICY "Users can view their proposals" ON proposals
    FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can create proposals" ON proposals
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their proposals" ON proposals
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their proposals" ON proposals
    FOR DELETE USING (auth.uid() = owner_id);

-- Políticas RLS para proposal_versions
CREATE POLICY "Users can view versions of their proposals" ON proposal_versions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM proposals 
            WHERE id = proposal_versions.proposal_id 
            AND owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can create versions for their proposals" ON proposal_versions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM proposals 
            WHERE id = proposal_versions.proposal_id 
            AND owner_id = auth.uid()
        )
    );

-- Políticas RLS para proposal_version_items
CREATE POLICY "Users can view items of their proposal versions" ON proposal_version_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM proposal_versions pv
            JOIN proposals p ON p.id = pv.proposal_id
            WHERE pv.id = proposal_version_items.version_id
            AND p.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage items of their proposal versions" ON proposal_version_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM proposal_versions pv
            JOIN proposals p ON p.id = pv.proposal_id
            WHERE pv.id = proposal_version_items.version_id
            AND p.owner_id = auth.uid()
        )
    );

-- Políticas RLS para proposal_events
CREATE POLICY "Users can view events of their proposals" ON proposal_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM proposals 
            WHERE id = proposal_events.proposal_id 
            AND owner_id = auth.uid()
        )
    );

CREATE POLICY "System can create events" ON proposal_events
    FOR INSERT WITH CHECK (true);

-- Políticas RLS para proposal_signatures
CREATE POLICY "Users can view signatures of their proposals" ON proposal_signatures
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM proposal_versions pv
            JOIN proposals p ON p.id = pv.proposal_id
            WHERE pv.id = proposal_signatures.version_id
            AND p.owner_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can create signatures" ON proposal_signatures
    FOR INSERT WITH CHECK (true);

-- Políticas RLS para analytics_events
CREATE POLICY "System can create analytics events" ON analytics_events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their analytics events" ON analytics_events
    FOR SELECT USING (auth.uid() = user_id);

-- Inserir dados de exemplo para desenvolvimento
INSERT INTO catalog_items (sku, name, description, category, unit_price, currency) VALUES
('AUTO-WA-001', 'Automação WhatsApp Business API', 'Implementação completa de automação WhatsApp com IA', 'Automação', 2500.00, 'BRL'),
('DASH-BI-001', 'Dashboard BI com IA', 'Dashboard personalizado com inteligência artificial', 'Dashboard', 3500.00, 'BRL'),
('TRAIN-001', 'Treinamento da Equipe', 'Capacitação completa da equipe no uso da plataforma', 'Treinamento', 800.00, 'BRL'),
('SUP-001', 'Suporte Técnico Mensal', 'Suporte técnico especializado por 30 dias', 'Suporte', 500.00, 'BRL'),
('DEV-001', 'Desenvolvimento Customizado', 'Desenvolvimento de funcionalidades específicas', 'Desenvolvimento', 150.00, 'BRL')
ON CONFLICT (sku) DO NOTHING;

-- Template de exemplo
INSERT INTO proposal_templates (name, description, content_json, is_active) VALUES
('Template Padrão', 'Template básico para propostas comerciais', 
'{"blocks": [{"type": "hero", "props": {"title": "{{projeto.titulo}}", "subtitle": "Proposta Comercial"}}, {"type": "content", "props": {"content": "{{projeto.descricao}}"}}, {"type": "pricing", "props": {"items": "{{projeto.itens}}"}}]}', 
true)
ON CONFLICT DO NOTHING;
