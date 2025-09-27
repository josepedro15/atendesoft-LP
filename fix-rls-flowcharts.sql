-- SQL para corrigir RLS na tabela flowcharts
-- Execute este script no Supabase SQL Editor

-- 1. Desabilitar RLS temporariamente
ALTER TABLE flowcharts DISABLE ROW LEVEL SECURITY;

-- 2. Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Users can view own flowcharts" ON flowcharts;
DROP POLICY IF EXISTS "Users can insert own flowcharts" ON flowcharts;
DROP POLICY IF EXISTS "Users can update own flowcharts" ON flowcharts;
DROP POLICY IF EXISTS "Users can delete own flowcharts" ON flowcharts;
DROP POLICY IF EXISTS "Anyone can view public flowcharts" ON flowcharts;
DROP POLICY IF EXISTS "Anyone can view public templates" ON flowcharts;

-- 3. Habilitar RLS novamente
ALTER TABLE flowcharts ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas adequadas
-- Política para visualizar fluxogramas próprios
CREATE POLICY "Users can view own flowcharts" ON flowcharts
    FOR SELECT USING (auth.uid() = user_id);

-- Política para inserir fluxogramas próprios
CREATE POLICY "Users can insert own flowcharts" ON flowcharts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para atualizar fluxogramas próprios
CREATE POLICY "Users can update own flowcharts" ON flowcharts
    FOR UPDATE USING (auth.uid() = user_id);

-- Política para deletar fluxogramas próprios
CREATE POLICY "Users can delete own flowcharts" ON flowcharts
    FOR DELETE USING (auth.uid() = user_id);

-- Política para visualizar fluxogramas públicos
CREATE POLICY "Anyone can view public flowcharts" ON flowcharts
    FOR SELECT USING (is_public = true);

-- Política para visualizar templates públicos
CREATE POLICY "Anyone can view public templates" ON flowcharts
    FOR SELECT USING (is_template = true AND is_public = true);

-- 5. Verificar se as políticas foram criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'flowcharts';

-- 6. Verificar status do RLS
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'flowcharts';
