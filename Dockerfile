# ── Imagen base ligera ────────────────────────────────────────────────────────
# node:20-alpine es ~6x más liviana que node:20 (~170 MB vs ~1 GB)
FROM node:20-alpine

# Directorio de trabajo
WORKDIR /app

# Copiamos package*.json primero para aprovechar el caché de capas de Docker:
# si el código fuente cambia pero las dependencias no, esta capa se reutiliza.
COPY package*.json ./

# Instalamos solo dependencias de producción
RUN npm ci --omit=dev

# Copiamos el código (capa separada para optimizar caché)
COPY app.js ./
COPY src/ ./src/

# Creamos directorio de logs para que Winston no falle al iniciar
RUN mkdir -p src/logs/errors

# Puerto expuesto
EXPOSE 8000

# Variables de entorno por defecto (sobreescribibles con -e)
ENV NODE_ENV=production
ENV PORT=8000
ENV LOG_LEVEL=info

# Inicio
CMD ["node", "app.js"]
