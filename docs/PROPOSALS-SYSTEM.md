# Sistema de Propostas Comerciais - AtendeSoft

## 📋 Visão Geral

Sistema completo para criação, personalização, envio e rastreamento de propostas comerciais com assinatura eletrônica, baseado na especificação funcional e técnica fornecida.

## 🏗️ Arquitetura

### Banco de Dados (PostgreSQL/Supabase)
- **clients**: Dados dos clientes
- **proposal_templates**: Templates reutilizáveis
- **proposals**: Propostas principais
- **proposal_versions**: Versões publicadas (imutáveis)
- **proposal_version_items**: Itens de preço por versão
- **proposal_events**: Rastreamento de eventos
- **proposal_signatures**: Assinaturas eletrônicas
- **catalog_items**: Catálogo de produtos/serviços
- **files**: Arquivos (PDFs, anexos)

### API Routes (Next.js)
- `GET/POST /api/proposals` - CRUD de propostas
- `GET/PATCH/DELETE /api/proposals/[id]` - Operações específicas
- `POST /api/proposals/[id]/versions` - Publicar versão
- `POST /api/proposals/[id]/send` - Enviar proposta
- `GET/POST /api/proposal-templates` - Gerenciar templates
- `GET/POST /api/clients` - Gerenciar clientes
- `GET/POST /api/catalog/items` - Catálogo de produtos
- `POST /api/track/event` - Rastreamento de eventos
- `GET /api/track/open` - Pixel de tracking
- `POST /api/proposals/[id]/versions/[versionId]/sign` - Assinatura

### Páginas
- `/propostas` - Interface principal de gestão
- `/p/[token]` - Página pública para visualização e assinatura

## 🚀 Funcionalidades Implementadas

### ✅ Completas
1. **Schema do Banco de Dados** - Todas as tabelas com relacionamentos
2. **Tipos TypeScript** - Interfaces completas para type safety
3. **Engine de Templates** - Sintaxe Handlebars-like com helpers
4. **API Routes** - Todas as rotas principais implementadas
5. **Página Pública** - Visualização e assinatura com tracking
6. **Interface de Gestão** - CRUD completo de propostas
7. **Sistema de Rastreamento** - Eventos e analytics
8. **Assinatura Eletrônica** - Múltiplos métodos (desenhar, digitar, clickwrap)

### 🔄 Em Desenvolvimento
1. **Geração de PDF** - Puppeteer/Playwright
2. **Integrações** - WhatsApp API, Email, n8n webhooks
3. **Aprovação Interna** - Fluxo de aprovação com regras
4. **Dashboard Analytics** - Métricas e relatórios

## 📝 Como Usar

### 1. Configuração Inicial

```bash
# Executar o schema do banco
psql -f supabase-proposals-schema.sql

# Configurar variáveis de ambiente
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Criar uma Proposta

```typescript
// 1. Criar proposta
const response = await fetch('/api/proposals', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Proposta de Automação WhatsApp',
    client_id: 'client-uuid'
  })
});

// 2. Selecionar template
const template = await fetch('/api/proposal-templates').then(r => r.json());

// 3. Publicar versão
const version = await fetch(`/api/proposals/${proposalId}/versions`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    variables: {
      cliente: { nome: 'João Silva', empresa: 'TechCorp' },
      precos: { itens: [...] }
    },
    blocks: template.blocks
  })
});

// 4. Enviar proposta
await fetch(`/api/proposals/${proposalId}/send`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    channel: 'whatsapp',
    recipient_phone: '+5511999999999'
  })
});
```

### 3. Templates

```json
{
  "name": "Template Padrão",
  "content_json": {
    "blocks": [
      {
        "type": "hero",
        "props": {
          "title": "{{projeto.titulo}}",
          "subtitle": "{{fornecedor.nome}} → {{cliente.nome}}"
        }
      },
      {
        "type": "pricing",
        "props": {
          "items": "{{precos.itens}}"
        }
      }
    ]
  }
}
```

### 4. Variáveis Disponíveis

```typescript
interface ProposalVariables {
  cliente: {
    nome: string;
    empresa: string;
    email: string;
    telefone: string;
  };
  fornecedor: {
    nome: string;
    marca: string;
  };
  projeto: {
    titulo: string;
    validade: string;
  };
  precos: {
    itens: PriceItem[];
    moeda: string;
    condicoes: string;
  };
}
```

### 5. Helpers de Template

```handlebars
<!-- Formatação de moeda -->
{{currency 1500.50}} <!-- R$ 1.500,50 -->

