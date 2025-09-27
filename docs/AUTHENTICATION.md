# Sistema de Autenticação - AtendeSoft

Este projeto agora inclui um sistema completo de autenticação usando Supabase.

## 🚀 Configuração

### 1. Configurar Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Crie um novo projeto
4. Vá em **Settings > API**
5. Copie a **URL do projeto** e a **chave anônima**

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_projeto
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
```

### 3. Configurar Autenticação no Supabase

1. No painel do Supabase, vá em **Authentication > Settings**
2. Configure as **Site URL** para `http://localhost:3000` (desenvolvimento)
3. Configure as **Redirect URLs** para incluir:
   - `http://localhost:3000/auth/callback`
   - `https://seudominio.com/auth/callback`

## 📱 Funcionalidades

### ✅ Implementado

- **Login/Registro**: Página completa com validação
- **Proteção de Rotas**: Middleware automático
- **Dashboard**: Interface administrativa
- **Logout**: Funcionalidade completa
- **Persistência**: Sessão mantida entre recarregamentos
- **Responsivo**: Funciona em mobile e desktop

### 🔐 Páginas Protegidas

- `/dashboard` - Dashboard principal (requer login)

### 🌐 Páginas Públicas

- `/` - Landing page
- `/login` - Página de login/registro
- `/links` - Página de links
- Outras páginas existentes

## 🎯 Como Usar

### Para Usuários

1. Acesse `/login`
2. Crie uma conta ou faça login
3. Será redirecionado automaticamente para o dashboard
4. Use o botão "Sair" para logout

### Para Desenvolvedores

```typescript
// Usar o contexto de autenticação
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
  const { user, signOut, loading } = useAuth()
  
  if (loading) return <div>Carregando...</div>
  if (!user) return <div>Não logado</div>
  
  return <div>Bem-vindo, {user.email}!</div>
}
```

### Proteger uma Página

```typescript
import ProtectedRoute from '@/components/ProtectedRoute'

export default function MinhaPagina() {
  return (
    <ProtectedRoute>
      <div>Conteúdo protegido</div>
    </ProtectedRoute>
  )
}
```

## 🛠️ Estrutura de Arquivos

```
src/
├── contexts/
│   └── AuthContext.tsx          # Contexto de autenticação
├── components/
│   └── ProtectedRoute.tsx       # Componente de proteção
├── lib/
│   ├── supabase.ts              # Cliente Supabase
│   ├── supabase-server.ts       # Cliente servidor
│   └── supabase-middleware.ts   # Middleware de autenticação
pages/
├── login.tsx                    # Página de login
├── dashboard.tsx                # Dashboard protegido
└── _app.tsx                     # Provider de autenticação
middleware.ts                    # Middleware principal
```

## 🔧 Personalização

### Modificar Redirecionamentos

Edite `src/lib/supabase-middleware.ts`:

```typescript
// Alterar página de login
url.pathname = '/sua-pagina-login'
```

### Adicionar Campos ao Registro

Edite `pages/login.tsx` e adicione campos extras no `signUp`:

```typescript
const { error } = await signUp(email, password, {
  data: {
    nome: 'João Silva',
    empresa: 'Minha Empresa'
  }
})
```

### Customizar Dashboard

Edite `pages/dashboard.tsx` para adicionar suas funcionalidades específicas.

## 🚨 Troubleshooting

### Erro: "Invalid API key"

- Verifique se as variáveis de ambiente estão corretas
- Confirme se a chave anônima está correta no Supabase

### Erro: "Invalid redirect URL"

- Configure as URLs de redirecionamento no Supabase
- Verifique se a URL está exatamente como configurada

### Página não carrega após login

- Verifique o console do navegador
- Confirme se o middleware está funcionando
- Teste em modo incógnito

## 📞 Suporte

Para dúvidas sobre a implementação, consulte:
- [Documentação do Supabase](https://supabase.com/docs)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [Supabase Auth Helpers](https://github.com/supabase/auth-helpers)

---

**Desenvolvido para AtendeSoft** 🚀
