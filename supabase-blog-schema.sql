-- Schema para Blog - AtendeSoft
-- Campos enviados pelo n8n: timestamp, title, keyword, summary, url, image, content

-- Tabela principal de posts do blog
CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz NOT NULL, -- Quando foi criado pelo n8n
  title text NOT NULL,            -- Título do post
  keyword text NOT NULL,          -- Palavra-chave usada para criar o post
  summary text NOT NULL,          -- Resumo do post
  url text NOT NULL,              -- URL da página (slug)
  image text,                     -- URL da imagem
  content text NOT NULL,          -- Conteúdo HTML do post
  status text DEFAULT 'published', -- published, draft
  view_count int DEFAULT 0,       -- Contador de visualizações
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_blog_posts_url ON blog_posts(url);
CREATE INDEX idx_blog_posts_timestamp ON blog_posts(timestamp DESC);
CREATE INDEX idx_blog_posts_keyword ON blog_posts(keyword);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_status_timestamp ON blog_posts(status, timestamp DESC);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blog_posts_updated_at 
    BEFORE UPDATE ON blog_posts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_blog_posts_updated_at();

-- RLS (Row Level Security)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem ler posts publicados
CREATE POLICY "Anyone can read published posts" ON blog_posts
    FOR SELECT USING (status = 'published');

-- Política: Apenas admins podem inserir/atualizar/deletar
CREATE POLICY "Admins can manage posts" ON blog_posts
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Função para notificar quando novo post é criado (opcional)
CREATE OR REPLACE FUNCTION notify_new_blog_post()
RETURNS TRIGGER AS $$
BEGIN
  -- Notificar para invalidar cache, etc.
  PERFORM pg_notify('new_blog_post', NEW.id::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para notificação
CREATE TRIGGER new_blog_post_trigger
  AFTER INSERT ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_blog_post();

-- Inserir dados de exemplo para desenvolvimento
INSERT INTO blog_posts (timestamp, title, keyword, summary, url, image, content) VALUES
(
  now() - interval '1 day',
  'Como a IA está revolucionando o atendimento ao cliente',
  'inteligência artificial',
  'Descubra como a inteligência artificial está transformando o atendimento ao cliente e aumentando a satisfação dos usuários.',
  'ia-revolucionando-atendimento-cliente',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
  '<h1>Como a IA está revolucionando o atendimento ao cliente</h1><p>A inteligência artificial está transformando completamente a forma como as empresas atendem seus clientes...</p><h2>Principais benefícios</h2><ul><li>Atendimento 24/7</li><li>Respostas instantâneas</li><li>Personalização em escala</li></ul>'
),
(
  now() - interval '2 days',
  '5 passos para implementar automação no WhatsApp Business',
  'whatsapp business',
  'Aprenda os 5 passos essenciais para implementar automação no WhatsApp Business e aumentar suas vendas.',
  '5-passos-automacao-whatsapp-business',
  'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop',
  '<h1>5 passos para implementar automação no WhatsApp Business</h1><p>O WhatsApp Business é uma ferramenta poderosa para automação comercial...</p><h2>Passo 1: Configuração inicial</h2><p>Primeiro, você precisa configurar sua conta do WhatsApp Business...</p>'
),
(
  now() - interval '3 days',
  'Dashboard BI: transformando dados em decisões estratégicas',
  'business intelligence',
  'Entenda como dashboards de BI podem transformar seus dados em insights valiosos para tomada de decisão.',
  'dashboard-bi-decisoes-estrategicas',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
  '<h1>Dashboard BI: transformando dados em decisões estratégicas</h1><p>Business Intelligence é fundamental para empresas que querem tomar decisões baseadas em dados...</p><h2>Benefícios dos dashboards BI</h2><ul><li>Visualização clara dos dados</li><li>Identificação de tendências</li><li>Tomada de decisão mais rápida</li></ul>'
);
