-- 1. USUARIOS
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL CHECK (rol IN ('visitante', 'emprendedor', 'gestor_cultural', 'administrador')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. EMPRENDIMIENTOS
CREATE TABLE IF NOT EXISTS emprendimientos (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nombre VARCHAR(200) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    descripcion TEXT,
    ubicacion VARCHAR(255),
    telefono_contacto VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. CONTENIDOS CULTURALES
CREATE TABLE IF NOT EXISTS contenidos_culturales (
    id SERIAL PRIMARY KEY,
    autor_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo VARCHAR(200) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    contenido TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. EVENTOS
CREATE TABLE IF NOT EXISTS eventos (
    id SERIAL PRIMARY KEY,
    organizador_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    lugar VARCHAR(255) NOT NULL,
    fecha_inicio TIMESTAMP NOT NULL,
    fecha_fin TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. VALORACIONES
CREATE TABLE IF NOT EXISTS valoraciones (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    entidad_tipo VARCHAR(50) NOT NULL CHECK (entidad_tipo IN ('emprendimiento', 'evento', 'contenido')),
    entidad_id INT NOT NULL,
    puntuacion INT NOT NULL CHECK (puntuacion BETWEEN 1 AND 5),
    comentario TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. FAVORITOS
CREATE TABLE IF NOT EXISTS favoritos (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    entidad_tipo VARCHAR(50) NOT NULL CHECK (entidad_tipo IN ('emprendimiento', 'evento', 'contenido')),
    entidad_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, entidad_tipo, entidad_id)
);

-- 7. MENSAJES CONTACTO
CREATE TABLE IF NOT EXISTS mensajes_contacto (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    emprendimiento_id INT NOT NULL REFERENCES emprendimientos(id) ON DELETE CASCADE,
    mensaje TEXT NOT NULL,
    estado VARCHAR(30) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'leido', 'respondido')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. AUDITORIA
CREATE TABLE IF NOT EXISTS auditoria (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
    accion VARCHAR(255) NOT NULL,
    modulo VARCHAR(100) NOT NULL,
    detalles JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. AI INTERACTION LOGS
CREATE TABLE IF NOT EXISTS ai_interaction_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
    pregunta TEXT NOT NULL,
    respuesta TEXT NOT NULL,
    tokens_usados INT DEFAULT 0,
    calificacion INT CHECK (calificacion IN (1, -1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. OFERTAS CULTURALES (Almacenamiento compatible para IA)
CREATE TABLE IF NOT EXISTS ofertas_culturales (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    fuente_tipo VARCHAR(50) NOT NULL CHECK (fuente_tipo IN ('emprendimiento', 'evento', 'contenido')),
    fuente_id INT NOT NULL,
    texto_indexado TEXT NOT NULL,
    embedding TEXT, -- Compatible nativamente con Windows
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DATOS INICIALES DE PRUEBA
INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES
('Admin General', 'admin@afronexia.com', '$2b$10$hashadmin', 'administrador'),
('Doña Chava', 'chava@gastronomia.com', '$2b$10$hashemprendedor', 'emprendedor')
ON CONFLICT DO NOTHING;

INSERT INTO emprendimientos (usuario_id, nombre, categoria, descripcion, ubicacion, telefono_contacto) VALUES
(2, 'Pescado Frito Doña Chava', 'Gastronomía', 'Sancocho de bocachico y bagre frito con patacón y suero tradicional.', 'Paseo del Río, Barrancabermeja', '+573001234567')
ON CONFLICT DO NOTHING;