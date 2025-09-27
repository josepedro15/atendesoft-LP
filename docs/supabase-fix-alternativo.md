# 🔧 SOLUÇÃO ALTERNATIVA - Se o SQL não funcionar

## Opção 1: Via Dashboard do Supabase

### 1. Acesse o Supabase Dashboard
- Vá para [supabase.com](https://supabase.com)
- Faça login e acesse seu projeto

### 2. Vá em Authentication > Policies
- No menu lateral, clique em **"Authentication"**
- Depois clique em **"Policies"**
- Procure pela tabela `captura_leads`

### 3. Desabilite RLS
- Se a tabela `captura_leads` aparecer na lista
- Clique no botão **"Disable RLS"** ou **"Disable Row Level Security"**

### 4. Ou vá em Table Editor
- No menu lateral, clique em **"Table Editor"**
- Procure pela tabela `captura_leads`
- Se não existir, clique em **"New Table"**
- Crie a tabela com os campos:
  - `id` (uuid, primary key)
  - `nome` (text)
  - `telefone` (text)
  - `data_captura` (timestamptz)
  - `origem` (text)
  - `metadados` (jsonb)
  - `status` (text)
  - `observacoes` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

## Opção 2: Via SQL Editor (RECOMENDADO)

### 1. Execute este SQL simples:
```sql
-- Criar tabela se não existir
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

-- Desabilitar RLS
ALTER TABLE captura_leads DISABLE ROW LEVEL SECURITY;
```

### 2. Teste a inserção:
```sql
INSERT INTO captura_leads (nome, telefone, data_captura, origem) 
VALUES ('Teste', '(11) 99999-9999', now(), 'captura_page');
```

## Opção 3: Verificar Configuração Atual

### Execute este SQL para diagnosticar:
```sql
-- Verificar se a tabela existe
SELECT table_name, row_security 
FROM information_schema.tables 
WHERE table_name = 'captura_leads';

-- Verificar políticas ativas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'captura_leads';
```

## Opção 4: Solução Temporária (Se nada funcionar)

### Modificar o código para usar uma tabela diferente:
1. Altere o nome da tabela no código de `captura_leads` para `leads_temp`
2. Execute o SQL criando a tabela `leads_temp`
3. Teste novamente

## Verificação Final

Após executar qualquer uma das opções:
1. Acesse `https://atendesoft.com/captura`
2. Preencha o formulário
3. Clique em "Acessar Sistema"
4. Deve funcionar sem erro 42501

## Contato de Suporte

Se nenhuma opção funcionar:
- WhatsApp: (31) 99495-9512
- Email: contato@atendesoft.com
