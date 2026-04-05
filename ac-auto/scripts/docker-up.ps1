# Запуск из корня репозитория (рядом с docker-compose.yml).
# Отключает Compose Bake — обходит ошибку x-docker-expose-session-sharedkey на части сборок Windows + кириллический путь.
$ErrorActionPreference = "Stop"
Set-Location (Split-Path -Parent $PSScriptRoot)
$env:COMPOSE_BAKE = "false"
docker compose up --build @args
