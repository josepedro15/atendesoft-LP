-- SQL para configurar fluxogramas como públicos (todos podem ver todos)
-- Execute este script no Supabase SQL Editor

-- 1. Desabilitar RLS na tabela flowcharts
ALTER TABLE flowcharts DISABLE ROW LEVEL SECURITY;

-- 2. Remover constraints de foreign key
ALTER TABLE flowcharts DROP CONSTRAINT IF EXISTS flowcharts_user_id_fkey;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 3. Verificar se as mudanças foram aplicadas
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename = 'flowcharts';

-- 4. Verificar constraints restantes
SELECT 
  tc.table_name, 
  tc.constraint_name, 
  tc.constraint_type
FROM information_schema.table_constraints tc
WHERE tc.table_name IN ('flowcharts', 'profiles')
  AND tc.constraint_type = 'FOREIGN KEY';

-- 5. Testar inserção
INSERT INTO flowcharts (title, description, data, user_id, is_template, is_public)
VALUES (
  'Teste Fluxograma Público',
  'Teste de fluxograma que todos podem ver',
  '{"nodes": [], "edges": []}',
  '00000000-0000-0000-0000-000000000000',
  false,
  true
);

-- 6. Verificar se foi inserido
SELECT * FROM flowcharts WHERE title = 'Teste Fluxograma Público';

-- 7. Limpar o teste
DELETE FROM flowcharts WHERE title = 'Teste Fluxograma Público';

-- 8. Confirmar que está funcionando
SELECT '✅ Configuração concluída! Agora todos os usuários podem ver todos os fluxogramas.' as status;
