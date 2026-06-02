# Innova

## Manual de despliegue

## Requisitos

Docker
Docker Compose

## Levantar aplicación

Ubicarse en la raíz del proyecto y ejecutar:

docker compose up --build -d

La aplicación quedará disponible en:

http://IP_SERVIDOR

## Actualizar versión

docker compose down
docker compose up --build -d

## Ver logs

docker logs angular-app

## Detener aplicación

docker compose down