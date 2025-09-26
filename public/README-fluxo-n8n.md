# 🚀 AtendeSoft Blog Engine - Sistema de Agentes N8N

## 📋 Visão Geral

Este é o workflow completo do sistema de automação de blog da AtendeSoft, que cria posts SEO-otimizados automaticamente todos os dias às 15:00, sem intervenção manual.

## 🎯 Funcionalidades

- **Pesquisa Automática**: Analisa Google Trends e seleciona tópicos com +30% de crescimento
- **Criação de Conteúdo**: IA gera posts de 1500-2000 palavras em português
- **Otimização SEO**: Títulos, meta descriptions e estrutura HTML otimizados
- **Linkagem Interna**: Adiciona automaticamente 5+ links para posts anteriores
- **Publicação Automática**: Salva no Supabase e atualiza sitemap
- **Notificações**: Envia alertas via WhatsApp Business

## ⚙️ Configuração

### 1. APIs Necessárias

```bash
# OpenAI API (GPT-4)
OPENAI_API_KEY=sk-...

# Perplexity AI API
PERPLEXITY_API_KEY=pplx-...

# SerpAPI (Google Trends + Images)
SERPAPI_KEY=...

# Supabase
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=eyJ...

# Evolution API (WhatsApp)
EVOLUTION_API_URL=https://...
EVOLUTION_API_KEY=...

# Google Sheets
GOOGLE_SHEETS_CREDENTIALS=...
```

### 2. Configuração do N8N

1. Importe o arquivo `fluxo-n8n-workflow.json` no N8N
2. Configure as credenciais de cada API
3. Atualize o `documentId` do Google Sheets
4. Configure o número do WhatsApp para notificações
5. Teste com execução manual antes de ativar o agendamento

### 3. Estrutura do Banco de Dados

Execute o schema SQL no Supabase:

```sql
-- Tabela para posts do blog
CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz NOT NULL,
  title text NOT NULL,
  keyword text NOT NULL,
  summary text NOT NULL,
  url text NOT NULL,
  image text,
  content text NOT NULL,
  status text DEFAULT 'published',
  view_count int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## 🔄 Fluxo de Trabalho

### Etapa 1: Pesquisa e Seleção
1. **Schedule Trigger**: Executa diariamente às 15:00
2. **Pesquisa Histórico**: Consulta Google Sheets para evitar duplicação
3. **Deduplicação**: Remove tópicos já utilizados
4. **Gera Termo**: Cria termo único para Google Trends
5. **Google Trends**: Busca tendências (Brasil, últimos 3 meses)
6. **Filtra**: Seleciona queries com volume > 30%
7. **Escolha**: IA seleciona melhor tópico baseado em relevância SEO

### Etapa 2: Criação de Conteúdo
1. **Pesquisa Detalhada**: Perplexity AI coleta informações atualizadas
2. **Processa Fontes**: Extrai e formata citações
3. **Cria Conteúdo**: IA gera post completo (1500-2000 palavras)
4. **Adiciona Links**: Integra 5+ links internos automaticamente

### Etapa 3: Formatação e SEO
1. **Gera HTML**: Cria estrutura HTML com design AtendeSoft
2. **Cria Slug**: Gera URL otimizada (4-5 palavras)
3. **Extrai Título**: SEO-friendly com palavra-chave principal
4. **Meta Description**: 150-160 caracteres otimizados

### Etapa 4: Recursos Visuais
1. **Busca Imagem**: SerpAPI encontra imagem de capa
2. **Processa Imagem**: Otimiza URL da imagem

### Etapa 5: Publicação
1. **Salva no Supabase**: Publica post com status "published"
2. **Notifica WhatsApp**: Envia alerta via Evolution API

## 📊 Resultados Esperados

- **Frequência**: 1 post por dia às 15:00
- **Qualidade**: 1500-2000 palavras, nível 5º ano
- **SEO**: Otimizado para ranqueamento no Google
- **Automação**: 100% automático, zero intervenção manual
- **Notificações**: Alertas em tempo real via WhatsApp

## 🛠️ Personalização

### Horário de Execução
```javascript
// No Schedule Trigger, altere o cron:
"0 15 * * *"  // 15:00 todos os dias
"0 9 * * *"   // 09:00 todos os dias
"0 12 * * 1"  // 12:00 toda segunda-feira
```

### Filtros de Tendências
```javascript
// No nó "Filtra Tendências", altere o threshold:
.filter(it => Number(it?.extracted_value) > 30)  // > 30%
.filter(it => Number(it?.extracted_value) > 50)  // > 50%
```

### Template HTML
Modifique o prompt no nó "Gera HTML" para personalizar o design do post.

## 📈 Monitoramento

### Logs do N8N
- Acesse a interface do N8N
- Monitore execuções na aba "Executions"
- Verifique logs de erro em caso de falhas

### Supabase
- Acesse o dashboard do Supabase
- Verifique a tabela `blog_posts`
- Monitore contadores de visualização

### WhatsApp
- Confirme recebimento das notificações
- Verifique se o número está configurado corretamente

## 🔧 Troubleshooting

### Erro de API
- Verifique se as chaves estão corretas
- Confirme se há créditos disponíveis
- Teste cada API individualmente

### Post não publicado
- Verifique logs do N8N
- Confirme se o Supabase está acessível
- Teste a conexão com o banco de dados

### Notificação não enviada
- Verifique se o Evolution API está funcionando
- Confirme se o número do WhatsApp está correto
- Teste o envio manual de mensagem

## 💰 Custos Estimados

- **OpenAI GPT-4**: ~$30-50/mês
- **Perplexity AI**: ~$20-30/mês
- **SerpAPI**: ~$10-20/mês
- **Supabase**: ~$5-10/mês
- **Evolution API**: ~$5-10/mês
- **Total**: ~$70-120/mês

## 📞 Suporte

Para dúvidas ou suporte técnico:
- WhatsApp: (31) 99495-9512
- Email: contato@atendesoft.com
- Site: https://atendesoft.com

---

**Desenvolvido por AtendeSoft**  
*Transformando dados em conteúdo que converte*
