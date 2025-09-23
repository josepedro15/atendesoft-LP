# 🚀 Instalação do Sistema de Propostas Comerciais

## 📋 Pré-requisitos

- ✅ Projeto Next.js configurado
- ✅ Supabase configurado
- ✅ Variáveis de ambiente configuradas

## 🗄️ 1. Configurar Banco de Dados

### Opção A: Via Supabase Dashboard (Recomendado)

1. Acesse o **Supabase Dashboard**
2. Vá em **SQL Editor**
3. Copie e cole o conteúdo do arquivo `supabase-proposals-schema-simple.sql`
4. Execute o script

### Opção B: Via CLI

```bash
# Se você tem o Supabase CLI instalado
supabase db reset
supabase db push
```

## 🔧 2. Configurar Variáveis de Ambiente

Adicione ao seu `.env.local`:

```env
# Supabase (já configurado)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Integrações (opcional)
WHATSAPP_ACCESS_TOKEN=your_whatsapp_token
SENDGRID_API_KEY=your_sendgrid_key
```

## 🎯 3. Testar o Sistema

### 3.1 Acessar a Interface
```
http://localhost:3000/propostas
```

### 3.2 Criar uma Proposta de Teste
1. Clique em **"Nova Proposta"**
2. Preencha o título
3. Selecione um template
4. Publique a versão
5. Envie por link

### 3.3 Testar Página Pública
1. Copie o link público gerado
2. Abra em nova aba
3. Teste a assinatura

## 🔍 4. Verificar se Funcionou

### 4.1 Verificar Tabelas no Supabase
```sql
-- Verificar se as tabelas foram criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%proposal%' OR table_name LIKE '%client%';
```

### 4.2 Verificar Dados de Exemplo
```sql
-- Verificar clientes
SELECT * FROM clients;

-- Verificar templates
SELECT * FROM proposal_templates;

-- Verificar catálogo
SELECT * FROM catalog_items;
```

## 🚨 5. Solução de Problemas

### Erro: "syntax error at or near '{'"
- **Causa**: Tentando executar arquivo TypeScript como SQL
- **Solução**: Use apenas o arquivo `supabase-proposals-schema-simple.sql`

### Erro: "relation does not exist"
- **Causa**: Tabelas não foram criadas
- **Solução**: Execute o schema SQL no Supabase Dashboard

### Erro: "permission denied"
- **Causa**: RLS bloqueando acesso
- **Solução**: Verifique se está logado no Supabase

### Erro: "API route not found"
- **Causa**: Rotas não foram criadas
- **Solução**: Verifique se todos os arquivos da API estão no lugar correto

## 📱 6. Funcionalidades Disponíveis

### ✅ Implementadas
- [x] Criação de propostas
- [x] Templates reutilizáveis
- [x] Página pública com assinatura
- [x] Rastreamento de eventos
- [x] Envio por link
- [x] Gestão de clientes
- [x] Catálogo de produtos

### 🔄 Em Desenvolvimento
- [ ] Geração de PDF
- [ ] Envio por WhatsApp
- [ ] Envio por Email
- [ ] Aprovação interna
- [ ] Dashboard de métricas

## 🎨 7. Personalização

### 7.1 Adicionar Novos Templates
```typescript
// Em /api/proposal-templates
const newTemplate = {
  name: "Meu Template",
  content_json: {
    blocks: [
      { type: "hero", props: { title: "{{projeto.titulo}}" } }
    ]
  }
};
```

### 7.2 Adicionar Novos Blocos
```typescript
// Em src/lib/template-engine.ts
const newBlockTemplate = `
  <section class="my-custom-section">
    <h2>{{titulo}}</h2>
    <p>{{descricao}}</p>
  </section>
`;
```

### 7.3 Adicionar Novos Helpers
```typescript
// Em src/lib/template-engine.ts
templateEngine.addHelper('myHelper', {
  name: 'myHelper',
  fn: (value) => {
    return `Processed: ${value}`;
  }
});
```

## 📊 8. Monitoramento

### 8.1 Verificar Eventos
```sql
SELECT * FROM proposal_events 
ORDER BY created_at DESC 
LIMIT 10;
```

### 8.2 Verificar Assinaturas
```sql
SELECT * FROM proposal_signatures 
ORDER BY signed_at DESC;
```

### 8.3 Estatísticas Básicas
```sql
SELECT 
  status,
  COUNT(*) as count
FROM proposals 
GROUP BY status;
```

## 🚀 9. Próximos Passos

1. **Testar todas as funcionalidades**
2. **Personalizar templates** conforme sua marca
3. **Configurar integrações** (WhatsApp, Email)
4. **Implementar aprovação interna**
5. **Adicionar geração de PDF**
6. **Criar dashboard de métricas**

## 📞 10. Suporte

Se encontrar problemas:

1. **Verifique os logs** do console do navegador
2. **Verifique os logs** do Supabase
3. **Teste as APIs** individualmente
4. **Verifique as permissões** RLS

---

**Sistema pronto para uso! 🎉**
