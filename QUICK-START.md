# 🚀 Guía Rápida de Despliegue - Braniela en GitHub Pages

## ⚡ 5 Minutos para Desplegar

### Requisitos Previos

```bash
# Verificar Node.js 20.x o superior
node --version  # Debe ser v20.x.x o superior

# Si necesitas actualizar:
# macOS: brew install node@20
# Windows: https://nodejs.org/
# Linux: sudo apt-get install nodejs=20.x
```

### Paso 1: Preparar Repositorio (1 min)

```bash
# Descomprime el ZIP
unzip braniela-github-pages-working.zip
cd braniela-github-pages

# Inicializa Git
git init
git add .
git commit -m "Initial commit: Braniela perfumery website"
git branch -M main
```

### Paso 2: Crear Repositorio en GitHub (1 min)

1. Ve a https://github.com/new
2. **Nombre**: `braniela`
3. **Visibilidad**: Public
4. Click "Create repository"

### Paso 3: Conectar y Subir (1 min)

```bash
# Conectar con GitHub
git remote add origin https://github.com/tu-usuario/braniela.git
git push -u origin main
```

### Paso 4: Compilar y Desplegar (2 min)

```bash
# Instalar dependencias
pnpm install

# Compilar
pnpm build

# Crear rama gh-pages
git checkout --orphan gh-pages
git rm -rf .
cp -r dist/public/* .
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

### Paso 5: Configurar GitHub Pages (30 seg)

1. Ve a tu repositorio en GitHub
2. **Settings** → **Pages**
3. **Source**: Branch `gh-pages` / Folder `root`
4. Click "Save"

### ✅ ¡Listo!

Tu sitio estará disponible en: **`https://tu-usuario.github.io/braniela`**

---

## 🔄 Actualizar en el Futuro

```bash
# Usar el script automático
./deploy.sh

# O manualmente:
pnpm build
git checkout gh-pages
cp -r dist/public/* .
git add .
git commit -m "Update: [descripción]"
git push origin gh-pages
git checkout main
```

---

## 🐛 Si Algo Falla

### Error: "No existe carpeta client"
✅ **Ya está incluida** - La estructura es correcta

### Error: "Vite no puede resolver"
✅ **Ya está arreglado** - `client/src/` está en el lugar correcto

### Error: "Node.js 18 incompatible"
✅ **Usa Node.js 20.x** - Vite 7.3.2 lo requiere

### Error: "404 Not Found"
1. Verifica que `index.html` esté en la raíz de `gh-pages`
2. Limpia el cache del navegador: `Ctrl+Shift+Del`
3. Espera 5 minutos para que se propague

---

## 📋 Estructura del Proyecto

```
braniela-github-pages/
├── client/                    # Código fuente
│   ├── index.html            # Archivo principal
│   └── src/                  # Código React
├── dist/public/              # Build compilado (generado)
├── package.json              # Dependencias
├── pnpm-lock.yaml            # Lock file
├── vite.config.ts            # Configuración Vite
├── deploy.sh                 # Script de despliegue
├── DEPLOYMENT-MANUAL.md      # Guía completa
└── README.md                 # Documentación
```

---

## 🎯 Características Incluidas

- ✅ Catálogo de productos elegante
- ✅ Gestión de clientes y facturas
- ✅ Planes de pago con interés
- ✅ Integración WhatsApp
- ✅ Diseño premium dorado/negro
- ✅ Responsive y optimizado
- ✅ Compilado y listo

---

## 📞 Soporte

Si tienes problemas:
1. Lee `DEPLOYMENT-MANUAL.md` para guía completa
2. Verifica que `index.html` esté en `gh-pages`
3. Limpia cache del navegador
4. Abre un issue en GitHub

---

**¡Tu sitio estará en línea en menos de 5 minutos!** 🎉
