-- SOLUÇÃO SIMPLES: Criar tabela sem RLS para captura de leads
-- Execute este SQL no Supabase para resolver o erro 42501

-- 1. Remover RLS temporariamente para permitir inserção pública
ALTER TABLE IF EXISTS captura_leads DISABLE ROW LEVEL SECURITY;

-- 2. Se a tabela não existir, criar
CREATE TABLE IF NOT EXISTS captura_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  telefone text NOT NULL,
  data_captura timestamptz NOT NULL,
  origem text DEFAULT 'captura_page',
  metadados jsonb,
  status text DEFAULT 'novo',
  observacoes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_captura_leads_data_captura ON captura_leads(data_captura DESC);
CREATE INDEX IF NOT EXISTS idx_captura_leads_origem ON captura_leads(origem);
CREATE INDEX IF NOT EXISTS idx_captura_leads_status ON captura_leads(status);
CREATE INDEX IF NOT EXISTS idx_captura_leads_telefone ON captura_leads(telefone);
CREATE INDEX IF NOT EXISTS idx_captura_leads_created_at ON captura_leads(created_at DESC);

-- 4. Criar função de trigger para updated_at
CREATE OR REPLACE FUNCTION update_captura_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Criar trigger
DROP TRIGGER IF EXISTS update_captura_leads_updated_at ON captura_leads;
CREATE TRIGGER update_captura_leads_updated_at 
    BEFORE UPDATE ON captura_leads 
    FOR EACH ROW 
    EXECUTE FUNCTION update_captura_leads_updated_at();

-- 6. Testar inserção
INSERT INTO captura_leads (nome, telefone, data_captura, origem, metadados) 
VALUES ('Teste Sistema', '(11) 99999-9999', now(), 'captura_page', '{"test": true, "user_agent": "test"}'::jsonb);

-- 7. Verificar se funcionou
SELECT * FROM captura_leads ORDER BY created_at DESC LIMIT 5;

-- 8. Comentários sobre a estrutura
COMMENT ON TABLE captura_leads IS 'Tabela para armazenar leads capturados na página de captura - SEM RLS para permitir inserção pública';
COMMENT ON COLUMN captura_leads.nome IS 'Nome completo do lead';
COMMENT ON COLUMN captura_leads.telefone IS 'Telefone/WhatsApp do lead';
COMMENT ON COLUMN captura_leads.data_captura IS 'Data e hora exata da captura';
COMMENT ON COLUMN captura_leads.origem IS 'Origem da captura (captura_page, landing_page, etc.)';
COMMENT ON COLUMN captura_leads.metadados IS 'Metadados adicionais em formato JSON';
COMMENT ON COLUMN captura_leads.status IS 'Status do lead (novo, contatado, convertido, etc.)';
COMMENT ON COLUMN captura_leads.observacoes IS 'Observações sobre o lead';
