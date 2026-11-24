-- =====================================================================
-- SISTEMA AFRONEXIA v2 - Esquema completo de base de datos (PostgreSQL 13+)
-- ---------------------------------------------------------------------
-- * Idempotente: se puede ejecutar sobre una base vacía o sobre la base
--   creada con la versión anterior (bd_general.sql / init.sql v1); en ese
--   caso agrega las columnas y tablas nuevas sin borrar datos.
-- * No requiere la extensión pgvector. Si la tienen instalada, ejecuten
--   además 02_pgvector_opcional.sql.
-- * Los datos de ejemplo se cargan después con seed.sql
--   (generado desde database/seed/catalogo.json).
-- =====================================================================

SET client_min_messages = warning;

-- 1. USUARIOS ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL CHECK (rol IN ('visitante', 'emprendedor', 'gestor_cultural', 'administrador')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS telefono VARCHAR(50);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS area_cultural VARCHAR(100);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT TRUE;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS ultimo_acceso TIMESTAMP;

-- 2. LUGARES (Módulo 1 - Explorador) ------------------------------------
CREATE TABLE IF NOT EXISTS lugares (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    descripcion TEXT,
    direccion VARCHAR(255),
    horario VARCHAR(150),
    telefono VARCHAR(100),
    imagen_url TEXT,
    lat NUMERIC(9,6),
    lng NUMERIC(9,6),
    estado VARCHAR(20) DEFAULT 'publicado' CHECK (estado IN ('publicado', 'borrador')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. EMPRENDIMIENTOS (Módulo 4) ----------------------------------------
CREATE TABLE IF NOT EXISTS emprendimientos (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
    nombre VARCHAR(200) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    descripcion TEXT,
    ubicacion VARCHAR(255),
    telefono_contacto VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE emprendimientos ALTER COLUMN usuario_id DROP NOT NULL;
ALTER TABLE emprendimientos ADD COLUMN IF NOT EXISTS titular VARCHAR(150);
ALTER TABLE emprendimientos ADD COLUMN IF NOT EXISTS redes_sociales VARCHAR(150);
ALTER TABLE emprendimientos ADD COLUMN IF NOT EXISTS email_contacto VARCHAR(150);
ALTER TABLE emprendimientos ADD COLUMN IF NOT EXISTS precio NUMERIC(12,0);
ALTER TABLE emprendimientos ADD COLUMN IF NOT EXISTS imagen_url TEXT;
ALTER TABLE emprendimientos ADD COLUMN IF NOT EXISTS lat NUMERIC(9,6);
ALTER TABLE emprendimientos ADD COLUMN IF NOT EXISTS lng NUMERIC(9,6);
ALTER TABLE emprendimientos ADD COLUMN IF NOT EXISTS estado VARCHAR(20) DEFAULT 'publicado';

-- 4. CONTENIDOS CULTURALES / SABERES (Módulo 2 - Memoria) ----------------
CREATE TABLE IF NOT EXISTS contenidos_culturales (
    id SERIAL PRIMARY KEY,
    autor_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
    titulo VARCHAR(200) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    contenido TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE contenidos_culturales ALTER COLUMN autor_id DROP NOT NULL;
ALTER TABLE contenidos_culturales ADD COLUMN IF NOT EXISTS subtitulo TEXT;
ALTER TABLE contenidos_culturales ADD COLUMN IF NOT EXISTS portador VARCHAR(150);
ALTER TABLE contenidos_culturales ADD COLUMN IF NOT EXISTS imagen_url TEXT;
ALTER TABLE contenidos_culturales ADD COLUMN IF NOT EXISTS estado VARCHAR(20) DEFAULT 'publicado';

-- 5. EVENTOS (Módulo 3 - Agenda) ---------------------------------------
CREATE TABLE IF NOT EXISTS eventos (
    id SERIAL PRIMARY KEY,
    organizador_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    lugar VARCHAR(255) NOT NULL,
    fecha_inicio TIMESTAMP NOT NULL,
    fecha_fin TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE eventos ALTER COLUMN organizador_id DROP NOT NULL;
ALTER TABLE eventos ADD COLUMN IF NOT EXISTS tipo VARCHAR(100) DEFAULT 'Evento cultural';
ALTER TABLE eventos ADD COLUMN IF NOT EXISTS organizador_nombre VARCHAR(200);
ALTER TABLE eventos ADD COLUMN IF NOT EXISTS imagen_url TEXT;
ALTER TABLE eventos ADD COLUMN IF NOT EXISTS lat NUMERIC(9,6);
ALTER TABLE eventos ADD COLUMN IF NOT EXISTS lng NUMERIC(9,6);
ALTER TABLE eventos ADD COLUMN IF NOT EXISTS estado VARCHAR(20) DEFAULT 'publicado';

-- 6. RUTAS Y PARADAS (Módulo 5) ----------------------------------------
CREATE TABLE IF NOT EXISTS rutas (
    id SERIAL PRIMARY KEY,
    etiqueta VARCHAR(50),
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    duracion VARCHAR(50),
    duracion_horas NUMERIC(4,1),
    dificultad VARCHAR(50),
    cupo VARCHAR(150),
    lat NUMERIC(9,6),
    lng NUMERIC(9,6),
    zoom INT DEFAULT 15,
    estado VARCHAR(20) DEFAULT 'publicado',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ruta_paradas (
    id SERIAL PRIMARY KEY,
    ruta_id INT NOT NULL REFERENCES rutas(id) ON DELETE CASCADE,
    orden INT NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    detalle TEXT,
    tiempo VARCHAR(50),
    minutos INT,
    UNIQUE (ruta_id, orden)
);

-- 7. EXPERIENCIAS Y RESERVAS (Módulo 6) --------------------------------
CREATE TABLE IF NOT EXISTS experiencias (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio NUMERIC(12,0),
    duracion VARCHAR(50),
    cupo_max INT,
    guia VARCHAR(150),
    lugar VARCHAR(200),
    emprendimiento_id INT REFERENCES emprendimientos(id) ON DELETE SET NULL,
    estado VARCHAR(20) DEFAULT 'publicado',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reservas (
    id SERIAL PRIMARY KEY,
    experiencia_id INT NOT NULL REFERENCES experiencias(id) ON DELETE CASCADE,
    usuario_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
    nombre_contacto VARCHAR(150) NOT NULL,
    email_contacto VARCHAR(150),
    telefono_contacto VARCHAR(50),
    fecha_deseada DATE NOT NULL,
    personas INT NOT NULL CHECK (personas > 0),
    comentario TEXT,
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'cancelada')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. VALORACIONES Y FAVORITOS -----------------------------------------
CREATE TABLE IF NOT EXISTS valoraciones (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    entidad_tipo VARCHAR(50) NOT NULL,
    entidad_id INT NOT NULL,
    puntuacion INT NOT NULL CHECK (puntuacion BETWEEN 1 AND 5),
    comentario TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE valoraciones DROP CONSTRAINT IF EXISTS valoraciones_entidad_tipo_check;
ALTER TABLE valoraciones ADD CONSTRAINT valoraciones_entidad_tipo_check
    CHECK (entidad_tipo IN ('emprendimiento', 'evento', 'contenido', 'lugar', 'ruta', 'experiencia'));

CREATE TABLE IF NOT EXISTS favoritos (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    entidad_tipo VARCHAR(50) NOT NULL,
    entidad_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, entidad_tipo, entidad_id)
);
ALTER TABLE favoritos DROP CONSTRAINT IF EXISTS favoritos_entidad_tipo_check;
ALTER TABLE favoritos ADD CONSTRAINT favoritos_entidad_tipo_check
    CHECK (entidad_tipo IN ('emprendimiento', 'evento', 'contenido', 'lugar', 'ruta', 'experiencia'));

-- 9. MENSAJES DE CONTACTO ----------------------------------------------
CREATE TABLE IF NOT EXISTS mensajes_contacto (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    emprendimiento_id INT NOT NULL REFERENCES emprendimientos(id) ON DELETE CASCADE,
    mensaje TEXT NOT NULL,
    estado VARCHAR(30) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'leido', 'respondido')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. AUDITORÍA (RF-20) ------------------------------------------------
CREATE TABLE IF NOT EXISTS auditoria (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
    accion VARCHAR(255) NOT NULL,
    modulo VARCHAR(100) NOT NULL,
    detalles JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. AGENTE NEXIA: registros de interacción (RF-19) --------------------
CREATE TABLE IF NOT EXISTS ai_interaction_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
    pregunta TEXT NOT NULL,
    respuesta TEXT NOT NULL,
    tokens_usados INT DEFAULT 0,
    calificacion INT CHECK (calificacion IN (1, -1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE ai_interaction_logs ADD COLUMN IF NOT EXISTS session_id VARCHAR(64);
ALTER TABLE ai_interaction_logs ADD COLUMN IF NOT EXISTS intencion VARCHAR(50);
ALTER TABLE ai_interaction_logs ADD COLUMN IF NOT EXISTS modo VARCHAR(30);
ALTER TABLE ai_interaction_logs ADD COLUMN IF NOT EXISTS fuentes JSONB;
ALTER TABLE ai_interaction_logs ADD COLUMN IF NOT EXISTS latencia_ms INT;
ALTER TABLE ai_interaction_logs ADD COLUMN IF NOT EXISTS comentario_feedback TEXT;

-- 12. AGENTE NEXIA: memoria de conversación ------------------------------
CREATE TABLE IF NOT EXISTS ai_conversaciones (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(64) NOT NULL,
    user_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('user', 'assistant')),
    contenido TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. OFERTAS CULTURALES (índice de conocimiento del agente) -------------
CREATE TABLE IF NOT EXISTS ofertas_culturales (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    fuente_tipo VARCHAR(50) NOT NULL,
    fuente_id INT NOT NULL,
    texto_indexado TEXT NOT NULL,
    embedding TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE ofertas_culturales DROP CONSTRAINT IF EXISTS ofertas_culturales_fuente_tipo_check;

-- ÍNDICES ---------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_eventos_fecha ON eventos (fecha_inicio);
CREATE INDEX IF NOT EXISTS idx_emprendimientos_categoria ON emprendimientos (categoria);
CREATE INDEX IF NOT EXISTS idx_lugares_categoria ON lugares (categoria);
CREATE INDEX IF NOT EXISTS idx_reservas_experiencia ON reservas (experiencia_id);
CREATE INDEX IF NOT EXISTS idx_ai_conv_session ON ai_conversaciones (session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_ai_logs_created ON ai_interaction_logs (created_at);
CREATE INDEX IF NOT EXISTS idx_auditoria_created ON auditoria (created_at);
