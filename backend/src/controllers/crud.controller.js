const pool = require('../config/db');

exports.getUsuarios = async (req, res) => {
  const { rows } = await pool.query('SELECT id, nombre, email, rol, created_at FROM usuarios ORDER BY id DESC');
  res.json(rows);
};
exports.createUsuario = async (req, res) => {
  const { nombre, email, password_hash, rol } = req.body;
  const { rows } = await pool.query(
    'INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol',
    [nombre, email, password_hash, rol]
  );
  res.status(201).json(rows[0]);
};

exports.getEmprendimientos = async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM emprendimientos ORDER BY id DESC');
  res.json(rows);
};
exports.createEmprendimiento = async (req, res) => {
  const { usuario_id, nombre, categoria, descripcion, ubicacion, telefono_contacto } = req.body;
  const { rows } = await pool.query(
    'INSERT INTO emprendimientos (usuario_id, nombre, categoria, descripcion, ubicacion, telefono_contacto) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [usuario_id, nombre, categoria, descripcion, ubicacion, telefono_contacto]
  );
  res.status(201).json(rows[0]);
};

exports.getContenidos = async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM contenidos_culturales ORDER BY id DESC');
  res.json(rows);
};
exports.createContenido = async (req, res) => {
  const { autor_id, titulo, categoria, contenido } = req.body;
  const { rows } = await pool.query(
    'INSERT INTO contenidos_culturales (autor_id, titulo, categoria, contenido) VALUES ($1, $2, $3, $4) RETURNING *',
    [autor_id, titulo, categoria, contenido]
  );
  res.status(201).json(rows[0]);
};

exports.getEventos = async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM eventos ORDER BY fecha_inicio ASC');
  res.json(rows);
};
exports.createEvento = async (req, res) => {
  const { organizador_id, titulo, descripcion, lugar, fecha_inicio, fecha_fin } = req.body;
  const { rows } = await pool.query(
    'INSERT INTO eventos (organizador_id, titulo, descripcion, lugar, fecha_inicio, fecha_fin) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [organizador_id, titulo, descripcion, lugar, fecha_inicio, fecha_fin]
  );
  res.status(201).json(rows[0]);
};

exports.getValoraciones = async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM valoraciones ORDER BY id DESC');
  res.json(rows);
};
exports.createValoracion = async (req, res) => {
  const { usuario_id, entidad_tipo, entidad_id, puntuacion, comentario } = req.body;
  const { rows } = await pool.query(
    'INSERT INTO valoraciones (usuario_id, entidad_tipo, entidad_id, puntuacion, comentario) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [usuario_id, entidad_tipo, entidad_id, puntuacion, comentario]
  );
  res.status(201).json(rows[0]);
};

exports.getFavoritos = async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM favoritos WHERE usuario_id = $1', [req.params.usuario_id]);
  res.json(rows);
};
exports.createFavorito = async (req, res) => {
  const { usuario_id, entidad_tipo, entidad_id } = req.body;
  const { rows } = await pool.query(
    'INSERT INTO favoritos (usuario_id, entidad_tipo, entidad_id) VALUES ($1, $2, $3) RETURNING *',
    [usuario_id, entidad_tipo, entidad_id]
  );
  res.status(201).json(rows[0]);
};

exports.getMensajes = async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM mensajes_contacto WHERE emprendimiento_id = $1', [req.params.emp_id]);
  res.json(rows);
};
exports.createMensaje = async (req, res) => {
  const { usuario_id, emprendimiento_id, mensaje } = req.body;
  const { rows } = await pool.query(
    'INSERT INTO mensajes_contacto (usuario_id, emprendimiento_id, mensaje) VALUES ($1, $2, $3) RETURNING *',
    [usuario_id, emprendimiento_id, mensaje]
  );
  res.status(201).json(rows[0]);
};

exports.getAuditoria = async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM auditoria ORDER BY id DESC LIMIT 50');
  res.json(rows);
};
exports.createAuditoria = async (req, res) => {
  const { usuario_id, accion, modulo, detalles } = req.body;
  const { rows } = await pool.query(
    'INSERT INTO auditoria (usuario_id, accion, modulo, detalles) VALUES ($1, $2, $3, $4) RETURNING *',
    [usuario_id, accion, modulo, JSON.stringify(detalles || {})]
  );
  res.status(201).json(rows[0]);
};

exports.getAiLogs = async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM ai_interaction_logs ORDER BY id DESC LIMIT 50');
  res.json(rows);
};
exports.getOfertas = async (req, res) => {
  const { rows } = await pool.query('SELECT id, titulo, fuente_tipo, fuente_id, texto_indexado FROM ofertas_culturales');
  res.json(rows);
};