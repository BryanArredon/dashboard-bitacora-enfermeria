# 💻 Dashboard Bitácora - Frontend Next.js

Plataforma visual y responsiva desarrollada en **Next.js 16 (App Router)** y **React 19** enfocada en el personal de enfermería. Provee una interfaz moderna, animada ("glassmorphism") y fluida para interactuar con los microservicios del ecosistema (Auth y Nursing Backend).

## 🚀 Tecnologías

* **Next.js 16** (App Router)
* **React 19**
* **Tailwind CSS 4** (Estilizado Moderno y Diseño Responsivo)
* **Framer Motion** (Micro-interacciones y animaciones Fluidas)
* **Lucide React** (Iconografía limpia y escalable)
* **TypeScript** (Tipado fuerte)

---

## ⚙️ Variables de Entorno

El Dashboard consume credenciales para saber a dónde enviar sus peticiones Peticiones AJAX hacia el backend. Copia el archivo `.env.example` y crea un `.env.local`:

```env
# .env.local
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:8080/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000/api
```

*(Nota: Estas rutas apuntan de manera predeterminada a los microservicios cuando se ejecutan localmente en los puertos 8080 y 5000 respectivamente).*

---

## 💻 Instalación y Ejecución Local

1. Asegúrate de tener **Node.js** (v18+) instalado en tu máquina.
2. Posiciónate sobre el directorio del dashboard.
3. Instala los paquetes y librerías modernas (framer-motion, lucide, etc.):
   ```bash
   npm install
   ```
4. Inicia el servidor de desarrollo **basado en Webpack** *(Next.js v16 usa Turbopack por defecto pero puede generar conflictos en arquitecturas Apple Silicon; webpack garantiza estabilidad local en este ecosistema)*:
   ```bash
   npm run dev
   ```

Abre tu navegador web en [http://localhost:3000](http://localhost:3000) para ver la aplicación web inmersiva en funcionamiento.

---

## 📂 Arquitectura Interna del Componente (`src/app/src`)

El proyecto implementa interfaces basadas en fragmentos reutilizables y limpios en la subcarpeta `src/app/src/`:

- **`components/ui/`**: Componentes visuales genéricos, aislados y estilizados con vidrio animado (ej: `button.tsx`, `input.tsx`).
- **`lib/`**: Utilidades (ej. `utils.ts` mediante `clsx` y `tailwind-merge` para control condicional de diseño).
- **`page.tsx`**: Pantalla inicial de autenticación (Login) con integraciones completas del tema oscuro premium.
