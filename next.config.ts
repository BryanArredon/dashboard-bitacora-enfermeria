import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Configuración para que funcione con el backend
  env: {
    NEXT_PUBLIC_AUTH_SERVICE_URL: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:8080',
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000',
  },
};

export default nextConfig;
