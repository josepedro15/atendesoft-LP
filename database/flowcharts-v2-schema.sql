-- Schema do Sistema de Fluxogramas v2.0

-- 1. Criar tabela de fluxogramas
CREATE TABLE IF NOT EXISTS public.flowcharts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL, -- Referência ao usuário
  title TEXT NOT NULL,
  description TEXT,
  data JSONB NOT NULL DEFAULT '{}',
  is_template BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_flowcharts_user_id ON public.flowcharts(user_id);
CREATE INDEX IF NOT EXISTS idx_flowcharts_public ON public.flowcharts(is_public) WHERE is_public = TRUE;
CREATE INDEX IF NOT EXISTS idx_flowcharts_templates ON public.flowcharts(is_template) WHERE is_template = TRUE;
CREATE INDEX IF NOT EXISTS idx_flowcharts_updated_at ON public.flowcharts(updated_at DESC);

-- 3. Habilitar RLS (Row Level Security)
ALTER TABLE public.flowcharts ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de segurança
CREATE POLICY "Users can view own flowcharts" ON public.flowcharts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create flowcharts" ON public.flowcharts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own flowcharts" ON public.flowcharts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own flowcharts" ON public.flowcharts
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public flowcharts" ON public.flowcharts
  FOR SELECT USING (is_public = TRUE);

CREATE POLICY "Anyone can view public templates" ON public.flowcharts
  FOR SELECT USING (is_public = TRUE AND is_template = TRUE);

-- 5. Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS on_flowcharts_updated ON public.flowcharts;
CREATE TRIGGER on_flowcharts_updated
  BEFORE UPDATE ON public.flowcharts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 7. Tabela de templates (opcional, para templates pré-definidos)
CREATE TABLE IF NOT EXISTS public.flowchart_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  thumbnail_url TEXT,
  data JSONB NOT NULL DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT TRUE,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Índices para templates
CREATE INDEX IF NOT EXISTS idx_templates_category ON public.flowchart_templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_public ON public.flowchart_templates(is_public) WHERE is_public = TRUE;
CREATE INDEX IF NOT EXISTS idx_templates_tags ON public.flowchart_templates USING GIN(tags);

-- 9. RLS para templates
ALTER TABLE public.flowchart_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public templates" ON public.flowchart_templates
  FOR SELECT USING (is_public = TRUE);

CREATE POLICY "Admins can manage templates" ON public.flowchart_templates
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 10. Trigger para templates
DROP TRIGGER IF EXISTS on_templates_updated ON public.flowchart_templates;
CREATE TRIGGER on_templates_updated
  BEFORE UPDATE ON public.flowchart_templates
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 11. Inserir templates de exemplo
INSERT INTO public.flowchart_templates (name, description, category, data, tags) VALUES
(
  'Fluxo de Vendas Básico',
  'Template básico para processo de vendas',
  'business',
  '{"nodes": [{"id": "start", "type": "startEnd", "label": "Início", "position": {"x": 100, "y": 100}}, {"id": "process", "type": "process", "label": "Processar Venda", "position": {"x": 300, "y": 100}}, {"id": "end", "type": "startEnd", "label": "Fim", "position": {"x": 500, "y": 100}}], "edges": [{"id": "e1", "source": "start", "target": "process"}, {"id": "e2", "source": "process", "target": "end"}]}',
  '{"vendas", "processo", "básico"}'
),
(
  'Fluxo de Aprovação',
  'Template para processos de aprovação',
  'business',
  '{"nodes": [{"id": "start", "type": "startEnd", "label": "Solicitação", "position": {"x": 100, "y": 100}}, {"id": "decision", "type": "decision", "label": "Aprovar?", "position": {"x": 300, "y": 100}}, {"id": "approved", "type": "process", "label": "Aprovado", "position": {"x": 500, "y": 50}}, {"id": "rejected", "type": "process", "label": "Rejeitado", "position": {"x": 500, "y": 150}}], "edges": [{"id": "e1", "source": "start", "target": "decision"}, {"id": "e2", "source": "decision", "target": "approved"}, {"id": "e3", "source": "decision", "target": "rejected"}]}',
  '{"aprovação", "decisão", "processo"}'
);

-- 12. Verificar se tudo foi criado
SELECT 'Schema do Sistema de Fluxogramas v2.0 criado com sucesso!' as status;
