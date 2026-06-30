# Etapa de construcción (Build)
FROM node:20-alpine AS build
WORKDIR /app

# Copiar dependencias primero para aprovechar el caché de Docker
COPY package*.json ./
RUN npm install

# Copiar el resto del código fuente y construir la aplicación
COPY . .
RUN npm run build

# Etapa de producción (Producción)
# Utilizamos Nginx, que es el servidor web más usado en el mundo para servir archivos estáticos.
FROM nginx:alpine

# Copiar los archivos construidos desde la etapa anterior al directorio que Nginx utiliza para servir
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
