#!/bin/bash

# Script para desplegar Braniela a GitHub Pages
# Uso: ./deploy.sh

set -e

echo "🚀 Iniciando deploy a GitHub Pages..."

# Verificar que estamos en un repositorio git
if [ ! -d .git ]; then
  echo "❌ Error: No estamos en un repositorio Git"
  exit 1
fi

# Instalar dependencias si es necesario
if [ ! -d node_modules ]; then
  echo "📦 Instalando dependencias..."
  pnpm install
fi

# Hacer build
echo "🔨 Compilando proyecto..."
pnpm run build

# Verificar que el build fue exitoso
if [ ! -d dist/public ]; then
  echo "❌ Error: El build no generó la carpeta dist/public"
  exit 1
fi

# Verificar que index.html existe
if [ ! -f dist/public/index.html ]; then
  echo "❌ Error: No se encontró dist/public/index.html"
  exit 1
fi

echo "✅ Build completado exitosamente"
echo "📁 Archivos en dist/public:"
ls -lh dist/public/ | head -20

# Instrucciones para push
echo ""
echo "📝 Pasos siguientes:"
echo "1. Asegúrate de tener GitHub Pages configurado en tu repositorio"
echo "2. Ejecuta los siguientes comandos:"
echo ""
echo "   git add ."
echo "   git commit -m 'Deploy Braniela POS/ERP system'"
echo "   git push origin main"
echo ""
echo "3. GitHub Actions se ejecutará automáticamente"
echo "4. Verifica el estado en: https://github.com/tu-usuario/braniela/actions"
echo ""
echo "✨ Tu sitio estará disponible en GitHub Pages en unos minutos"
