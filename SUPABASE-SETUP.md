# 🔧 Configuração do Supabase - AtendeSoft

## ❌ **Problema Identificado:**
- ✅ **Autenticação**: Funcionando
- ❌ **Tabela profiles**: Não existe
- ❌ **Login**: Falha por falta de estrutura

## 🚀 **Solução - Execute estes passos:**

### **1. Acesse o Painel do Supabase**
1. **Vá para**: [supabase.com/dashboard](https://supabase.com/dashboard)
2. **Selecione**: Seu projeto `vlayangmpcogxoolcksc`
3. **Clique em**: "SQL Editor" (ícone de código)

### **2. Execute o SQL de Setup**
1. **Copie todo o conteúdo** do arquivo `supabase-setup.sql`
2. **Cole no SQL Editor**
3. **Clique em**: "Run" (botão verde)

### **3. Verificar se funcionou**
Após executar o SQL, você deve ver:
- ✅ **Tabela `profiles`** criada
- ✅ **Tabela `flowcharts`** criada
- ✅ **Políticas de segurança** configuradas
- ✅ **Triggers** funcionando

### **4. Testar a Autenticação**

#### **Opção A: Usar usuário existente**
- **Email**: `jopedromkt@gmail.com` (que você já tem)
- **Senha**: A senha que você criou

#### **Opção B: Criar novo usuário**
1. **Acesse**: `https://atendesoft.com/login`
2. **Clique em**: "Não tem conta? Criar uma"
3. **Preencha**: Email e senha
4. **Confirme**: Email recebido
5. **Faça login**: Com as credenciais

### **5. Verificar no Painel**
1. **Vá para**: "Table Editor"
2. **Verifique**: Tabela `profiles` com dados
3. **Verifique**: Tabela `flowcharts` (vazia inicialmente)

## 📋 **Estrutura das Tabelas:**

### **Tabela `profiles`**
```sql
- id (UUID) - Referência ao auth.users
- email (TEXT) - Email do usuário
- full_name (TEXT) - Nome completo
- avatar_url (TEXT) - URL do avatar
- company (TEXT) - Empresa
- role (TEXT) - Papel do usuário
- created_at (TIMESTAMP) - Data de criação
- updated_at (TIMESTAMP) - Data de atualização
```

### **Tabela `flowcharts`**
```sql
- id (UUID) - ID único do fluxograma
- user_id (UUID) - Referência ao usuário
- title (TEXT) - Título do fluxograma
- description (TEXT) - Descrição
- data (JSONB) - Dados do fluxograma
- is_template (BOOLEAN) - É template?
- is_public (BOOLEAN) - É público?
- created_at (TIMESTAMP) - Data de criação
- updated_at (TIMESTAMP) - Data de atualização
```

## 🔐 **Políticas de Segurança:**
- ✅ **RLS habilitado** em todas as tabelas
- ✅ **Usuários só veem** seus próprios dados
- ✅ **Templates públicos** visíveis para todos
- ✅ **Triggers automáticos** para criar perfis

## 🧪 **Teste Final:**
Após configurar, execute:
```bash
node test-auth.js
```

Deve mostrar:
- ✅ Usuário criado
- ✅ Login funcionando
- ✅ Tabela profiles funcionando

## 🆘 **Se algo der errado:**

### **Erro: "relation does not exist"**
- Execute o SQL novamente
- Verifique se está no projeto correto

### **Erro: "permission denied"**
- Verifique se as políticas foram criadas
- Execute o SQL completo

### **Erro: "trigger does not exist"**
- Execute o SQL novamente
- Verifique se as funções foram criadas

## 📞 **Suporte:**
Se precisar de ajuda, me chame que eu ajudo a configurar!

---

**Status**: ⏳ Aguardando configuração do Supabase
**Próximo passo**: Executar SQL no painel do Supabase
