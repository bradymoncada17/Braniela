# Guía de Despliegue Manual en GitHub Pages - Braniela

Esta es la forma más simple y directa de desplegar tu sitio en GitHub Pages sin usar GitHub Actions.

## 📋 Requisitos

- Git instalado
- Node.js 18+ instalado
- pnpm instalado (`npm install -g pnpm`)
- Cuenta de GitHub

## 🚀 Pasos para Desplegar

### Paso 1: Crear Repositorio en GitHub

1. Ve a [github.com/new](https://github.com/new)
2. **Nombre**: `braniela` (o tu preferencia)
3. **Descripción**: "Perfumería de Lujo - Sitio Web"
4. **Visibilidad**: Selecciona **Public**
5. Click en "Create repository"

### Paso 2: Clonar y Configurar Localmente

```bash
# Descomprime el ZIP
unzip braniela-github-pages-complete-fixed.zip
cd braniela-github-pages

# Inicializar Git
git init
git add .
git commit -m "Initial commit: Braniela perfumery website"
git branch -M main
git remote add origin https://github.com/tu-usuario/braniela.git
git push -u origin main
```

### Paso 3: Compilar el Proyecto

```bash
# Instalar dependencias
pnpm install

# Compilar para producción
pnpm build
```

Esto genera la carpeta `dist/public/` con todos los archivos compilados.

### Paso 4: Crear Rama gh-pages

```bash
# Crear rama gh-pages vacía
git checkout --orphan gh-pages

# Limpiar archivos
git rm -rf .

# Copiar archivos compilados a la raíz
cp -r dist/public/* .

# Agregar archivos
git add .

# Commit
git commit -m "Deploy to GitHub Pages"

# Push a gh-pages
git push origin gh-pages
```

### Paso 5: Configurar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú izquierdo, click en **Pages**
4. En "Source", selecciona:
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
5. Click en "Save"

### Paso 6: Verificar Despliegue

- Espera 1-2 minutos
- Tu sitio estará disponible en: **`https://tu-usuario.github.io/braniela`**
- Deberías ver el mensaje: "Your site is live at..."

## ✅ Verificación

### Archivos en gh-pages

Verifica que en la rama `gh-pages` existan:

```
✓ index.html (en la raíz)
✓ assets/ (carpeta con CSS y JS)
✓ logo.png
✓ README.md
```

Para verificar:

```bash
git checkout gh-pages
ls -la
```

Deberías ver `index.html` en la raíz.

## 🔄 Actualizar el Sitio

Cada vez que hagas cambios:

```bash
# Volver a main
git checkout main

# Hacer cambios en los archivos
# ...

# Compilar
pnpm build

# Cambiar a gh-pages
git checkout gh-pages

# Copiar archivos compilados
cp -r ../dist/public/* .

# Commit y push
git add .
git commit -m "Update: [descripción de cambios]"
git push origin gh-pages

# Volver a main
git checkout main
```

## 🐛 Solución de Problemas

### Problema: "404 Not Found"

**Causa**: El archivo `index.html` no está en la raíz de `gh-pages`

**Verificar**:
```bash
git checkout gh-pages
ls -la index.html
```

**Solucionar**:
```bash
# Si no existe, copiar desde dist
cp ../dist/public/index.html .
git add index.html
git commit -m "Fix: Add index.html"
git push
```

### Problema: Assets no cargan (página en blanco)

**Causa**: Rutas de assets incorrectas

**Solucionar**:
1. Edita `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/braniela/',  // Agregar esta línea
  // ... resto de configuración
})
```

2. Recompila:
```bash
pnpm build
```

3. Redeploy:
```bash
git checkout gh-pages
cp -r ../dist/public/* .
git add .
git commit -m "Fix: Update asset paths"
git push
```

### Problema: Cambios no se reflejan

**Soluciones**:
1. Limpia el cache del navegador: `Ctrl+Shift+Del`
2. Abre en incógnito/privado
3. Espera 5 minutos para que se propague
4. Verifica que hayas hecho push a `gh-pages`

### Problema: Error "fatal: pathspec 'gh-pages' did not match any files"

**Causa**: La rama `gh-pages` no existe

**Solucionar**:
```bash
# Crear rama gh-pages desde main
git checkout -b gh-pages
git rm -rf .
cp -r dist/public/* .
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

## 📝 Script Automático (Opcional)

Crea un archivo `deploy.sh` para automatizar el proceso:

```bash
#!/bin/bash

# Compilar
pnpm build

# Cambiar a gh-pages
git checkout gh-pages

# Copiar archivos
cp -r ../dist/public/* .

# Commit y push
git add .
git commit -m "Deploy: $(date)"
git push origin gh-pages

# Volver a main
git checkout main

echo "✅ Despliegue completado"
```

Uso:
```bash
chmod +x deploy.sh
./deploy.sh
```

## 🔗 URLs Útiles

- **Sitio en vivo**: https://tu-usuario.github.io/braniela
- **Repositorio**: https://github.com/tu-usuario/braniela
- **GitHub Pages Docs**: https://docs.github.com/en/pages
- **Vite Docs**: https://vitejs.dev/

## 📞 Soporte

Si tienes problemas:

1. Verifica que `index.html` esté en la raíz de `gh-pages`
2. Limpia el cache del navegador
3. Espera 5 minutos para que se propague
4. Abre un issue en GitHub

---

**Última actualización**: Mayo 2026
**Versión**: 1.0
