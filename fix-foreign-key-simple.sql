-- SQL simples para corrigir problema de foreign key
-- Execute este script no Supabase SQL Editor

-- Opção 1: Remover temporariamente as constraints de foreign key
ALTER TABLE flowcharts DROP CONSTRAINT IF EXISTS flowcharts_user_id_fkey;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Verificar se as constraints foram removidas
SELECT 
  tc.table_name, 
  tc.constraint_name, 
  tc.constraint_type
FROM information_schema.table_constraints tc
WHERE tc.table_name IN ('flowcharts', 'profiles')
  AND tc.constraint_type = 'FOREIGN KEY';

-- Testar inserção na tabela flowcharts
INSERT INTO flowcharts (title, description, data, user_id, is_template, is_public)
VALUES (
  'Teste Sem Foreign Key',
  'Teste de inserção sem constraints',
  '{"nodes": [], "edges": []}',
  '00000000-0000-0000-0000-000000000000',
  false,
  false
);

-- Verificar se foi inserido
SELECT * FROM flowcharts WHERE title = 'Teste Sem Foreign Key';

-- Limpar o teste
DELETE FROM flowcharts WHERE title = 'Teste Sem Foreign Key';

-- Para reativar as constraints depois (quando tiver usuários reais):
-- ALTER TABLE profiles ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id);
-- ALTER TABLE flowcharts ADD CONSTRAINT flowcharts_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id);
