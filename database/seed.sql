-- =====================================================================
-- AFRONEXIA - Datos de ejemplo (GENERADO por backend/scripts/generar-seed.js)
-- No editar a mano: modificar database/seed/catalogo.json y regenerar.
-- Usuarios demo: contraseña "Afronexia2026*" (cámbienla en producción).
-- =====================================================================

INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES
  ('Admin General', 'admin@afronexia.com', '$2a$10$r5dQcyV3fqughaq2Zt8a2.rCBYZQHVLgdJfrn3RLm2fvhM1Bd8MIm', 'administrador'),
  ('Doña Chava', 'chava@gastronomia.com', '$2a$10$r5dQcyV3fqughaq2Zt8a2.rCBYZQHVLgdJfrn3RLm2fvhM1Bd8MIm', 'emprendedor'),
  ('Don Emiro Mosquera', 'emiro@cultura.org', '$2a$10$r5dQcyV3fqughaq2Zt8a2.rCBYZQHVLgdJfrn3RLm2fvhM1Bd8MIm', 'gestor_cultural'),
  ('Visitante Demo', 'visitante@afronexia.com', '$2a$10$r5dQcyV3fqughaq2Zt8a2.rCBYZQHVLgdJfrn3RLm2fvhM1Bd8MIm', 'visitante')
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash WHERE usuarios.password_hash NOT LIKE '$2%' OR length(usuarios.password_hash) < 50;

