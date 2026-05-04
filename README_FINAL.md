# 🌹 Braniela - Perfumería de Lujo

Proyecto React profesional completo con gestión de productos, clientes, ventas, facturas y planes de pago integrados con Firebase y Firestore.

## ✨ Características Principales

### 👥 Para Clientes (Público)
- ✅ Catálogo elegante de 28+ perfumes de lujo
- ✅ Filtrado por categorías (Amaderados, Cítricos, Orientales, Florales, Gourmand)
- ✅ Detalles completos de cada producto
- ✅ Solicitud de cotización por WhatsApp
- ✅ Formulario de datos de envío
- ✅ Diseño responsive y premium

### 👨‍💼 Para Administradores (Dashboard)
- ✅ Gestión completa de productos
- ✅ Gestión de clientes
- ✅ Creación de ventas manuales
- ✅ Generación de facturas profesionales
- ✅ Planes de pago con interés configurable
- ✅ Historial de ventas y clientes
- ✅ Análisis de datos

## 🎨 Diseño y Estilo

- **Paleta de Colores**: Dorado (#B8860B), Negro (#000000), Blanco
- **Tipografía**: Cormorant Garamond (títulos) + Lato (cuerpo)
- **Framework UI**: Tailwind CSS 4 + shadcn/ui
- **Animaciones**: Framer Motion para transiciones suaves
- **Responsive**: Optimizado para móvil, tablet y desktop

## 🛠️ Stack Tecnológico

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Build Tool**: Vite 7
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **State Management**: React Context
- **Routing**: Wouter

## 📦 Instalación y Desarrollo

### Requisitos
- Node.js 20.x o superior
- pnpm (recomendado) o npm

### Pasos

```bash
# 1. Instalar dependencias
pnpm install

# 2. Iniciar servidor de desarrollo
pnpm dev

# 3. Abrir en el navegador
# http://localhost:3000

# 4. Compilar para producción
pnpm build

# 5. Vista previa del build
pnpm preview
```

## 🔐 Credenciales Admin

Para acceder al dashboard administrativo:

- **Email**: `admin@braniela.com`
- **Password**: `admin123`

⚠️ **Importante**: Cambia la contraseña después de la primera vez

## 📁 Estructura del Proyecto

```
braniela/
├── client/
│   ├── public/              # Archivos estáticos
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   │   ├── ui/         # Componentes shadcn/ui
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── ProductDetailModal.tsx
│   │   │   ├── CheckoutFlow.tsx
│   │   │   ├── InvoiceGenerator.tsx
│   │   │   ├── PaymentPlanGenerator.tsx
│   │   │   ├── SalesModule.tsx
│   │   │   ├── ClientManager.tsx
│   │   │   └── ... más componentes
│   │   ├── contexts/        # React Contexts
│   │   │   ├── FirebaseContext.tsx
│   │   │   ├── ProductContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── pages/          # Páginas principales
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   └── NotFound.tsx
│   │   ├── lib/            # Utilidades
│   │   │   ├── firebase.ts
│   │   │   └── utils.ts
│   │   ├── data/           # Datos estáticos
│   │   │   └── products.ts
│   │   ├── App.tsx         # Componente principal
│   │   ├── main.tsx        # Punto de entrada
│   │   └── index.css       # Estilos globales
│   └── index.html          # HTML principal
├── server/                  # Código del servidor (placeholder)
├── shared/                  # Código compartido
├── package.json            # Dependencias
├── pnpm-lock.yaml          # Lock file
├── vite.config.ts          # Configuración de Vite
├── tsconfig.json           # Configuración de TypeScript
├── FIREBASE_SETUP_GUIDE.md # Guía de Firebase
└── README_FINAL.md         # Este archivo
```

## 🔥 Configuración de Firebase

### Credenciales Actuales

El proyecto ya tiene Firebase configurado con el proyecto `braniela-4215f`:

```
apiKey: AIzaSyDtNPjSEFAxLjuhsZaFbYmZgMuM8gyeyQ8
authDomain: braniela-4215f.firebaseapp.com
projectId: braniela-4215f
storageBucket: braniela-4215f.firebasestorage.app
messagingSenderId: 607325821508
appId: 1:607325821508:web:240cd7747253a31295fa11
```

### Colecciones de Firestore Requeridas

1. **products** - Catálogo de productos
2. **clients** - Gestión de clientes
3. **sales** - Registro de ventas
4. **paymentPlans** - Planes de pago
5. **categories** - Categorías de productos

**Ver `FIREBASE_SETUP_GUIDE.md` para detalles completos**

## 📊 Funcionalidades Detalladas

### Catálogo de Productos
- 28+ perfumes de lujo internacionales
- Filtrado por categoría
- Detalles completos (marca, volumen, notas olfativas)
- Precios en pesos colombianos
- Imágenes de productos

### Gestión de Clientes (Admin)
- Crear, editar, eliminar clientes
- Historial de compras
- Deuda total
- Contacto directo

### Gestión de Ventas (Admin)
- Crear ventas manuales
- Seleccionar cliente y productos
- Configurar cantidad y precio
- Aplicar impuestos (IVA)
- Seleccionar método de pago

### Facturas
- Generación automática de facturas
- Información del cliente
- Detalles de productos
- Subtotal, impuestos y total
- Exportable como PDF

### Planes de Pago (Admin)
- Crear planes de pago con interés
- Configurar número de cuotas
- Cálculo automático de cuotas
- Cronograma de pagos
- Estado de cada cuota (pendiente, pagada, vencida)

### Integración WhatsApp
- Botón de contacto directo
- Envío de cotizaciones por WhatsApp
- Número: +57 300 123 4567

## 🚀 Despliegue

### En Manus (Recomendado)
El proyecto está configurado para desplegar en Manus con:
- Servidor de desarrollo incluido
- Hot reload automático
- Compilación optimizada
- Hosting incluido

### En GitHub Pages
Ver `GITHUB_PAGES_SETUP.md` para instrucciones

### En Vercel/Netlify
```bash
# Compilar
pnpm build

# Los archivos compilados están en dist/public
```

## 📱 Responsive Design

- ✅ Mobile-first approach
- ✅ Breakpoints: sm, md, lg, xl, 2xl
- ✅ Optimizado para pantallas pequeñas
- ✅ Navegación adaptativa
- ✅ Tablas responsivas

## 🔒 Seguridad

- ✅ Autenticación con Firebase
- ✅ Reglas de Firestore para proteger datos
- ✅ Solo admins pueden crear/editar/eliminar
- ✅ Datos de clientes protegidos
- ✅ Contraseñas encriptadas

## 🐛 Solución de Problemas

### "No se carga el catálogo"
- Verifica que la colección `products` exista en Firestore
- Verifica que tenga al menos un producto

### "Error al iniciar sesión"
- Verifica que el usuario `admin@braniela.com` exista en Firebase Auth
- Verifica la contraseña

### "No se pueden crear productos"
- Verifica que hayas iniciado sesión como admin
- Verifica las reglas de Firestore

### "Error de CORS"
- Las credenciales de Firebase ya están configuradas
- No necesitas cambiar nada

## 📞 Contacto

- **WhatsApp**: +57 300 123 4567
- **Email**: info@braniela.com
- **Ubicación**: Antioquia, Colombia

## 📄 Licencia

MIT

## 🎯 Próximos Pasos

1. Verifica que Firebase y Firestore estén configurados correctamente
2. Crea los usuarios admin en Firebase Auth
3. Agrega los productos a Firestore
4. Prueba el dashboard administrativo
5. Despliega en tu servidor preferido

---

**Proyecto desarrollado con ❤️ para Braniela - Perfumería de Lujo**

Para más información, consulta:
- `FIREBASE_SETUP_GUIDE.md` - Configuración de Firebase
- `GITHUB_PAGES_SETUP.md` - Despliegue en GitHub Pages
- `vite.config.ts` - Configuración de Vite
