# SISTEMA AFRONEXIA v2

AFRONEXIA es un sistema de información con inteligencia artificial para la gestión, preservación y promoción turística de la memoria, la cultura y la economía de la población afrodescendiente de Barrancabermeja (Santander, Colombia).

Proyecto formativo del programa **Tecnólogo en Análisis y Desarrollo de Software** – SENA, Centro de Comercio.

| | |
|---|---|
| Aprendiz | Libardo Hover Bautista B. |
| Ficha | 2758307 |
| Instructores | Hugo Semanate Quiñonez – Alejandro Zabala |
| Centro de formación | SENA, Centro de Comercio |
| Repositorio | https://github.com/libardohover/AFRONEXIA_v2_repositorio_SENA |

Incluye 8 módulos: Explorador, Memoria, Agenda, Emprendimientos, Rutas, Experiencias, Asistente IA (NEXIA) y Panel administrativo. Además trae la **Guía del emprendedor**.

**Tecnologías:** React 18 + Vite · Node.js + Express · PostgreSQL · Leaflet/OpenStreetMap · OpenAI o Anthropic (opcional).

---

## Inicio rápido en Windows (3 clics)

Requisitos: [Node.js LTS](https://nodejs.org) y [PostgreSQL](https://www.postgresql.org/download/windows/) instalados.

1. **`1-configurar-base-datos.bat`**: pide la contraseña de `postgres`, crea la base `afronexia_db`, carga las tablas y los datos, y genera `backend/.env`.
2. **`2-instalar-dependencias.bat`**: instala las dependencias del backend y del frontend.
3. **`3-iniciar-afronexia.bat`**: abre el backend (puerto 5000) y el frontend (puerto 3000), y luego el navegador.

En Linux o macOS: cargar la base de datos como se indica abajo y ejecutar `./iniciar-linux-mac.sh`.

## Documentación (carpeta `docs/`)

| Archivo | Contenido |
|---|---|
| `AFRONEXIA_Documentacion_del_proyecto` (.pdf / .docx) | Problema, objetivos, requisitos RF/RNF, casos de uso, arquitectura, modelo de datos, NEXIA, pruebas y conclusiones |
| `AFRONEXIA_Manual_de_usuario` (.pdf / .docx) | Uso por rol, con capturas de pantalla |
| `AFRONEXIA_Manual_tecnico.pdf` | Instalación, configuración, API, NEXIA, seguridad, despliegue y mantenimiento |
| `GUIA_REGISTRO_EMPRENDIMIENTO` (.pdf / .md) | Guía paso a paso del formulario del emprendedor |
| `SUBIR_A_GITHUB.md` | Cómo publicar este repositorio |
| `capturas/` | Capturas de pantalla de los módulos |

## Estructura del repositorio

```
├── backend/            API REST (Express) + agente NEXIA
│   ├── src/config      conexión a BD y variables de entorno
│   ├── src/controllers lógica de cada recurso
│   ├── src/middleware  autenticación JWT, roles y errores
│   ├── src/routes      rutas /api/v1
│   ├── src/services    catálogo y agente NEXIA (services/nexia)
│   ├── scripts/        generación de seed.sql, .env y guía
│   └── test_crud.js    pruebas de humo de la API
├── frontend/           Interfaz React (Vite)
│   ├── src/views       un archivo por módulo
│   ├── src/components  chat NEXIA, campos guiados, mapas…
│   ├── src/data        catálogo de respaldo y textos de la guía
│   └── src/lib/api.js  cliente HTTP
├── database/           init.sql (esquema), seed.sql (datos), seed/catalogo.json
├── docs/               guía del emprendedor, guía para subir a GitHub
├── 1-…, 2-…, 3-….bat   instalación y arranque en Windows
├── CHANGELOG.md        historial de versiones
└── LICENSE             licencia MIT
```

---

## Instalación manual (cualquier sistema operativo)

Requisitos: Node.js 18 o superior y PostgreSQL 13 o superior.

```bash
# 1. Base de datos
createdb afronexia_db
psql -d afronexia_db -f database/init.sql     # esquema (idempotente; también migra la BD v1)
psql -d afronexia_db -f database/seed.sql     # datos de ejemplo + usuarios demo

# 2. Backend  (http://localhost:5000)
cd backend
cp .env.example .env        # ajusta DB_*, JWT_SECRET y (opcional) la clave de IA
npm install
npm run dev

# 3. Frontend (http://localhost:3000)
cd ../frontend
cp .env.example .env        # VITE_API_URL si el backend no está en localhost:5000
npm install
npm run dev
```

Para comprobar que todo funciona, ejecuta `cd backend && npm run test:api`. Corre 30 pruebas de humo: catálogo, roles, reservas y NEXIA.

**Usuarios demo** (contraseña `Afronexia2026*`; cámbienla antes de publicar):

| Rol | Correo |
|---|---|
| Administrador | admin@afronexia.com |
| Emprendedor | chava@gastronomia.com |
| Gestor cultural | emiro@cultura.org |
| Visitante | visitante@afronexia.com |

> El sistema sigue funcionando si la base de datos no responde. El catálogo y NEXIA pasan a usar `database/seed/catalogo.json`, y el frontend usa su copia local. En ese modo no se guardan registros nuevos ni reservas.

---

## Agente virtual NEXIA

Archivos: `backend/src/services/nexia/`

| Archivo | Qué hace |
|---|---|
| `conocimiento.js` | Recupera información del catálogo (RAG con BM25, sin dependencias externas). Normaliza tildes, reconoce sinónimos locales (comer → sancocho, bocachico…, río → ciénaga, lancha…) y quita duplicados. |
| `intenciones.js` | Detecta la intención: saludo, itinerario, eventos, rutas, experiencias, reserva, gastronomía, emprendimientos, memoria, lugares, precios y ayuda. También extrae parámetros del viaje: tarde, mañana, N horas, fin de semana, familia, presupuesto. |
| `itinerario.js` | Arma planes con hora para cada parada a partir de las rutas reales. Agrega el almuerzo cuando hace falta, recomienda experiencias y eventos dentro de las fechas y da consejos de viaje. |
| `local.js` | Responde sin API de IA usando datos reales. No inventa información y avisa cuando los eventos ya pasaron. |
| `proveedores.js` | Conecta con **OpenAI** o **Anthropic (Claude)**. Se elige con `IA_PROVIDER` en `.env`. Si falla, responde en modo local. |
| `index.js` | Orquesta la respuesta: memoria de conversación por sesión, prompt con reglas anti-invención, registro de cada interacción (RF-19) con intención, modo, fuentes y latencia. |

**Endpoints de IA** (`/api/v1/ia`):

- `POST /chat` recibe `{ mensaje, sessionId }` y devuelve `{ respuesta, tarjetas, itinerario, sugerencias, intencion, modo, logId }`.
- `POST /itinerario` genera un plan estructurado a partir de un texto.
- `POST /feedback` recibe `{ logId, calificacion: 1 | -1 }` (👍/👎).
- `POST /mejorar-descripcion` corresponde al botón «✨ Mejorar con IA» del emprendedor. Requiere sesión.
- `GET /estado` informa el proveedor activo y el tamaño de la base de conocimiento.

**En el frontend:**

- Chat flotante disponible en todos los módulos y vista completa del Asistente.
- Tarjetas con acciones: ver en el módulo, WhatsApp y cómo llegar.
- Itinerario en línea de tiempo y sugerencias rápidas.
- Calificación de respuestas, dictado por voz 🎙️ y lectura en voz alta 🔊 (Web Speech API, es-CO).
- Lo que se escribe en el buscador del inicio va directo a NEXIA.

---

## Guía del emprendedor (registro del emprendimiento)

- Cada casilla de los formularios de **registro** y de **publicación de producto** tiene la pestaña **«ⓘ ¿Qué escribo aquí?»**. Al abrirla muestra qué escribir, un ejemplo y qué evitar.
- La guía paso a paso completa está dentro del sistema en `#/guia-emprendedor`. Se puede imprimir o guardar en PDF.
- Hay copias en `docs/GUIA_REGISTRO_EMPRENDIMIENTO.md` y `docs/GUIA_REGISTRO_EMPRENDIMIENTO.pdf`.
- Todos los textos de ayuda salen de un solo archivo: `frontend/src/data/guiaEmprendimiento.json`. Si lo cambian, regeneren el documento con `cd backend && npm run docs:guia`.

---

## API principal (`/api/v1`)

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/salud` | público |
| POST | `/auth/register`, `/auth/login` · GET `/auth/me` | público / sesión |
| GET | `/catalogo`, `/catalogo/:entidad`, `/catalogo/:entidad/:id` | público |
| POST/PUT/DELETE | `/catalogo/:entidad[/:id]` | según rol (ver abajo) |
| POST | `/reservas` | público |
| GET/PATCH | `/reservas` | admin, gestor cultural |
| GET/POST | `/valoraciones`, `/favoritos`, `/mensajes` | sesión |
| GET | `/admin/stats`, `/usuarios`, `/auditoria`, `/ai-logs` | administrador |

Entidades: `lugares`, `eventos`, `emprendimientos`, `saberes`, `rutas`, `experiencias`.

Permisos de escritura:

- **Administrador:** todo.
- **Gestor cultural:** lugares, eventos, saberes, rutas y experiencias.
- **Emprendedor:** solo sus propios emprendimientos, además de experiencias.

---

## Cambios frente a la v1

**Seguridad**

- Contraseñas con bcrypt. Las cuentas v1 en texto plano se migran solas al iniciar sesión.
- Sesiones con JWT real y control de roles en el servidor.
- Nadie puede registrarse a sí mismo como administrador.
- Límite de intentos de login, helmet y CORS configurable.
- Se corrigió el login de la v1: no verificaba la contraseña y una ruta duplicada lo reemplazaba.

**Errores corregidos**

- El registro de emprendedor fallaba porque la columna `titular` no existía.
- El panel admin usaba hooks después de un `return`.
- Las estadísticas mostraban cifras inventadas cuando la base de datos estaba vacía.
- Los errores async podían tumbar el servidor.

**Datos**

- Los catálogos estaban fijos en el código de cada vista. Ahora están en PostgreSQL con nuevas tablas: `lugares`, `rutas`, `ruta_paradas`, `experiencias`, `reservas` y `ai_conversaciones`.
- Una sola fuente de datos de ejemplo: `database/seed/catalogo.json`. Para regenerar `seed.sql` usen `npm run db:seed-sql`.

**Funciones**

- Reservas reales con control de cupo por fecha.
- Publicaciones en borrador o publicadas.
- Mapa Leaflet con todos los lugares.
- La agenda distingue los eventos próximos de los ya realizados.
- Panel admin con métricas de NEXIA, auditoría, reservas y usuarios.
- Navegación con `#/modulo`: se pueden compartir enlaces y el botón «atrás» funciona.

**Pendiente de la comunidad**

- Los eventos de ejemplo son de agosto a octubre de 2026 y ya pasaron. Publiquen las nuevas fechas desde el Panel → Contenido → Eventos.
- Revisen las coordenadas y los teléfonos de ejemplo antes de lanzar.
