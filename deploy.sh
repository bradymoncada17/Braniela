#!/bin/bash

# Script de despliegue automático para GitHub Pages
# Uso: ./deploy.sh

set -e  # Salir si hay error

echo "🔨 Compilando proyecto..."
pnpm build

echo "📦 Cambiando a rama gh-pages..."
git checkout gh-pages

echo "📋 Copiando archivos compilados..."
cp -r dist/public/* .

echo "✅ Agregando cambios..."
git add .

echo "💾 Creando commit..."
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')" || echo "No hay cambios para commit"

echo "🚀 Enviando a GitHub..."
git push origin gh-pages

echo "🔄 Volviendo a rama main..."
git checkout main

echo ""
echo "✨ ¡Despliegue completado!"
echo "Tu sitio estará disponible en: https://tu-usuario.github.io/braniela"
echo ""
