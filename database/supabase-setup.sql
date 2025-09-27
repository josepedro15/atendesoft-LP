-- Configuração do Supabase para AtendeSoft
-- Execute este SQL no painel do Supabase (SQL Editor)

-- 1. Criar tabela de perfis de usuários
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  company TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Habilitar RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de segurança para perfis
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS on_profiles_updated ON public.profiles;
CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 8. Criar tabela de fluxogramas (opcional)
CREATE TABLE IF NOT EXISTS public.flowcharts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  data JSONB NOT NULL DEFAULT '{}',
  is_template BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Habilitar RLS para fluxogramas
ALTER TABLE public.flowcharts ENABLE ROW LEVEL SECURITY;

-- 10. Políticas para fluxogramas
CREATE POLICY "Users can view own flowcharts" ON public.flowcharts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create flowcharts" ON public.flowcharts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own flowcharts" ON public.flowcharts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own flowcharts" ON public.flowcharts
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public templates" ON public.flowcharts
  FOR SELECT USING (is_public = TRUE AND is_template = TRUE);

-- 11. Trigger para atualizar updated_at em fluxogramas
DROP TRIGGER IF EXISTS on_flowcharts_updated ON public.flowcharts;
CREATE TRIGGER on_flowcharts_updated
  BEFORE UPDATE ON public.flowcharts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 12. Inserir usuário admin (opcional)
-- Descomente e ajuste o email se quiser criar um admin
-- INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
-- VALUES (
--   gen_random_uuid(),
--   'admin@atendesoft.com',
--   crypt('admin123', gen_salt('bf')),
--   NOW(),
--   NOW(),
--   NOW()
-- );

-- 13. Verificar se tudo foi criado
SELECT 'Tables created successfully' as status;