INSERT INTO lugares (id, nombre, categoria, descripcion, direccion, horario, telefono, imagen_url, lat, lng) VALUES
  (1, 'Casa de la Cultura Piedra del Sol', 'Espacio cultural', 'Escenario de talleres de danza afro, percusión y formación artística para niños y jóvenes.', 'Calle 49 #9-30', 'Lun-Vie 8:00-18:00', '604 6021234', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80', 7.062, -73.851),
  (2, 'Ciénaga San Silvestre', 'Sitio natural', 'Humedal asociado a los saberes de pesca artesanal y a la medicina tradicional de plantas ribereñas.', 'Vía a San Silvestre', '6:00-17:00', 'Guías comunitarios', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80', 7.085, -73.82),
  (3, 'Comuna 7 – Territorio Tambó', 'Lugar histórico', 'Barrio de fuerte asentamiento afrodescendiente del Pacífico; cuna de agrupaciones de tambora tradicional.', 'Comuna 7', 'Recorridos guiados con reserva', 'Junta comunal', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80', 7.058, -73.842),
  (4, 'Malecón del Río Magdalena', 'Sitio natural', 'Corredor ribereño donde la comunidad celebra encuentros de tambor, cantos de boga y ferias de cocina afro.', 'Cra 1 con Calle 49', 'Abierto todos los días', 'Secretaría de Cultura', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80', 7.0653, -73.8547),
  (5, 'Mercado Central – Fogón Afro', 'Gastronomía', 'Pasillo de cocinas tradicionales donde se preparan arroz de coco, sancocho de bocachico y dulces de la costa.', 'Calle 52 #8-10', 'Mar-Dom 6:00-15:00', 'Asoc. Cocineras', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80', 7.064, -73.853),
  (6, 'Parque Infantil y Plaza del Tambor', 'Espacio cultural', 'Punto de encuentro para muestras de danza afro, peinados tradicionales y ferias artesanales.', 'Calle 50 con Cra 12', 'Abierto todos los días', 'Alcaldía de Barrancabermeja', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80', 7.067, -73.849),
  (7, 'Pescado Frito Doña Chava', 'Gastronomía', 'Sancocho de bocachico y bagre frito con patacón y suero tradicional.', 'Paseo del Río', 'Lunes a Domingo: 10am - 6pm', '+573001234567', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80', 7.0653, -73.8547),
  (8, 'Monumento al Cacique Pipatón', 'Lugar histórico', 'Sitio histórico de memoria ribereña.', 'Barrancabermeja', 'Abierto 24 horas', 'Secretaría de Cultura', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80', 7.072, -73.861)
ON CONFLICT (id) DO NOTHING;

INSERT INTO emprendimientos (id, usuario_id, nombre, titular, categoria, descripcion, ubicacion, telefono_contacto, redes_sociales, email_contacto, precio, imagen_url) VALUES
  (1, NULL, 'Artesanías Río Grande', 'Segundo Rentería', 'Artesanía', 'Cestería en fibras del río, tambores artesanales y accesorios inspirados en la iconografía afro.', 'Barrio Colombia', '573123456789', '@artesaniasriogrande', 'artesaniasriogrande@gmail.com', 45000, 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80'),
  (2, NULL, 'Ecoturismo Boga', 'Cooperativa de bogas', 'Turismo comunitario', 'Recorridos en lancha por la ciénaga con relatos de pesca artesanal y avistamiento de aves.', 'Ciénaga San Silvestre', '573109876543', '@ecoturismoboga', 'ecoturismoboga@gmail.com', 80000, 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80'),
  (3, NULL, 'Grupo Tambó del Magdalena Medio', 'Jhon Mosquera', 'Música tradicional', 'Agrupación de percusión y canto tradicional afro con talleres formativos de bullerengue.', 'Comuna 7', '573155557890', '@tambomagdalena', 'tambomagdalena@gmail.com', 60000, 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80'),
  (4, NULL, 'Sabores de Aminta', 'María Aminta Perea', 'Gastronomía', 'Cocina tradicional afro por encargo: arroz de coco, pusandao, cabeza de gato y dulces típicos.', 'Comuna 7', '573001234567', '@saboresdeaminta', 'saboresdeaminta@gmail.com', 28000, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80'),
  (5, NULL, 'Trenzas y Raíces', 'Yuranis Palacios', 'Estética ancestral', 'Peinados ancestrales, trenzado africano y accesorios étnicos de memoria viva.', 'Comuna 5', '573187654321', '@trenzasyraices', 'trenzasyraices@gmail.com', 50000, 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80'),
  (6, (SELECT id FROM usuarios WHERE email = 'chava@gastronomia.com'), 'Pescado Frito Doña Chava', 'Doña Chava', 'Gastronomía', 'Sancocho de bocachico y bagre frito con patacón y suero tradicional.', 'Paseo del Río', '573001234567', '@pescadodonachava', 'chava@gastronomia.com', 25000, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

INSERT INTO contenidos_culturales (id, autor_id, titulo, subtitulo, categoria, contenido, portador, imagen_url) VALUES
  (1, (SELECT id FROM usuarios WHERE email = 'emiro@cultura.org'), 'Arroz de coco: memoria del Pacífico en el río', 'Plato insignia que viajó con las familias afro hasta Barrancabermeja.', 'Gastronomía', 'El arroz de coco se prepara extrayendo la leche de coco, dorando el titoté y cocinando lentamente. Se acompaña con bocachico frito y patacón.', 'María Aminta Perea', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'),
  (2, (SELECT id FROM usuarios WHERE email = 'emiro@cultura.org'), 'El canto de boga en el Magdalena', 'Cantos de trabajo que acompañaban la navegación en canoa por el río.', 'Música', 'Los cantos de boga nacieron de remar contra la corriente, contando historias del río: crecientes, pescas y ausencias.', 'Don Emiro Mosquera', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80'),
  (3, (SELECT id FROM usuarios WHERE email = 'emiro@cultura.org'), 'El trenzado como mapa de libertad', 'Los peinados afro guardaron rutas de escape durante la esclavitud.', 'Oralidad', 'Las trenzas fueron cartografía: líneas para caminos y nudos para encuentros. Se enseña esta historia mientras se peina.', 'Yuranis Palacios', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80'),
  (4, (SELECT id FROM usuarios WHERE email = 'emiro@cultura.org'), 'La leyenda de la Madre de Agua', 'Relato sobre la protectora de las ciénagas que cuida la fauna fluvial.', 'Mitos y leyendas', 'Habita en la ciénaga San Silvestre protegiendo los peces y premiando a quienes pescan respetando el ciclo natural.', 'Sabedores de la ciénaga', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80'),
  (5, (SELECT id FROM usuarios WHERE email = 'emiro@cultura.org'), 'Medicina de patio: plantas que curan', 'Saberes sobre plantas medicinales cultivadas en azoteas.', 'Medicina tradicional', 'Matarratón, hierbabuena, sábila y altamisa cultivadas en huertas elevadas que funcionan como botiquín vivo.', 'Sabedora Rosalba Córdoba', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

INSERT INTO eventos (id, organizador_id, titulo, tipo, descripcion, lugar, fecha_inicio, organizador_nombre, imagen_url, lat, lng) VALUES
  (1, (SELECT id FROM usuarios WHERE email = 'emiro@cultura.org'), 'Taller de Danza Afro y Percusión para Jóvenes', 'Taller Formativo', 'Formación comunitaria en bullerengue, mapalé y currulao dirigida a jóvenes de las comunas 5, 6 y 7.', 'Casa de la Cultura Piedra del Sol', '2026-08-22 09:00:00', 'COLECTIVO TAMBÓ', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80', 7.062, -73.851),
  (2, (SELECT id FROM usuarios WHERE email = 'emiro@cultura.org'), 'Gran Feria de Emprendimientos y Saberes Afro', 'Feria Comunitaria', 'Muestra comercial de artesanías en fibra de río, turbantes étnicos, cosmética natural y dulces tradicionales.', 'Plaza del Tambor (Parque Infantil)', '2026-08-30 10:00:00', 'SECRETARÍA DE DESARROLLO ECONÓMICO', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80', 7.067, -73.849),
  (3, (SELECT id FROM usuarios WHERE email = 'emiro@cultura.org'), 'Festival de Tambores del Magdalena Medio', 'Festival Folclórico', 'Tres días de conciertos en vivo, rueda de cumbia, cantos de boga y cocinas tradicionales a orillas del río.', 'Malecón del Río Magdalena', '2026-09-12 16:00:00', 'SECRETARÍA DE CULTURA Y TURISMO', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80', 7.0653, -73.8547),
  (4, (SELECT id FROM usuarios WHERE email = 'emiro@cultura.org'), 'Noche de Cocinas Tradicionales y Fogón Afro', 'Muestra Gastronómica', 'Degustación de arroz de coco con titoté, sancocho de bocachico y pusandao preparado por cocineras portadoras.', 'Mercado Central – Fogón Afro', '2026-09-27 18:00:00', 'ASOCIACIÓN DE COCINERAS TRADICIONALES', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80', 7.064, -73.853),
  (5, (SELECT id FROM usuarios WHERE email = 'emiro@cultura.org'), 'Encuentro de Sabedores y Sabedoras del Río', 'Encuentro Patrimonial', 'Conversatorio intergeneracional sobre oralidad, mitos de la ciénaga, medicina de patio y memoria ribereña.', 'Casa de la Cultura Piedra del Sol', '2026-10-04 15:00:00', 'RED DE MEMORIA COMUNITARIA', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80', 7.062, -73.851)
ON CONFLICT (id) DO NOTHING;

INSERT INTO rutas (id, etiqueta, titulo, descripcion, duracion, duracion_horas, dificultad, cupo, lat, lng, zoom) VALUES
  (1, 'Ruta 1', 'Ruta de la Memoria Afro', 'Recorrido por los lugares que narran la llegada por el río, el asentamiento de las familias y el aporte cultural en Barrancabermeja.', '4 horas', 4, 'Dificultad Baja', 'Ideal para familias y caminantes', 7.0645, -73.8525, 15),
  (2, 'Ruta 2', 'Ruta del Río y los Saberes', 'Experiencia ribereña de navegación con cantos de boga, pesca artesanal y medicina tradicional en la ciénaga.', '6 horas', 6, 'Dificultad Media', 'Recorrido fluvial en lancha', 7.082, -73.83, 13),
  (3, 'Ruta 3', 'Ruta del Sabor Afro', 'Circuito gastronómico por las cocinas ancestrales, fogones portadores y repostería típica del municipio.', '3 horas', 3, 'Dificultad Baja', 'Recorrido gastronómico urbano', 7.065, -73.851, 15)
ON CONFLICT (id) DO NOTHING;

INSERT INTO ruta_paradas (id, ruta_id, orden, nombre, detalle, tiempo, minutos) VALUES
  (1, 1, 1, 'Malecón del Río Magdalena', 'Apertura con relato histórico sobre la llegada de las familias afro en canoas.', '45 MIN', 45),
  (2, 1, 2, 'Comuna 7 – Territorio Tambó', 'Caminata comunitaria por el barrio y muestra de percusión en vivo.', '1 HORA', 60),
  (3, 1, 3, 'Casa de la Cultura Piedra del Sol', 'Taller de danza afro y recorrido por el archivo fotográfico de memoria.', '1 HORA', 60),
  (4, 1, 4, 'Mercado Central – Fogón Afro', 'Cierre con almuerzo tradicional de sancocho de bocachico y arroz de coco.', '1 HORA 15 MIN', 75),
  (5, 2, 1, 'Embarcadero del Malecón', 'Salida en lancha tradicional con cantos de boga interpretados en vivo.', '1 HORA', 60),
  (6, 2, 2, 'Ciénaga San Silvestre', 'Pesca artesanal, avistamiento de aves y relato de la Madre de Agua.', '2 HORAS', 120),
  (7, 2, 3, 'Azotea de Plantas Medicinales', 'Visita a una huerta elevada y taller práctico de medicina de patio.', '1 HORA 30 MIN', 90),
  (8, 3, 1, 'Sabores de Aminta', 'Preparación en vivo y secretos del arroz de coco con titoté.', '1 HORA', 60),
  (9, 3, 2, 'Mercado Central – Fogón Afro', 'Degustación de sancocho de pescado y dulces de coco con corozo.', '1 HORA', 60),
  (10, 3, 3, 'Plaza del Tambor', 'Cierre con postres tradicionales, cocadas y muestra de percusión.', '45 MIN', 45)
ON CONFLICT (id) DO NOTHING;

INSERT INTO experiencias (id, titulo, descripcion, precio, duracion, cupo_max, guia, lugar) VALUES
  (1, 'Cocina de fogón: arroz de coco', 'Aprende a preparar arroz de coco con titoté junto a una cocinera portadora del saber.', 70000, '3h', 8, 'María Aminta Perea', 'Comuna 7'),
  (2, 'Taller de tambor y danza afro', 'Taller práctico de percusión y bullerengue con el Grupo Tambó del Magdalena Medio.', 45000, '2h', 20, 'Jhon Mosquera', 'Casa de la Cultura'),
  (3, 'Trenzado y memoria', 'Sesión de trenzado africano donde se narra el trenzado como mapa de libertad.', 60000, '2h', 6, 'Yuranis Palacios', 'Comuna 5'),
  (4, 'Tarde con saberes del río', 'Recorrido en lancha con cantos de boga, pesca artesanal y el relato de la Madre de Agua.', 85000, '4h', 12, 'Coop. de bogas', 'Malecón')
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('lugares', 'id'), GREATEST((SELECT COALESCE(MAX(id), 1) FROM lugares), 1));
SELECT setval(pg_get_serial_sequence('emprendimientos', 'id'), GREATEST((SELECT COALESCE(MAX(id), 1) FROM emprendimientos), 1));
SELECT setval(pg_get_serial_sequence('contenidos_culturales', 'id'), GREATEST((SELECT COALESCE(MAX(id), 1) FROM contenidos_culturales), 1));
SELECT setval(pg_get_serial_sequence('eventos', 'id'), GREATEST((SELECT COALESCE(MAX(id), 1) FROM eventos), 1));
SELECT setval(pg_get_serial_sequence('rutas', 'id'), GREATEST((SELECT COALESCE(MAX(id), 1) FROM rutas), 1));
SELECT setval(pg_get_serial_sequence('ruta_paradas', 'id'), GREATEST((SELECT COALESCE(MAX(id), 1) FROM ruta_paradas), 1));
SELECT setval(pg_get_serial_sequence('experiencias', 'id'), GREATEST((SELECT COALESCE(MAX(id), 1) FROM experiencias), 1));
