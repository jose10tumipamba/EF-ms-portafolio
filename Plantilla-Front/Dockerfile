# Usamos nginx como servidor web
FROM nginx:alpine

# Eliminar config por defecto
RUN rm -rf /usr/share/nginx/html/*

# Copiar archivos estáticos
COPY . /usr/share/nginx/html

# Exponer puerto
EXPOSE 80

