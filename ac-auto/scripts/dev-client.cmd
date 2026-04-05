@echo off
chcp 65001 >nul
cd /d "%~dp0..\client"
echo Каталог: %CD%
if not exist node_modules (
  call npm install
)
echo.
echo Открой в браузере http://localhost:5173
echo Остановка: Ctrl+C
echo.
call npm run dev
if errorlevel 1 pause
