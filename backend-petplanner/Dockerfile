# ----------------------------
# Etapa 1: Build de dependencias y TypeScript
# ----------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Instala dependencias
COPY package*.json ./
RUN npm install

# Copia el código fuente
COPY . .

# Compila TypeScript a JavaScript
RUN npm run build


# ----------------------------
# Etapa 2: Imagen final para producción
# ----------------------------
FROM node:20-alpine

WORKDIR /app

# Solo dependencias necesarias en producción
COPY package*.json ./
RUN npm install --only=production

# Copia los archivos compilados desde la etapa builder
COPY --from=builder /app/dist ./dist

# También copiar cualquier archivo necesario para configuración
COPY --from=builder /app/.env .env
COPY --from=builder /app/node_modules ./node_modules

# Asegúrate de incluir cualquier archivo relevante para TypeORM
# como migrations o configs ya compilados
COPY --from=builder /app/dist/common/config ./dist/common/config

# Ejecuta migraciones y luego inicia el servidor
CMD npm run migration:run:prod && npm run start:prod
