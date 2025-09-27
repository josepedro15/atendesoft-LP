-- Script para habilitar RLS com políticas adequadas na tabela flowcharts
-- Execute este script no Supabase SQL Editor

-- Habilitar RLS na tabela flowcharts
ALTER TABLE flowcharts ENABLE ROW LEVEL SECURITY;

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

-- Verificar políticas criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'flowcharts';
