// Reservas, valoraciones, favoritos y mensajes de contacto.
const pool = require('../config/db');
const catalogo = require('../services/catalogo.service');
const { registrar } = require('../utils/auditoria');
const { errorHttp } = require('../middleware/errores');

const TIPOS = ['emprendimiento', 'evento', 'contenido', 'lugar', 'ruta', 'experiencia'];

exports.crearReserva = async (req, res) => {
  const { experiencia_id, nombre_contacto, email_contacto, telefono_contacto, fecha_deseada, personas, comentario } = req.body;
  if (!experiencia_id || !nombre_contacto || !fecha_deseada || !personas) {
    throw errorHttp(400, 'Experiencia, nombre, fecha y número de personas son obligatorios.');
  }
  if (!email_contacto && !telefono_contacto) throw errorHttp(400, 'Deja un correo o un teléfono para que el guía te contacte.');
  const fecha = new Date(fecha_deseada + 'T12:00:00');
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  if (isNaN(fecha) || fecha < hoy) throw errorHttp(400, 'La fecha deseada debe ser hoy o una fecha futura.');

  const exp = await catalogo.obtener('experiencias', experiencia_id);
  if (!exp) throw errorHttp(404, 'La experiencia no existe.');
  const n = Number(personas);
  if (!Number.isInteger(n) || n < 1) throw errorHttp(400, 'El número de personas no es válido.');

  if (!(await pool.disponible())) throw errorHttp(503, 'No fue posible registrar la reserva en este momento. Intenta más tarde o contacta al guía.');

  // Control de cupo por fecha.
  if (exp.cupo_max) {
    const { rows } = await pool.query(
      `SELECT COALESCE(SUM(personas), 0)::int AS ocupados FROM reservas WHERE experiencia_id = $1 AND fecha_deseada = $2 AND estado <> 'cancelada'`,
      [experiencia_id, fecha_deseada]
    );
    const libres = exp.cupo_max - rows[0].ocupados;
    if (n > libres) throw errorHttp(409, libres > 0 ? `Solo quedan ${libres} cupos para esa fecha.` : 'No quedan cupos para esa fecha. Prueba otro día.');
  }

  const { rows } = await pool.query(
    `INSERT INTO reservas (experiencia_id, usuario_id, nombre_contacto, email_contacto, telefono_contacto, fecha_deseada, personas, comentario)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [experiencia_id, req.usuario ? req.usuario.id : null, nombre_contacto, email_contacto || null, telefono_contacto || null, fecha_deseada, n, comentario || null]
  );
  await registrar(req.usuario ? req.usuario.id : null, 'RESERVA_EXPERIENCIA', 'Experiencias', { reserva: rows[0].id, experiencia: exp.tit }, req);
  res.status(201).json({ mensaje: `Solicitud enviada a ${exp.guia}. Te contactarán para confirmar.`, reserva: rows[0] });
};

exports.listarReservas = async (req, res) => {
  const { rows } = await pool.query(
    `SELECT r.*, e.titulo AS experiencia, e.guia FROM reservas r JOIN experiencias e ON e.id = r.experiencia_id
     ORDER BY r.created_at DESC LIMIT 200`
  );
  res.json(rows);
};

exports.actualizarReserva = async (req, res) => {
  const { estado } = req.body;
  if (!['pendiente', 'confirmada', 'cancelada'].includes(estado)) throw errorHttp(400, 'Estado no válido.');
  const { rows } = await pool.query('UPDATE reservas SET estado = $1 WHERE id = $2 RETURNING *', [estado, req.params.id]);
  if (!rows.length) throw errorHttp(404, 'Reserva no encontrada.');
  await registrar(req.usuario.id, 'RESERVA_' + estado.toUpperCase(), 'Experiencias', { reserva: rows[0].id }, req);
  res.json(rows[0]);
};

exports.listarValoraciones = async (req, res) => {
  const { entidad_tipo, entidad_id } = req.query;
  const params = [];
  let where = '';
  if (entidad_tipo && entidad_id) { where = 'WHERE entidad_tipo = $1 AND entidad_id = $2'; params.push(entidad_tipo, entidad_id); }
  const { rows } = await pool.query(
    `SELECT v.id, v.entidad_tipo, v.entidad_id, v.puntuacion, v.comentario, v.created_at, u.nombre AS autor
     FROM valoraciones v JOIN usuarios u ON u.id = v.usuario_id ${where} ORDER BY v.id DESC LIMIT 100`, params
  );
  res.json(rows);
};

exports.crearValoracion = async (req, res) => {
  const { entidad_tipo, entidad_id, puntuacion, comentario } = req.body;
  if (!TIPOS.includes(entidad_tipo)) throw errorHttp(400, 'Tipo de entidad no válido.');
  const p = Number(puntuacion);
  if (!(p >= 1 && p <= 5)) throw errorHttp(400, 'La puntuación debe estar entre 1 y 5.');
  const { rows } = await pool.query(
    'INSERT INTO valoraciones (usuario_id, entidad_tipo, entidad_id, puntuacion, comentario) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [req.usuario.id, entidad_tipo, entidad_id, p, comentario || null]
  );
  res.status(201).json(rows[0]);
};

exports.listarFavoritos = async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM favoritos WHERE usuario_id = $1 ORDER BY id DESC', [req.usuario.id]);
  res.json(rows);
};

exports.alternarFavorito = async (req, res) => {
  const { entidad_tipo, entidad_id } = req.body;
  if (!TIPOS.includes(entidad_tipo)) throw errorHttp(400, 'Tipo de entidad no válido.');
  const borrado = await pool.query('DELETE FROM favoritos WHERE usuario_id = $1 AND entidad_tipo = $2 AND entidad_id = $3', [req.usuario.id, entidad_tipo, entidad_id]);
  if (borrado.rowCount) return res.json({ favorito: false });
  await pool.query('INSERT INTO favoritos (usuario_id, entidad_tipo, entidad_id) VALUES ($1, $2, $3)', [req.usuario.id, entidad_tipo, entidad_id]);
  res.status(201).json({ favorito: true });
};

exports.crearMensaje = async (req, res) => {
  const { emprendimiento_id, mensaje } = req.body;
  if (!emprendimiento_id || !mensaje) throw errorHttp(400, 'Emprendimiento y mensaje son obligatorios.');
  const { rows } = await pool.query(
    'INSERT INTO mensajes_contacto (usuario_id, emprendimiento_id, mensaje) VALUES ($1, $2, $3) RETURNING *',
    [req.usuario.id, emprendimiento_id, mensaje]
  );
  res.status(201).json(rows[0]);
};

exports.listarMensajes = async (req, res) => {
  // El emprendedor solo ve los mensajes de sus emprendimientos; el admin ve todos.
  const params = [req.params.emp_id];
  let filtro = '';
  if (req.usuario.rol !== 'administrador') { filtro = ' AND e.usuario_id = $2'; params.push(req.usuario.id); }
  const { rows } = await pool.query(
    `SELECT m.*, u.nombre AS remitente, u.email AS remitente_email FROM mensajes_contacto m
     JOIN emprendimientos e ON e.id = m.emprendimiento_id JOIN usuarios u ON u.id = m.usuario_id
     WHERE m.emprendimiento_id = $1${filtro} ORDER BY m.id DESC`, params
  );
  res.json(rows);
};
