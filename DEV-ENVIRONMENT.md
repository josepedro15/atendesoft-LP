# 🚀 Ambiente de Desenvolvimento - Editor de Fluxogramas

## 📋 Visão Geral

Este ambiente permite desenvolver e testar edições do editor de fluxogramas antes de fazer commit para a branch principal.

## 🌟 Funcionalidades

- ✅ **Branch de desenvolvimento** separada (`dev-editor-fixes`)
- ✅ **Hot reload** automático
- ✅ **Commit automático** de mudanças
- ✅ **Push automático** para branch de dev
- ✅ **Página de teste** (`/test-edit`)
- ✅ **Logs detalhados** para debug

## 🎯 Como Usar

### 1. Iniciar Ambiente de Desenvolvimento

```bash
# Opção 1: Ambiente completo (Next.js + Monitor)
npm run dev:hot

# Opção 2: Apenas monitor de arquivos
npm run dev:watch

# Opção 3: Apenas Next.js
npm run dev
```

### 2. Comandos Rápidos

```bash
# Fazer commit manual
npm run dev:commit

# Fazer push para dev
npm run dev:push

# Commit + Push
npm run dev:deploy
```

### 3. Páginas de Teste

- **Editor principal**: `http://localhost:3000/fluxogramas/editor`
- **Página de teste**: `http://localhost:3000/test-edit`
- **Lista de fluxogramas**: `http://localhost:3000/fluxogramas`

## 🔧 Estrutura do Ambiente

```
dev-editor-fixes/          # Branch de desenvolvimento
├── src/components/flowchart/  # Componentes do editor
├── pages/fluxogramas/        # Páginas do editor
├── pages/api/flowcharts/     # APIs do editor
├── dev-simple.js            # Script de monitoramento
├── dev-watch.sh             # Script de monitoramento (Linux)
└── test-node-edit.jsx       # Componente de teste
```

## 📊 Monitoramento Automático

O ambiente monitora automaticamente mudanças em:
- `src/components/flowchart/`
- `pages/fluxogramas/`
- `pages/api/flowcharts/`

Quando detecta mudanças:
1. ⏱️ Aguarda 2 segundos (debounce)
2. 📝 Faz commit automático
3. 📊 Mostra logs detalhados

## 🐛 Debug

### Logs Disponíveis

- `✏️ Botão de editar clicado` - Clique no lápis
- `🎨 Botão de cor clicado` - Clique na paleta
- `📝 Input mudou para:` - Digitação no campo
- `🔥 CALLBACK onLabelChange chamado` - Salvamento do nome
- `💾 Salvando fluxograma com nodes:` - Salvamento no banco

### Console do Navegador

1. Abra F12
2. Vá para Console
3. Clique nos botões de edição
4. Verifique os logs

## 🚀 Deploy para Produção

Quando estiver satisfeito com as mudanças:

```bash
# 1. Voltar para main
git checkout main

# 2. Fazer merge da dev
git merge dev-editor-fixes

# 3. Push para produção
git push origin main

# 4. Deploy
npm run deploy
```

## 🧪 Testes

### Teste Básico
1. Acesse `/test-edit`
2. Clique nos botões de edição
3. Verifique se funciona

### Teste Completo
1. Acesse `/fluxogramas/editor`
2. Selecione um nó
3. Clique no lápis (editar nome)
4. Clique na paleta (mudar cor)
5. Verifique logs no console

## 📝 Comandos Úteis

```bash
# Ver status do git
git status

# Ver logs recentes
git log --oneline -5

# Ver diferenças
git diff

# Resetar mudanças
git reset --hard HEAD

# Voltar para main
git checkout main
```

## ⚠️ Importante

- **NUNCA** faça commit direto na `main`
- **SEMPRE** teste na branch `dev-editor-fixes` primeiro
- **SEMPRE** verifique os logs antes de fazer push
- **SEMPRE** teste a funcionalidade antes de mergear

## 🆘 Problemas Comuns

### Botões não aparecem
- Verifique se está na branch `dev-editor-fixes`
- Recarregue a página
- Verifique console para erros

### Edição não funciona
- Abra console (F12)
- Verifique logs de debug
- Teste em `/test-edit` primeiro

### Commit não funciona
- Verifique se há mudanças: `git status`
- Verifique se está na branch correta: `git branch`
