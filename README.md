# AtendeSoft Landing Page

Landing page moderna e responsiva para a AtendeSoft, empresa especializada em automação comercial, aplicativos e dashboards com IA.

## 🚀 Tecnologias

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Supabase** - Backend e autenticação
- **Framer Motion** - Animações
- **React Flow** - Editor de fluxogramas
- **Radix UI** - Componentes acessíveis

## 📁 Estrutura do Projeto

```
├── docs/                    # Documentação
│   ├── AUTHENTICATION.md
│   ├── DEPLOY.md
│   ├── MELHORIAS-IMPLEMENTADAS.md
│   └── PROPOSALS-SYSTEM.md
├── database/                # Scripts SQL
│   ├── supabase-*.sql
│   └── ...
├── pages/                   # Páginas Next.js
│   ├── api/                 # API Routes
│   ├── blog/                # Blog
│   ├── captura/             # Páginas de captura
│   ├── fluxogramas/         # Editor de fluxogramas
│   └── ...
├── public/                  # Arquivos estáticos
├── src/
│   ├── components/          # Componentes React
│   │   ├── ui/              # Componentes base
│   │   ├── blog/            # Componentes do blog
│   │   └── flowchart/       # Componentes de fluxograma
│   ├── contexts/            # Contextos React
│   ├── hooks/               # Hooks customizados
│   ├── lib/                 # Utilitários e configurações
│   ├── styles/              # Estilos CSS
│   └── types/               # Definições TypeScript
└── ...
```

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd atendesoft-LP-13
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp env.example .env.local
```

4. Execute o projeto:
```bash
npm run dev
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Gera build de produção
- `npm run start` - Executa build de produção
- `npm run lint` - Executa linter
- `npm run deploy` - Deploy para produção

## 📱 Funcionalidades

### ✅ Implementado
- Landing page responsiva
- Sistema de autenticação com Supabase
- Blog com SEO otimizado
- Editor de fluxogramas
- Sistema de propostas comerciais
- Dashboard administrativo
- Páginas de captura de leads
- Analytics e tracking

### 🔐 Autenticação
- Login/registro com Supabase
- Proteção de rotas
- Middleware de autenticação
- Persistência de sessão

### 📊 Analytics
- Tracking de eventos
- Métricas de conversão
- Pixel de rastreamento
- Webhooks para integração

## 🌐 Deploy

O projeto está configurado para deploy na Vercel:

```bash
npm run deploy
```

## 📚 Documentação

Consulte a pasta `docs/` para documentação detalhada sobre:
- Sistema de autenticação
- Sistema de propostas
- Deploy e configuração
- Melhorias implementadas

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e proprietário da AtendeSoft.

---

**AtendeSoft** - Automação Comercial, Apps e Dashboards com IA
