# Etapa de construcción (Build)
FROM node:20-alpine AS build
WORKDIR /app

# Copiar dependencias primero para aprovechar el caché de Docker
COPY package*.json ./
RUN npm install

# Copiar el resto del código fuente y construir la aplicación
COPY . .
RUN npm run build

# Etapa de producción (Flask Backend)
FROM python:3.11-slim
WORKDIR /app

# Instalar dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar los archivos estáticos compilados en la etapa de construcción al directorio esperado por Flask
COPY --from=build /app/dist /app/dist

# Copiar la aplicación de Flask
COPY app.py .

# Exponer el puerto 8080
EXPOSE 8080

# Iniciar la aplicación
CMD ["python", "app.py"]
