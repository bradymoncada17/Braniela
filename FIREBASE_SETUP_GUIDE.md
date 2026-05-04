# Guía de Configuración de Firebase y Firestore para Braniela

## 🔧 Configuración Actual

El proyecto ya tiene Firebase configurado con:

**Proyecto Firebase**: `braniela-4215f`

**Credenciales (en `client/src/lib/firebase.ts`):**
```
apiKey: AIzaSyDtNPjSEFAxLjuhsZaFbYmZgMuM8gyeyQ8
authDomain: braniela-4215f.firebaseapp.com
projectId: braniela-4215f
storageBucket: braniela-4215f.firebasestorage.app
messagingSenderId: 607325821508
appId: 1:607325821508:web:240cd7747253a31295fa11
measurementId: G-QFNEJB3SVR
```

## 📋 Colecciones de Firestore Requeridas

El proyecto usa las siguientes colecciones en Firestore:

### 1. **products** - Catálogo de Productos
```json
{
  "id": "string",
  "name": "string",
  "brand": "string",
  "category": "string",
  "price": "number",
  "stock": "number",
  "volume": "string",
  "description": "string",
  "image": "string",
  "fragranceNotes": ["string"],
  "createdAt": "timestamp"
}
```

### 2. **clients** - Gestión de Clientes
```json
{
  "id": "string",
  "name": "string",
  "phone": "string",
  "email": "string (opcional)",
  "totalPurchases": "number",
  "totalDebt": "number",
  "createdAt": "timestamp"
}
```

### 3. **sales** - Registro de Ventas
```json
{
  "id": "string",
  "clientId": "string",
  "items": [
    {
      "productId": "string",
      "name": "string",
      "quantity": "number",
      "price": "number"
    }
  ],
  "subtotal": "number",
  "tax": "number",
  "total": "number",
  "includeIVA": "boolean",
  "paymentMethod": "string",
  "createdAt": "timestamp"
}
```

### 4. **paymentPlans** - Planes de Pago
```json
{
  "id": "string",
  "saleId": "string",
  "clientId": "string",
  "total": "number",
  "installments": "number",
  "monthlyPayment": "number",
  "interest": "number",
  "payments": [
    {
      "number": "number",
      "amount": "number",
      "dueDate": "timestamp",
      "status": "pending|paid|overdue"
    }
  ],
  "createdAt": "timestamp"
}
```

### 5. **categories** - Categorías de Productos
```json
{
  "id": "string",
  "name": "string"
}
```

## 🔐 Reglas de Seguridad de Firestore

Copia estas reglas en Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Permitir lectura pública de productos
    match /products/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Permitir lectura pública de categorías
    match /categories/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Datos privados - solo para usuarios autenticados
    match /clients/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    match /sales/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    match /paymentPlans/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 👤 Crear Usuario Admin

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona el proyecto `braniela-4215f`
3. Ve a **Authentication** → **Users**
4. Haz clic en **Add User**
5. Crea un usuario con:
   - **Email**: `admin@braniela.com`
   - **Password**: `admin123`

## ✅ Verificar Configuración

Para verificar que todo está correcto:

1. **Abre la aplicación** en modo desarrollo
2. **Haz clic en "Dashboard"** en la esquina superior derecha
3. **Ingresa con**: `admin@braniela.com` / `admin123`
4. Si ves el dashboard, Firebase está configurado correctamente

## 🚀 Despliegue en Producción

Cuando despliegues en GitHub Pages o cualquier servidor:

1. Las credenciales de Firebase ya están en el código (son públicas, es normal)
2. Las reglas de Firestore protegen los datos privados
3. Solo usuarios autenticados pueden crear/editar/eliminar datos

## 📱 Funcionalidades por Rol

### Cliente (Público)
- Ver productos
- Ver detalles del producto
- Solicitar cotización por WhatsApp

### Administrador (Login requerido)
- Gestionar productos
- Gestionar clientes
- Crear ventas
- Generar facturas
- Crear planes de pago
- Ver historial de ventas

## 🔗 Enlaces Útiles

- [Firebase Console](https://console.firebase.google.com/)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

## ❓ Solución de Problemas

### "Error: Firebase is not initialized"
- Verifica que `client/src/lib/firebase.ts` tenga las credenciales correctas

### "Permission denied" al crear productos
- Verifica que hayas iniciado sesión como admin
- Verifica las reglas de Firestore en Firebase Console

### "No se carga el catálogo"
- Verifica que la colección `products` exista en Firestore
- Verifica que tenga al menos un producto

---

**Nota**: El proyecto está completamente funcional. Solo necesitas verificar que las colecciones existan en Firestore.
