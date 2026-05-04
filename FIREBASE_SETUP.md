# Configuración de Firebase para GitHub Pages

## Paso 1: Crear Proyecto en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto llamado "Braniela"
3. Habilita Google Analytics (opcional)
4. Espera a que se cree el proyecto

## Paso 2: Configurar Firestore Database

1. En Firebase Console, ve a **Firestore Database**
2. Haz clic en **Create Database**
3. Selecciona **Start in test mode** (para desarrollo)
4. Elige la región más cercana a ti
5. Haz clic en **Create**

## Paso 3: Configurar Reglas de Seguridad

En Firestore, ve a la pestaña **Rules** y reemplaza el contenido con:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura pública de productos y categorías
    match /products/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    match /categories/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Clientes, ventas y planes de pago solo para usuarios autenticados
    match /clients/{document=**} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }
    
    match /sales/{document=**} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }
    
    match /paymentPlans/{document=**} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

Haz clic en **Publish**

## Paso 4: Configurar Authentication

1. Ve a **Authentication** en Firebase Console
2. Haz clic en **Get started**
3. Selecciona **Email/Password**
4. Habilita **Email/Password**
5. Haz clic en **Save**

## Paso 5: Crear Usuario Admin

1. Ve a la pestaña **Users** en Authentication
2. Haz clic en **Add user**
3. Email: `admin@braniela.com`
4. Contraseña: `admin123` (cámbiala después)
5. Haz clic en **Add user**

## Paso 6: Configurar Claims Personalizados

Para que el usuario sea admin, necesitas ejecutar este código en Firebase Cloud Functions o usar la CLI:

```bash
firebase functions:config:set admin.email="admin@braniela.com"
```

O usa esta función en Cloud Functions:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.setAdminClaim = functions.https.onCall(async (data, context) => {
  const uid = data.uid;
  await admin.auth().setCustomUserClaims(uid, { admin: true });
  return { message: 'Admin claim set' };
});
```

## Paso 7: Obtener Configuración de Firebase

1. Ve a **Project Settings** (ícono de engranaje)
2. Selecciona tu app web
3. Copia la configuración de Firebase
4. Reemplaza la configuración en `client/src/lib/firebase.ts`

## Paso 8: Desplegar en GitHub Pages

```bash
git add .
git commit -m "Configure Firebase for GitHub Pages"
git push origin main
```

GitHub Actions compilará y desplegará automáticamente.

## Verificación

1. Abre https://bradymoncada17.github.io/Braniela/
2. Ve a `/login`
3. Ingresa: `admin@braniela.com` / `admin123`
4. Deberías ver el dashboard administrativo

## Solución de Problemas

### "Error: Permission denied"
- Verifica que las reglas de Firestore estén correctamente publicadas
- Asegúrate de que el usuario tenga el claim `admin: true`

### "Error: CORS"
- Firebase maneja CORS automáticamente
- Verifica que el dominio esté en la lista de dominios autorizados

### "Error: Firestore not initialized"
- Verifica que la configuración de Firebase sea correcta
- Comprueba que Firestore Database esté creada

## Notas Importantes

- **Test Mode**: Las reglas actuales permiten lectura pública pero solo escritura para admins
- **Producción**: Antes de ir a producción, cambia a modo más restrictivo
- **Datos**: Los datos se guardan en Firestore y se sincronizan en tiempo real
- **Offline**: La app funciona offline con caché local de Firestore
