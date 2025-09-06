# AtendeSoft - Landing Page

Landing page moderna para a AtendeSoft, empresa especializada em automações comerciais com inteligência artificial.

## 🎨 Design

Interface inspirada no Apple HIG (Human Interface Guidelines) com:
- Cores: Azul #4A90E2, Laranja #F39C12, Verde #2ECC71, Off-white #F5F5F5
- Tipografia: Inter com fallback para system-ui
- Componentes com backdrop blur e shadow sutis
- Animações suaves (150-250ms, ease-out)

## 📁 Estrutura de Conteúdo

Todos os conteúdos são gerenciados através de arquivos JSON na pasta `src/content/`:

### Como Editar Conteúdo

#### Benefícios/Pilares (`beneficios.json`)
```json
{
  "id": "identificador-unico",
  "titulo": "Nome do benefício",
  "descricao": "Descrição do benefício",
  "icone": "NomeDoIconeLucide",
  "beneficios": ["Lista", "de", "benefícios"]
}
```

#### Passos do Processo (`passos.json`)
```json
{
  "id": 1,
  "titulo": "Nome do passo",
  "descricao": "Descrição detalhada",
  "icone": "NomeDoIconeLucide",
  "tempo": "Tempo estimado"
}
```

#### Produtos (`produtos.json`)
```json
{
  "id": "id-produto",
  "titulo": "Nome do produto",
  "descricao": "Descrição do produto",
  "features": ["Lista", "de", "funcionalidades"],
  "cta_texto": "Texto do botão WhatsApp"
}
```

#### Dashboards (`dashboards.json`)
```json
{
  "id": "id-dashboard",
  "titulo": "Nome do dashboard",
  "descricao": "Descrição",
  "kpis": ["Lista", "de", "KPIs"]
}
```

#### Ferramentas/Integrações (`ferramentas.json`)
```json
{
  "nome": "Nome da ferramenta",
  "categoria": "Categoria",
  "descricao": "Descrição",
  "logo": "/logos/logo.svg",
  "link": "https://link.com"
}
```

#### Cases de Sucesso (`cases.json`)
```json
{
  "id": "id-case",
  "setor": "Setor do cliente",
  "cliente": "Nome do cliente",
  "problema": "Problema enfrentado",
  "solucao": "Solução implementada",
  "resultado_antes": "Métrica antes",
  "resultado_depois": "Métrica depois",
  "aumento": "+XX%",
  "tipo": "percentual|numerico|monetario"
}
```

#### Planos (`planos.json`)
```json
{
  "id": "id-plano",
  "nome": "Nome do plano",
  "descricao": "Descrição",
  "preco": "Valor ou 'Sob consulta'",
  "features": ["Lista", "de", "funcionalidades"],
  "popular": true/false,
  "cta_texto": "Texto do WhatsApp"
}
```

#### FAQ (`faq.json`)
```json
{
  "id": "id-pergunta",
  "pergunta": "Pergunta frequente",
  "resposta": "Resposta detalhada"
}
```

## 🔗 Configurações

### WhatsApp
Para alterar o link do WhatsApp, edite o número nos componentes:
- Substitua `5511999999999` pelo seu número no formato internacional
- Exemplo: `5511987654321` para (11) 98765-4321

### Trust Badges
Para adicionar logos reais das ferramentas:
1. Adicione os arquivos SVG em `public/logos/`
2. Atualize os caminhos em `ferramentas.json`

### Novas Ferramentas
Para adicionar uma nova ferramenta em `ferramentas.json`:
```json
{
  "nome": "Nova Ferramenta",
  "categoria": "Categoria",
  "descricao": "Descrição da ferramenta",
  "logo": "/logos/nova-ferramenta.svg",
  "link": "https://site-da-ferramenta.com"
}
```

## 📊 Analytics

O sistema de eventos está configurado em `src/lib/events.ts`. Eventos rastreados:
- `cta_whatsapp_click` - Cliques nos botões WhatsApp
- `pricing_click` - Cliques nos planos
- `scroll_75` - Usuário rolou 75% da página
- `faq_open` - Abertura de perguntas FAQ
- `video_play` - Reprodução de vídeos

Para integrar com Google Analytics, descomente e configure no arquivo de eventos.

## 🚀 Deploy

Esta é uma aplicação React + Vite otimizada para performance:
- Lighthouse Score ≥ 90
- LCP < 2.5s
- Totalmente responsiva (mobile-first)
- SEO otimizado com structured data
- Acessibilidade AA compliant

## 🛠 Tecnologias

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Design System customizado
- **Componentes**: shadcn/ui customizados
- **Ícones**: Lucide React
- **Roteamento**: React Router DOM
- **Build**: Vite
- **Fonts**: Inter via next/font

## 📱 Responsividade

Layout mobile-first com breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px  
- Desktop: > 1024px

Todos os componentes são totalmente responsivos e otimizados para diferentes dispositivos.