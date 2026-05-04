# Guía de Despliegue - Braniela en GitHub Pages

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Preparación del Repositorio](#preparación-del-repositorio)
3. [Despliegue Automático](#despliegue-automático)
4. [Despliegue Manual](#despliegue-manual)
5. [Verificación](#verificación)
6. [Solución de Problemas](#solución-de-problemas)

## 🔧 Requisitos Previos

- Cuenta de GitHub
- Git instalado en tu máquina
- Node.js 18+ instalado
- npm o yarn instalado

## 📁 Preparación del Repositorio

### Paso 1: Crear un nuevo repositorio en GitHub

1. Ve a [github.com/new](https://github.com/new)
2. Nombre del repositorio: `braniela` (o tu preferencia)
3. Descripción: "Perfumería de Lujo - Sitio Web"
4. Selecciona "Public" para que GitHub Pages funcione
5. Click en "Create repository"

### Paso 2: Inicializar Git localmente

```bash
cd /ruta/a/braniela-github-pages
git init
git add .
git commit -m "Initial commit: Braniela perfumery website"
git branch -M main
git remote add origin https://github.com/tu-usuario/braniela.git
git push -u origin main
```

### Paso 3: Configurar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Navega a **Settings** → **Pages**
3. En "Source", selecciona:
   - **Deploy from a branch** (para despliegue manual)
   - O **GitHub Actions** (para despliegue automático)
4. Si seleccionas "Deploy from a branch":
   - Branch: `gh-pages`
   - Folder: `/ (root)`
5. Click en "Save"

## 🚀 Despliegue Automático (Recomendado)

El archivo `.github/workflows/deploy.yml` ya está configurado.

### Cómo funciona:

1. Cada vez que hagas push a `main`, GitHub Actions:
   - Instala dependencias
   - Compila el proyecto
   - Despliega automáticamente a `gh-pages`

2. Tu sitio estará disponible en:
   ```
   https://tu-usuario.github.io/braniela
   ```

### Verificar estado del despliegue:

1. Ve a tu repositorio
2. Click en la pestaña **Actions**
3. Verás el historial de despliegues

## 📦 Despliegue Manual

Si prefieres controlar manualmente el despliegue:

### Paso 1: Compilar el proyecto

```bash
npm install
npm run build
```

Esto genera la carpeta `dist/public/` con los archivos compilados.

### Paso 2: Crear rama gh-pages

```bash
# Crear rama gh-pages si no existe
git checkout --orphan gh-pages

# Limpiar archivos de la rama anterior
git rm -rf .

# Copiar archivos compilados
cp -r dist/public/* .

# Agregar archivos
git add .

# Commit
git commit -m "Deploy to GitHub Pages"

# Push a gh-pages
git push origin gh-pages
```

### Paso 3: Volver a main

```bash
git checkout main
```

## ✅ Verificación

### 1. Verificar que el sitio está en línea

- Espera 1-2 minutos después del despliegue
- Ve a `https://tu-usuario.github.io/braniela`
- Deberías ver el sitio de Braniela

### 2. Verificar archivos principales

En la carpeta raíz del repositorio debes tener:

```
✓ index.html (archivo principal)
✓ assets/ (carpeta con CSS y JS compilados)
✓ logo.png (logo de Braniela)
✓ README.md (documentación)
✓ package.json (dependencias)
```

### 3. Verificar en GitHub Pages Settings

1. Ve a **Settings** → **Pages**
2. Verifica que muestre:
   - "Your site is live at https://tu-usuario.github.io/braniela"
   - Source: "Deploy from a branch" o "GitHub Actions"

## 🐛 Solución de Problemas

### Problema: "404 Not Found"

**Causa**: El archivo `index.html` no está en la raíz de `gh-pages`

**Solución**:
```bash
# Verificar que index.html existe
ls -la index.html

# Si no existe, copiar desde dist
cp dist/public/index.html .
git add index.html
git commit -m "Fix: Add index.html to gh-pages"
git push
```

### Problema: Assets no cargan (CSS/JS en blanco)

**Causa**: Rutas relativas incorrectas

**Solución**: 
1. Edita `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/braniela/',  // Agregar esta línea
  // ... resto de configuración
})
```

2. Recompila:
```bash
npm run build
```

3. Redeploy:
```bash
git add dist/
git commit -m "Fix: Update asset paths"
git push
```

### Problema: Cambios no se reflejan

**Causa**: Cache del navegador

**Solución**:
1. Limpia el cache: `Ctrl+Shift+Del` (Windows) o `Cmd+Shift+Del` (Mac)
2. Abre en incógnito/privado
3. Espera 5 minutos para que se propague

### Problema: GitHub Actions falla

**Verificar**:
1. Ve a **Actions** → último workflow
2. Revisa los logs de error
3. Asegúrate que `dist/public/` existe después de `npm run build`

## 📝 Mantenimiento

### Actualizar el sitio

```bash
# Hacer cambios locales
# ...

# Compilar
npm run build

# Commit y push
git add .
git commit -m "Update: [descripción de cambios]"
git push origin main

# GitHub Actions desplegará automáticamente
```

### Sincronizar con cambios principales

Si hiciste cambios en otra rama:

```bash
git checkout main
git pull origin main
npm run build
git add dist/
git commit -m "Sync with main branch"
git push
```

## 🔗 URLs Útiles

- **Sitio en vivo**: https://tu-usuario.github.io/braniela
- **Repositorio**: https://github.com/tu-usuario/braniela
- **GitHub Pages Docs**: https://docs.github.com/en/pages
- **Vite Docs**: https://vitejs.dev/

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs en GitHub Actions
2. Verifica que `index.html` esté en la raíz
3. Limpia el cache del navegador
4. Abre un issue en el repositorio

---

**Última actualización**: Mayo 2026
**Versión**: 1.0
