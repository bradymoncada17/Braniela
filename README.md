# Braniela - Perfumería de Lujo

Sitio web profesional de e-commerce para Braniela, perfumería de lujo con gestión de clientes, facturas y planes de pago.

## 🚀 Características

- **Catálogo de Productos**: Visualización elegante de perfumes con detalles, notas olfativas y precios
- **Gestión de Clientes**: Panel administrativo para gestionar clientes y su historial
- **Sistema de Facturas**: Generación automática de facturas y planes de pago
- **Integración WhatsApp**: Envío de cotizaciones y documentos directamente por WhatsApp
- **Diseño Premium**: Interfaz elegante con paleta dorado/negro del logo de Braniela
- **Responsive**: Optimizado para dispositivos móviles, tablets y desktop

## 📋 Requisitos

- Node.js 18+ 
- npm o yarn
- Git

## 🔧 Instalación Local

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/braniela.git
cd braniela
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crear archivo `.env.local` en la raíz del proyecto:
```
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

5. **Compilar para producción**
```bash
npm run build
```

## 📦 Despliegue en GitHub Pages

### Opción 1: Despliegue automático con GitHub Actions

1. Crear archivo `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist/public
```

2. Configurar GitHub Pages en Settings → Pages:
   - Source: GitHub Actions
   - Branch: main

### Opción 2: Despliegue manual

1. Compilar el proyecto:
```bash
npm run build
```

2. Copiar contenido de `dist/public/` a la rama `gh-pages`:
```bash
git checkout --orphan gh-pages
git rm -rf .
cp -r dist/public/* .
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

3. Configurar GitHub Pages en Settings → Pages:
   - Source: Deploy from a branch
   - Branch: gh-pages

## 🗂️ Estructura del Proyecto

```
braniela/
├── src/                      # Código fuente React
│   ├── components/          # Componentes reutilizables
│   ├── pages/              # Páginas principales
│   ├── contexts/           # Contextos de React
│   ├── hooks/              # Hooks personalizados
│   ├── lib/                # Utilidades y librerías
│   ├── data/               # Datos estáticos
│   └── App.tsx             # Componente principal
├── public/                  # Archivos estáticos
│   ├── logo.png            # Logo de Braniela
│   ├── favicon.ico         # Favicon
│   └── robots.txt          # Robots.txt
├── dist/public/            # Build compilado (generado)
│   ├── index.html          # HTML principal
│   └── assets/             # CSS y JS compilados
├── package.json            # Dependencias del proyecto
├── vite.config.ts          # Configuración de Vite
├── tsconfig.json           # Configuración de TypeScript
└── README.md               # Este archivo
```

## 🎨 Tecnologías Utilizadas

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Animaciones**: Framer Motion
- **Enrutamiento**: Wouter
- **Backend**: Firebase (Firestore + Auth)
- **Build Tool**: Vite
- **Package Manager**: npm/pnpm

## 🔐 Credenciales de Prueba (Desarrollo)

- **Email**: admin@braniela.com
- **Contraseña**: admin123

## 📞 Contacto

- **WhatsApp**: +57 304 1100640
- **Email**: info@braniela.com

## 📄 Licencia

Todos los derechos reservados © 2026 Braniela - Perfumería de Lujo

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Notas de Desarrollo

- El proyecto usa Vite para desarrollo rápido y builds optimizados
- Firebase se configura automáticamente desde variables de entorno
- Los estilos globales están en `src/index.css`
- Los componentes UI están en `src/components/ui/`
- Los datos de productos se sincronizan en tiempo real desde Firebase

## 🐛 Reporte de Bugs

Si encuentras un bug, por favor abre un issue en GitHub con:
- Descripción clara del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots si es relevante

---

**Desarrollado con ❤️ para Braniela - Perfumería de Lujo**
