# Usa una imagen base con Python
FROM python:3.10

RUN apt-get update && apt-get install -y netcat-openbsd

# Configura el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el archivo de dependencias e instálalas
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia el código de la aplicación al contenedor
COPY . .

# Exponer el puerto de Daphne
EXPOSE 9000

# Ejecutar Daphne
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "core.asgi:application"]