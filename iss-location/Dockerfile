FROM node:20-alpine

WORKDIR /app

# Copiar el archivo .env si existe
COPY .env ./

# Copiar dependencias
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm ci --production

# Copiar el código fuente
COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando de inicio
CMD ["npm", "start"]