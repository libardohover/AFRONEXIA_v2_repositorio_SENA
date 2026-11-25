# Cómo subir el repositorio AFRONEXIA a GitHub

El proyecto ya es un repositorio Git con su historial (versión 1.0.0 y 2.0.0).

## 1. Requisitos
- Cuenta en https://github.com
- Git para Windows: https://git-scm.com/download/win (en la instalación deja las opciones por defecto).

## 2. Crea el repositorio vacío en GitHub
1. Entra a GitHub → botón **New** (o https://github.com/new).
2. Nombre: `afronexia` · Descripción: *Sistema de información con IA para la promoción cultural y turística afrodescendiente de Barrancabermeja*.
3. Elige **Public** (o Private si tu instructor lo pide).
4. **No** marques «Add a README», ni .gitignore, ni licencia (el proyecto ya los trae).
5. Clic en **Create repository** y copia la dirección que aparece, por ejemplo `https://github.com/libardohover/AFRONEXIA_v2_repositorio_SENA.git`.

## 3. Súbelo desde tu computador
Abre CMD en la carpeta del proyecto (la que contiene `README.md`):

```
cd "C:\Users\Usuario\SISTEMA AFRONEXIA"
git config --global user.name "Tu Nombre"
git config --global user.email "tu_correo@ejemplo.com"
git remote add origin https://github.com/libardohover/AFRONEXIA_v2_repositorio_SENA.git
git push -u origin main --tags
```

La primera vez se abrirá una ventana para iniciar sesión en GitHub. Al terminar, recarga la página del repositorio: verás el código, el README y las etiquetas `v1.0.0` y `v2.0.0`.

> El archivo `backend/.env` (con tu contraseña de PostgreSQL) **no** se sube: está excluido en `.gitignore`.

## 4. Para entregar al SENA
Comparte el enlace `https://github.com/libardohover/AFRONEXIA_v2_repositorio_SENA`. Si el repositorio es privado, agrega a tu instructor en **Settings → Collaborators**.

## 5. Cambios posteriores
```
git add .
git commit -m "Describe aquí el cambio"
git push
```
