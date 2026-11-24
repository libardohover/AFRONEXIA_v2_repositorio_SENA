@echo off
chcp 65001 >nul
title AFRONEXIA - Instalar dependencias
cd /d "%~dp0"
echo ============================================================
echo   AFRONEXIA - Paso 2: instalar dependencias
echo ============================================================
where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js no esta instalado. Descargalo de https://nodejs.org (version LTS^).
  pause
  exit /b 1
)
for /f %%V in ('node -v') do echo Node.js %%V

echo.
echo Instalando backend...
pushd backend
call npm install --no-audit --no-fund
if errorlevel 1 ( popd & echo [ERROR] Fallo npm install del backend & pause & exit /b 1 )
if not exist .env copy .env.example .env >nul
popd

echo.
echo Instalando frontend...
pushd frontend
call npm install --no-audit --no-fund
if errorlevel 1 ( popd & echo [ERROR] Fallo npm install del frontend & pause & exit /b 1 )
if not exist .env copy .env.example .env >nul
popd

echo.
echo ============================================================
echo   Dependencias instaladas. Ahora ejecuta 3-iniciar-afronexia.bat
echo ============================================================
pause
