@echo off
chcp 65001 >nul
title AFRONEXIA - Iniciar
cd /d "%~dp0"
if not exist backend\node_modules ( echo Primero ejecuta 2-instalar-dependencias.bat & pause & exit /b 1 )
if not exist frontend\node_modules ( echo Primero ejecuta 2-instalar-dependencias.bat & pause & exit /b 1 )

echo Iniciando el backend (puerto 5000)...
start "AFRONEXIA - Backend (no cerrar)" cmd /k "cd /d "%~dp0backend" && npm run dev"
timeout /t 4 /nobreak >nul

echo Iniciando el frontend (puerto 3000)...
start "AFRONEXIA - Frontend (no cerrar)" cmd /k "cd /d "%~dp0frontend" && npm run dev"
timeout /t 6 /nobreak >nul

start "" http://localhost:3000
echo.
echo AFRONEXIA esta abierto en http://localhost:3000
echo Para apagarlo, cierra las dos ventanas "Backend" y "Frontend".
echo Usuarios de prueba: admin@afronexia.com / chava@gastronomia.com  (clave: Afronexia2026*)
timeout /t 8 >nul
