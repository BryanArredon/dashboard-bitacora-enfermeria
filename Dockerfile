# 1. Stage: Build dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Instalar dependencias basadas en el gestor de paquetes que se encuentre
COPY package.json package-lock.json* ./
RUN npm ci

# 2. Stage: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables de entorno para el BUILD
ARG NEXT_PUBLIC_AUTH_SERVICE_URL
ARG NEXT_PUBLIC_BACKEND_URL

ENV NEXT_PUBLIC_AUTH_SERVICE_URL=$NEXT_PUBLIC_AUTH_SERVICE_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

# Desactivar telemetría de Next.js
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# 3. Stage: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos necesarios para el runtime
COPY --from=builder /app/public ./public

# Configurar permisos para Next.js
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copiar el output del build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
# set hostname to 0.0.0.0 for container access
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
