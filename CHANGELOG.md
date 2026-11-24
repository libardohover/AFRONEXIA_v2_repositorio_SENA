# Historial de versiones

## [2.0.0] – 2026-11-24
### Agregado
- Agente virtual **NEXIA v2**: recuperación sobre el catálogo (RAG), detección de intenciones, itinerarios con horario, memoria de conversación, proveedores OpenAI / Anthropic / modo local, calificación 👍/👎, voz (dictado y lectura).
- Módulo de reservas de experiencias con control de cupo.
- Guía del emprendedor: pestaña «¿Qué escribo aquí?» en cada campo + guía paso a paso imprimible (`docs/`).
- Panel administrativo con métricas reales, gestión de contenido, reservas, usuarios y auditoría.
- Mapa interactivo (Leaflet) de todos los lugares.
- Scripts de instalación y arranque para Windows (`1-…`, `2-…`, `3-….bat`).
- Panel del gestor cultural (contenido y reservas).
- Pruebas de humo de la API (`npm run test:api`, 30 casos).
- Documentación del proyecto, manual de usuario y manual técnico en `docs/`.

### Cambiado
- Catálogo (lugares, eventos, emprendimientos, saberes, rutas, experiencias) migrado de datos fijos en el frontend a PostgreSQL, con respaldo local.
- Esquema de base de datos unificado e idempotente (`database/init.sql`), que migra la BD v1.

### Seguridad
- Las reservas (datos personales de visitantes) solo las ven el administrador y el gestor cultural.
- Contraseñas con bcrypt, sesiones JWT, control de roles en el servidor, límite de intentos de login, helmet y CORS configurable.
- Se bloquea el auto-registro como administrador.

### Corregido
- Login que no verificaba la contraseña.
- Registro de emprendedor que fallaba por la columna `titular` inexistente.
- Error de hooks en el panel administrativo y estadísticas con cifras inventadas.

## [1.0.0] – 2026-09-04
- Primera versión: interfaz de 8 módulos, backend Express con CRUD básico y asistente IA inicial.
