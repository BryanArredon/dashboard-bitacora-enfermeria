# ⚛️ Hoja de Ruta Maestra: Integración del Dashboard (Next.js)

### 🌍 FASE 1: Configuración de Variables de Entorno
El frontend necesita saber en qué direcciones de red (URLs) viven tus otros microservicios en la nube o en localhost.
- [ ] **Crear archivo local:** Crear o actualizar el archivo [.env.local] en la raíz del proyecto.
- [ ] **Definir URL de Seguridad (Java):** Agregar variable `AUTH_API_URL=http://localhost:8085/api/auth` (o el puerto que uses).
- [ ] **Definir URL de la Bitácora (Python):** Agregar variable `BACKEND_API_URL=http://localhost:5000/api` (o el puerto de Flask).

### 🔐 FASE 2: Conexión Real del Login (vs Auth-Service)
Dejar de usar el inicio de sesión simulado y validar contra la base de datos de Java.
- [ ] **Petición HTTP a Java:** En [src/app/actions.ts]([loginUsuario]), reemplazar el código simulado por un `fetch(AUTH_API_URL + '/login')` enviando el `email` y `password`.
- [ ] **Manejo de Errores:** Si Java responde `401` o `403` (Contraseña incorrecta, Bloqueado o Validación MFA requerida), devolver ese error a la pantalla de React para que el usuario sepa por qué no entó.
- [ ] **Guardar el JWT Real:** Si Java responde `200 OK` con un JWT, inyectar ese string exacto en la cookie `auth-token` (en lugar del `dummy-token` actual).

### 🔌 FASE 3: Conexión Real de Datos (vs Backend-Bitacora)
Dejar de usar el arreglo temporal `globalBitacoras` en RAM y consumir la verdadera base de datos de PostgreSQL vía Flask.
- [ ] **Leer Registros (GET):** En [obtenerBitacoras()], hacer un `fetch` hacia el backend de Python (`BACKEND_API_URL/bitacora`). 
- [ ] **Inyectar el Token (Autorización):** En el `fetch` anterior, es **vital** sacar el JWT de los `cookies()` de Next.js y mandarlo en los `headers: { 'Authorization': 'Bearer ' + token }` para que el `@token_required` de Python te deje pasar.
- [ ] **Crear Registros (POST):** En [guardarBitacora()], hacer un `fetch(..., {method: 'POST'})` a Python enviando el JSON de los signos vitales, igualmente inyectando el JWT en la cabecera.

### 🛡️ FASE 4: Refinamiento de la Sesión y MFA (Opcional Futuro)
Mejoras de experiencia de usuario basándonos en las reglas de hospital.
- [ ] **Cierre de Sesión:** Asegurarse de que logoutUsuario() además de borrar la cookie en el navegador web, le avise a Java (endpoint `/logout`) para que meta el token a la lista negra.
- [ ] **Flujo de MFA en Interfaz:** Crear una pantalla a la que Next.js te redirija si Java contesta "Requiere Auth de 2 Pasos" durante el login, para que el usuario pueda escribir sus 6 dígitos del correo.
