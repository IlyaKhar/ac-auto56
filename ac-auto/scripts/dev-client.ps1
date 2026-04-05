# Запуск Vite из ac-auto\client (не из сайцт\client — там другого проекта нет).
$ErrorActionPreference = "Stop"
$repoRoot = Split-Path $PSScriptRoot -Parent
$clientDir = Join-Path $repoRoot "client"
Set-Location $clientDir
Write-Host "Каталог: $clientDir" -ForegroundColor Cyan
if (-not (Test-Path "node_modules")) {
  npm install
}
npm run dev
