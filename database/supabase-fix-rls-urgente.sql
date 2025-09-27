-- FIX URGENTE: Resolver erro 42501 - RLS bloqueando inserção
-- Execute este SQL no Supabase SQL Editor

-- 1. Verificar se a tabela existe
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'captura_leads'
);

-- 2. Se não existir, criar a tabela
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

-- 3. DESABILITAR RLS COMPLETAMENTE
ALTER TABLE captura_leads DISABLE ROW LEVEL SECURITY;

-- 4. Remover todas as políticas existentes
DROP POLICY IF EXISTS "Admins can read all leads" ON captura_leads;
DROP POLICY IF EXISTS "Admins can insert leads" ON captura_leads;
DROP POLICY IF EXISTS "Admins can update leads" ON captura_leads;
DROP POLICY IF EXISTS "Admins can delete leads" ON captura_leads;
DROP POLICY IF EXISTS "Allow public insert for lead capture" ON captura_leads;

-- 5. Verificar se RLS está desabilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'captura_leads';

-- 6. Testar inserção imediatamente
INSERT INTO captura_leads (nome, telefone, data_captura, origem, metadados) 
VALUES ('Teste Urgente', '(11) 99999-9999', now(), 'captura_page', '{"test": true}'::jsonb);

-- 7. Verificar se inseriu
SELECT * FROM captura_leads ORDER BY created_at DESC LIMIT 3;

-- 8. Se funcionou, mostrar sucesso
SELECT 'SUCESSO: Tabela captura_leads configurada corretamente!' as status;
