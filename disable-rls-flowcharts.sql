-- Script para desabilitar RLS temporariamente na tabela flowcharts
-- Execute este script no Supabase SQL Editor

-- Desabilitar RLS na tabela flowcharts
ALTER TABLE flowcharts DISABLE ROW LEVEL SECURITY;

-- Verificar se RLS foi desabilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'flowcharts';

-- Opcional: Remover políticas existentes (se houver)
-- DROP POLICY IF EXISTS "Users can view own flowcharts" ON flowcharts;
-- DROP POLICY IF EXISTS "Users can insert own flowcharts" ON flowcharts;
-- DROP POLICY IF EXISTS "Users can update own flowcharts" ON flowcharts;
-- DROP POLICY IF EXISTS "Users can delete own flowcharts" ON flowcharts;
