# 🚀 Deploy para atendesoft.com

## Configuração do Domínio

### 1. **Variáveis de Ambiente**
Crie um arquivo `.env.local` com:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://vlayangmpcogxoolcksc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsYXlhbmdtcGNvZ3hvb2xja3NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NzEwMDIsImV4cCI6MjA2OTU0NzAwMn0.U4jxKlTf_eCX6zochG6wZPxRBvWk90erSNY_IEuYqrY
NEXT_PUBLIC_SITE_URL=https://atendesoft.com
```

### 2. **Scripts Disponíveis**
```bash
# Desenvolvimento local
npm run dev

# Desenvolvimento com domínio
npm run dev:domain

# Build para produção
npm run build

# Deploy para Vercel (produção)
npm run deploy

# Deploy preview
npm run deploy:preview
```

### 3. **Deploy no Vercel**

#### **Opção A: Deploy Automático**
```bash
npm run deploy
```

#### **Opção B: Deploy Manual**
1. Acesse [vercel.com](https://vercel.com)
2. Conecte o repositório GitHub
3. Configure o domínio `atendesoft.com`
4. Adicione as variáveis de ambiente
5. Deploy automático

### 4. **Configuração do Domínio**

#### **DNS Records**
```
A     @     76.76.19.61
CNAME www   cname.vercel-dns.com
```

#### **Vercel Domain Settings**
- Adicionar `atendesoft.com`
- Adicionar `www.atendesoft.com`
- Configurar redirects

### 5. **Verificações Pós-Deploy**

#### **URLs para Testar**
- ✅ `https://atendesoft.com` - Página principal
- ✅ `https://atendesoft.com/login` - Login
- ✅ `https://atendesoft.com/dashboard` - Dashboard (após login)
- ✅ `https://atendesoft.com/fluxogramas` - Módulo de fluxogramas

#### **Funcionalidades**
- ✅ Autenticação Supabase
- ✅ Módulo de fluxogramas
- ✅ Responsividade
- ✅ SEO e performance

### 6. **Troubleshooting**

#### **Problemas Comuns**
1. **404 em assets**: Verificar `assetPrefix` no `next.config.js`
2. **CORS errors**: Verificar configurações do Supabase
3. **Domain not found**: Verificar DNS records
4. **Build errors**: Verificar variáveis de ambiente

#### **Logs Úteis**
```bash
# Ver logs do Vercel
vercel logs

# Ver logs locais
npm run dev:domain
```

### 7. **Performance**

#### **Otimizações Implementadas**
- ✅ Compressão gzip
- ✅ Cache headers
- ✅ Image optimization
- ✅ Bundle optimization
- ✅ Security headers

#### **Métricas Esperadas**
- **Lighthouse Score**: 90+
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🎯 Status do Deploy

- ✅ **Configuração**: Completa
- ✅ **Build**: Funcionando
- ✅ **Domínio**: Configurado
- ✅ **SSL**: Automático (Vercel)
- ✅ **CDN**: Global (Vercel)

**Próximo passo**: Executar `npm run deploy` para fazer o deploy!
