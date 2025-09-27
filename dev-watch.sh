#!/bin/bash

# Script de desenvolvimento para monitorar mudanças
# Uso: ./dev-watch.sh

echo "🚀 Iniciando ambiente de desenvolvimento..."
echo "📁 Monitorando mudanças em:"
echo "   - src/components/flowchart/"
echo "   - pages/fluxogramas/"
echo "   - pages/api/flowcharts/"
echo ""

# Função para fazer commit automático
auto_commit() {
    echo "📝 Mudanças detectadas, fazendo commit automático..."
    git add .
    git commit -m "dev: Auto-commit $(date '+%H:%M:%S') - Testando edições"
    echo "✅ Commit realizado: $(git log -1 --oneline)"
    echo ""
}

# Função para fazer push para branch de dev
push_to_dev() {
    echo "🚀 Fazendo push para branch de desenvolvimento..."
    git push origin dev-editor-fixes
    echo "✅ Push realizado para dev-editor-fixes"
    echo ""
}

# Monitorar mudanças nos arquivos específicos
echo "👀 Monitorando mudanças... (Ctrl+C para parar)"
echo ""

# Usar inotifywait se disponível, senão usar fswatch
if command -v inotifywait &> /dev/null; then
    inotifywait -m -r -e modify,create,delete \
        src/components/flowchart/ \
        pages/fluxogramas/ \
        pages/api/flowcharts/ \
        --format '%w%f %e' | while read file event; do
        echo "📁 Arquivo modificado: $file ($event)"
        auto_commit
    done
elif command -v fswatch &> /dev/null; then
    fswatch -o src/components/flowchart/ pages/fluxogramas/ pages/api/flowcharts/ | while read; do
        echo "📁 Mudanças detectadas"
        auto_commit
    done
else
    echo "❌ inotifywait ou fswatch não encontrado"
    echo "💡 Instale com: sudo apt-get install inotify-tools (Ubuntu/Debian)"
    echo "💡 Ou: brew install fswatch (macOS)"
    exit 1
fi
