@echo off
chcp 65001 >nul
title AFRONEXIA - Configurar base de datos
cd /d "%~dp0"
echo ============================================================
echo   AFRONEXIA - Paso 1: crear y cargar la base de datos
echo ============================================================
echo.

rem --- Buscar psql (PostgreSQL instalado en Program Files) ---
set "PSQL="
where psql >nul 2>nul && set "PSQL=psql"
if not defined PSQL (
  for /d %%D in ("C:\Program Files\PostgreSQL\*") do (
    if exist "%%D\bin\psql.exe" set "PSQL=%%D\bin\psql.exe"
  )
)
if not defined PSQL (
  echo [ERROR] No se encontro PostgreSQL. Instalalo desde https://www.postgresql.org/download/windows/
  pause
  exit /b 1
)
echo PostgreSQL encontrado: %PSQL%
echo.

set /p "PGPASSWORD=Escribe la contrasena del usuario postgres y presiona Enter: "
set "PGCLIENTENCODING=UTF8"

"%PSQL%" -U postgres -h localhost -c "SELECT 1" >nul 2>nul
if errorlevel 1 (
  echo.
  echo [ERROR] No fue posible conectar: contrasena incorrecta o PostgreSQL apagado.
  echo Revisa el Manual tecnico, seccion "Problemas frecuentes".
  pause
  exit /b 1
)

"%PSQL%" -U postgres -h localhost -tAc "SELECT 1 FROM pg_database WHERE datname='afronexia_db'" | find "1" >nul
if errorlevel 1 (
  echo Creando la base de datos afronexia_db...
  "%PSQL%" -U postgres -h localhost -c "CREATE DATABASE afronexia_db"
) else (
  echo La base de datos afronexia_db ya existe: se actualizara sin borrar datos.
)

echo Creando tablas (init.sql)...
"%PSQL%" -U postgres -h localhost -d afronexia_db -q -v ON_ERROR_STOP=1 -f database\init.sql
if errorlevel 1 ( echo [ERROR] Fallo init.sql & pause & exit /b 1 )

echo Cargando datos de ejemplo (seed.sql)...
"%PSQL%" -U postgres -h localhost -d afronexia_db -q -v ON_ERROR_STOP=1 -f database\seed.sql >nul
if errorlevel 1 ( echo [ERROR] Fallo seed.sql & pause & exit /b 1 )

for /f %%N in ('""%PSQL%" -U postgres -h localhost -d afronexia_db -tAc "SELECT COUNT(*) FROM lugares""') do set "LUGARES=%%N"
echo Lugares cargados: %LUGARES%

where node >nul 2>nul
if errorlevel 1 (
  echo [AVISO] Node.js no esta instalado. Instalalo desde https://nodejs.org y luego ejecuta 2-instalar-dependencias.bat
) else (
  node backend\scripts\crear-env.js "%PGPASSWORD%"
)

echo.
echo ============================================================
echo   Base de datos lista. Ahora ejecuta 2-instalar-dependencias.bat
echo ============================================================
pause