<!-- Formatação de data -->
{{date "2025-01-20" "dd/MM/yyyy"}} <!-- 20/01/2025 -->

<!-- Cálculo de total -->
{{calcTotal 2 500 100}} <!-- 900 -->

<!-- Condicionais -->
{{#if cliente.empresa}}
  <p>Empresa: {{cliente.empresa}}</p>
{{/if}}

<!-- Loops -->
{{#each precos.itens}}
  <div>{{name}} - {{currency unit_price}}</div>
{{/each}}
```

## 🔐 Segurança

### Autenticação
- JWT tokens para usuários autenticados
- Row Level Security (RLS) no Supabase
- Verificação de permissões por role

### Links Públicos
- Tokens aleatórios de 32 caracteres
- Expiração configurável
- Rate limiting

### Assinatura Eletrônica
- Hash SHA-256 do conteúdo
- Captura de IP e User-Agent
- Múltiplos métodos de assinatura

## 📊 Rastreamento

### Eventos Capturados
- `sent` - Proposta enviada
- `open` - Primeira abertura
- `scroll` - Percentual de scroll
- `section_view` - Seções visualizadas
- `download_pdf` - Download do PDF
- `signature_start` - Início da assinatura
- `signature_complete` - Assinatura concluída

### Pixel de Tracking
```html
<img src="/api/track/open?pid=proposal-id&vid=version-id" alt="" />
```

## 🎨 Interface

### Página de Gestão (`/propostas`)
- Lista de propostas com filtros
- Criação e edição de propostas
- Seleção de templates
- Envio por múltiplos canais

### Página Pública (`/p/[token]`)
- Visualização responsiva
- Assinatura eletrônica
- Download de PDF
- Tracking automático

## 🔧 Próximos Passos

### 1. Geração de PDF
```typescript
// Implementar com Puppeteer
const pdf = await generatePDF(version.snapshot_html);
```

### 2. Integrações
```typescript
// WhatsApp Business API
await sendWhatsApp({
  to: '+5511999999999',
  template: 'proposal_notification',
  variables: ['Cliente', 'Link', 'Validade']
});

// Email com SendGrid
await sendEmail({
  to: 'cliente@email.com',
  subject: 'Proposta Comercial',
  html: emailTemplate,
  attachments: [pdf]
});

// Webhook para n8n
await sendWebhook('proposal.signed', {
  proposal_id,
  client,
  amount,
  signature
});
```

### 3. Aprovação Interna
```typescript
// Regras de aprovação
if (discount > 15 || totalAmount > 25000) {
  await requestApproval(proposalId, 'gestor');
}
```

## 📈 Métricas e Analytics

### KPIs Principais
- Taxa de conversão (enviadas → assinadas)
- Tempo médio de visualização
- Seções mais lidas
- Valor médio por proposta

### Dashboard
```typescript
const stats = {
  total: proposals.length,
  sent: proposals.filter(p => p.status === 'sent').length,
  signed: proposals.filter(p => p.status === 'signed').length,
  conversion_rate: signed / sent * 100
};
```

## 🚀 Deploy

### Vercel
```bash
# Configurar variáveis de ambiente
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add WHATSAPP_ACCESS_TOKEN
vercel env add SENDGRID_API_KEY

# Deploy
vercel --prod
```

### Supabase
```bash
# Executar migrations
supabase db push

# Configurar RLS policies
supabase db reset
```

## 📚 Recursos Adicionais

- [Documentação Supabase](https://supabase.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Handlebars.js](https://handlebarsjs.com/)
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)
- [SendGrid API](https://docs.sendgrid.com/)

---

**Sistema desenvolvido seguindo a especificação funcional e técnica fornecida, com foco em escalabilidade, segurança e experiência do usuário.**
