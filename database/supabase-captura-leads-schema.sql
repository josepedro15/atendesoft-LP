-- Schema para Captura de Leads - AtendeSoft
-- Tabela para armazenar leads capturados na página /captura

-- Tabela principal de captura de leads
CREATE TABLE captura_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,                    -- Nome completo do lead
  telefone text NOT NULL,                -- Telefone/WhatsApp do lead
  data_captura timestamptz NOT NULL,     -- Data e hora da captura
  origem text DEFAULT 'captura_page',    -- Origem da captura (captura_page, etc.)
  metadados jsonb,                       -- Metadados adicionais (user_agent, referrer, etc.)
  status text DEFAULT 'novo',            -- Status do lead (novo, contatado, convertido, etc.)
  observacoes text,                      -- Observações sobre o lead
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_captura_leads_data_captura ON captura_leads(data_captura DESC);
CREATE INDEX idx_captura_leads_origem ON captura_leads(origem);
CREATE INDEX idx_captura_leads_status ON captura_leads(status);
CREATE INDEX idx_captura_leads_telefone ON captura_leads(telefone);
CREATE INDEX idx_captura_leads_created_at ON captura_leads(created_at DESC);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_captura_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_captura_leads_updated_at 
    BEFORE UPDATE ON captura_leads 
    FOR EACH ROW 
    EXECUTE FUNCTION update_captura_leads_updated_at();

-- RLS (Row Level Security)
ALTER TABLE captura_leads ENABLE ROW LEVEL SECURITY;

-- Política: Apenas admins podem ler todos os leads
CREATE POLICY "Admins can read all leads" ON captura_leads
    FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Política: Apenas admins podem inserir leads
CREATE POLICY "Admins can insert leads" ON captura_leads
    FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Política: Apenas admins podem atualizar leads
CREATE POLICY "Admins can update leads" ON captura_leads
    FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Política: Apenas admins podem deletar leads
CREATE POLICY "Admins can delete leads" ON captura_leads
    FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Função para notificar quando novo lead é capturado
CREATE OR REPLACE FUNCTION notify_new_lead()
RETURNS TRIGGER AS $$
BEGIN
  -- Notificar para alertas, webhooks, etc.
  PERFORM pg_notify('new_lead', NEW.id::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para notificação
CREATE TRIGGER new_lead_trigger
  AFTER INSERT ON captura_leads
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_lead();

-- Função para obter estatísticas de leads
CREATE OR REPLACE FUNCTION get_leads_stats()
RETURNS TABLE (
  total_leads bigint,
  leads_hoje bigint,
  leads_semana bigint,
  leads_mes bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM captura_leads) as total_leads,
    (SELECT COUNT(*) FROM captura_leads WHERE DATE(created_at) = CURRENT_DATE) as leads_hoje,
    (SELECT COUNT(*) FROM captura_leads WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as leads_semana,
    (SELECT COUNT(*) FROM captura_leads WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as leads_mes;
END;
$$ LANGUAGE plpgsql;

-- Inserir dados de exemplo para desenvolvimento (opcional)
INSERT INTO captura_leads (nome, telefone, data_captura, origem, metadados, status) VALUES
(
  'João Silva',
  '(11) 99999-9999',
  now() - interval '1 hour',
  'captura_page',
  '{"user_agent": "Mozilla/5.0...", "referrer": "https://google.com", "timestamp": "2024-01-01T10:00:00Z"}',
  'novo'
),
(
  'Maria Santos',
  '(11) 88888-8888',
  now() - interval '2 hours',
  'captura_page',
  '{"user_agent": "Mozilla/5.0...", "referrer": "https://facebook.com", "timestamp": "2024-01-01T09:00:00Z"}',
  'novo'
);

-- Comentários sobre a estrutura
COMMENT ON TABLE captura_leads IS 'Tabela para armazenar leads capturados na página de captura';
COMMENT ON COLUMN captura_leads.nome IS 'Nome completo do lead';
COMMENT ON COLUMN captura_leads.telefone IS 'Telefone/WhatsApp do lead';
COMMENT ON COLUMN captura_leads.data_captura IS 'Data e hora exata da captura';
COMMENT ON COLUMN captura_leads.origem IS 'Origem da captura (captura_page, landing_page, etc.)';
COMMENT ON COLUMN captura_leads.metadados IS 'Metadados adicionais em formato JSON';
COMMENT ON COLUMN captura_leads.status IS 'Status do lead (novo, contatado, convertido, etc.)';
COMMENT ON COLUMN captura_leads.observacoes IS 'Observações sobre o lead';
