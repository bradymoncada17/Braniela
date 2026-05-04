# Configuración de GitHub Pages para Braniela

## Pasos para desplegar en GitHub Pages

### 1. Crear un repositorio en GitHub
```bash
# Si aún no tienes un repositorio
git init
git remote add origin https://github.com/tu-usuario/braniela.git
git branch -M main
```

### 2. Configurar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Haz clic en **Settings** (Configuración)
3. En el menú lateral, selecciona **Pages**
4. En la sección "Build and deployment":
   - **Source**: Selecciona "GitHub Actions"
   - El workflow se ejecutará automáticamente en cada push

### 3. Push del código

```bash
git add .
git commit -m "Initial commit with POS/ERP system"
git push -u origin main
```

### 4. Verificar el deploy

1. Ve a la pestaña **Actions** en tu repositorio
2. Verifica que el workflow "Deploy to GitHub Pages" se ejecute correctamente
3. Una vez completado, tu sitio estará disponible en:
   - `https://tu-usuario.github.io/braniela/` (si el repo es privado)
   - O la URL que GitHub Pages te asigne

## Archivos importantes

- `.github/workflows/deploy.yml` - Workflow automático de GitHub Actions
- `vite.config.ts` - Configuración de build (salida en `dist/public/`)
- `package.json` - Scripts de build y desarrollo

## Solución de problemas

### Si el sitio no carga:
1. Verifica que el workflow se ejecutó sin errores en la pestaña Actions
2. Asegúrate de que la rama `gh-pages` fue creada automáticamente
3. En Settings > Pages, verifica que la fuente sea "GitHub Actions"

### Si falta el index.html:
- El archivo se genera automáticamente en `dist/public/index.html` durante el build
- Verifica que el build se completó correctamente en el workflow

## Variables de entorno

Para que Firebase funcione correctamente, necesitas agregar las variables de entorno en GitHub:

1. Ve a Settings > Secrets and variables > Actions
2. Agrega las siguientes variables:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

## Desarrollo local

```bash
# Instalar dependencias
pnpm install

# Ejecutar servidor de desarrollo
pnpm run dev

# Hacer build para producción
pnpm run build

# Preview del build
pnpm run preview
```
