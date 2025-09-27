-- FIX: Corrigir políticas RLS para permitir captura de leads
-- Execute este SQL no Supabase para corrigir o erro 42501

-- 1. Remover políticas existentes que estão bloqueando
DROP POLICY IF EXISTS "Admins can insert leads" ON captura_leads;
DROP POLICY IF EXISTS "Admins can read all leads" ON captura_leads;
DROP POLICY IF EXISTS "Admins can update leads" ON captura_leads;
DROP POLICY IF EXISTS "Admins can delete leads" ON captura_leads;

-- 2. Criar nova política que permite inserção pública (para captura de leads)
CREATE POLICY "Allow public insert for lead capture" ON captura_leads
    FOR INSERT WITH CHECK (true);

-- 3. Manter políticas restritivas para leitura, atualização e exclusão
CREATE POLICY "Admins can read all leads" ON captura_leads
    FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update leads" ON captura_leads
    FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can delete leads" ON captura_leads
    FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- 4. Verificar se a tabela existe, se não, criar
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

-- 5. Criar índices se não existirem
CREATE INDEX IF NOT EXISTS idx_captura_leads_data_captura ON captura_leads(data_captura DESC);
CREATE INDEX IF NOT EXISTS idx_captura_leads_origem ON captura_leads(origem);
CREATE INDEX IF NOT EXISTS idx_captura_leads_status ON captura_leads(status);
CREATE INDEX IF NOT EXISTS idx_captura_leads_telefone ON captura_leads(telefone);
CREATE INDEX IF NOT EXISTS idx_captura_leads_created_at ON captura_leads(created_at DESC);

-- 6. Habilitar RLS
ALTER TABLE captura_leads ENABLE ROW LEVEL SECURITY;

-- 7. Criar função de trigger se não existir
CREATE OR REPLACE FUNCTION update_captura_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Criar trigger se não existir
DROP TRIGGER IF EXISTS update_captura_leads_updated_at ON captura_leads;
CREATE TRIGGER update_captura_leads_updated_at 
    BEFORE UPDATE ON captura_leads 
    FOR EACH ROW 
    EXECUTE FUNCTION update_captura_leads_updated_at();

-- 9. Testar inserção (opcional - remover após teste)
-- INSERT INTO captura_leads (nome, telefone, data_captura, origem, metadados) 
-- VALUES ('Teste', '(11) 99999-9999', now(), 'captura_page', '{"test": true}');

-- 10. Verificar políticas criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'captura_leads';
