const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const { registrar } = require('../utils/auditoria');
const { errorHttp } = require('../middleware/errores');

const contar = async (sql) => Number((await pool.query(sql)).rows[0].n) || 0;

// Indicadores reales del sistema (RF-13, RF-16). Ya no devuelve cifras inventadas.
exports.getStats = async (_req, res) => {
  const [usuarios, lugares, emprendimientos, eventos, proximos, saberes, rutas, experiencias, reservas, reservasPend, consultasIA, consultas7d] = await Promise.all([
    contar('SELECT COUNT(*) n FROM usuarios'),
    contar('SELECT COUNT(*) n FROM lugares'),
    contar('SELECT COUNT(*) n FROM emprendimientos'),
    contar('SELECT COUNT(*) n FROM eventos'),
    contar('SELECT COUNT(*) n FROM eventos WHERE fecha_inicio >= NOW()'),
    contar('SELECT COUNT(*) n FROM contenidos_culturales'),
    contar('SELECT COUNT(*) n FROM rutas'),
    contar('SELECT COUNT(*) n FROM experiencias'),
    contar('SELECT COUNT(*) n FROM reservas'),
    contar("SELECT COUNT(*) n FROM reservas WHERE estado = 'pendiente'"),
    contar('SELECT COUNT(*) n FROM ai_interaction_logs'),
    contar("SELECT COUNT(*) n FROM ai_interaction_logs WHERE created_at >= NOW() - INTERVAL '7 days'"),
  ]);
  const borradores = await contar(`SELECT (SELECT COUNT(*) FROM lugares WHERE estado='borrador') + (SELECT COUNT(*) FROM eventos WHERE estado='borrador')
    + (SELECT COUNT(*) FROM emprendimientos WHERE estado='borrador') + (SELECT COUNT(*) FROM contenidos_culturales WHERE estado='borrador') AS n`);

  const roles = (await pool.query('SELECT rol, COUNT(*)::int AS total FROM usuarios GROUP BY rol ORDER BY total DESC')).rows;
  const intenciones = (await pool.query(
    `SELECT COALESCE(intencion, 'sin_clasificar') AS intencion, COUNT(*)::int AS total FROM ai_interaction_logs
     GROUP BY 1 ORDER BY total DESC LIMIT 8`)).rows;
  const fb = (await pool.query(
    `SELECT COUNT(*) FILTER (WHERE calificacion = 1)::int AS positivas, COUNT(*) FILTER (WHERE calificacion = -1)::int AS negativas,
            COALESCE(SUM(tokens_usados), 0)::int AS tokens, COALESCE(AVG(latencia_ms), 0)::int AS latencia
     FROM ai_interaction_logs`)).rows[0];
  const porDia = (await pool.query(
    `SELECT to_char(d, 'YYYY-MM-DD') AS dia, COALESCE(c.total, 0)::int AS total
     FROM generate_series(CURRENT_DATE - 6, CURRENT_DATE, '1 day') d
     LEFT JOIN (SELECT created_at::date AS dia, COUNT(*) AS total FROM ai_interaction_logs GROUP BY 1) c ON c.dia = d::date ORDER BY d`)).rows;
  const logsRecientes = (await pool.query(
    'SELECT id, pregunta, intencion, modo, tokens_usados, calificacion, created_at FROM ai_interaction_logs ORDER BY id DESC LIMIT 10')).rows;
  const auditoria = (await pool.query(
    `SELECT a.id, a.accion, a.modulo, a.created_at, u.nombre AS usuario FROM auditoria a
     LEFT JOIN usuarios u ON u.id = a.usuario_id ORDER BY a.id DESC LIMIT 10`)).rows;

  const calificadas = fb.positivas + fb.negativas;
  res.json({
    usuarios, lugares, emprendimientos, eventos, eventosProximos: proximos, saberes, rutas, experiencias,
    reservas, reservasPendientes: reservasPend, borradores,
    totalRegistros: lugares + emprendimientos + eventos + saberes + rutas + experiencias,
    consultasIA, consultasIA7d: consultas7d,
    satisfaccionIA: calificadas ? Math.round((fb.positivas / calificadas) * 100) : null,
    feedbackIA: { positivas: fb.positivas, negativas: fb.negativas },
    tokensIA: fb.tokens, latenciaPromedioMs: fb.latencia,
    consultasPorDia: porDia, intenciones, roles, logsRecientes, auditoria,
  });
};

exports.getUsuarios = async (_req, res) => {
  const { rows } = await pool.query('SELECT id, nombre, email, rol, telefono, activo, ultimo_acceso, created_at FROM usuarios ORDER BY id DESC');
  res.json(rows);
};

exports.createUsuario = async (req, res) => {
  const { nombre, email, password, rol } = req.body;
  if (!nombre || !email || !password || !rol) throw errorHttp(400, 'Nombre, correo, contraseña y rol son obligatorios.');
  const hash = await bcrypt.hash(String(password), 10);
  const { rows } = await pool.query(
    'INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES ($1, lower($2), $3, $4) RETURNING id, nombre, email, rol',
    [nombre, email, hash, rol]
  );
  await registrar(req.usuario.id, 'CREAR_USUARIO', 'Administración', { nuevo: rows[0].id, rol }, req);
  res.status(201).json(rows[0]);
};

exports.updateUsuario = async (req, res) => {
  const { rol, activo } = req.body;
  if (Number(req.params.id) === req.usuario.id && (activo === false || (rol && rol !== 'administrador'))) {
    throw errorHttp(400, 'No puedes desactivarte ni quitarte el rol de administrador a ti mismo.');
  }
  const { rows } = await pool.query(
    'UPDATE usuarios SET rol = COALESCE($1, rol), activo = COALESCE($2, activo) WHERE id = $3 RETURNING id, nombre, email, rol, activo',
    [rol || null, typeof activo === 'boolean' ? activo : null, req.params.id]
  );
  if (!rows.length) throw errorHttp(404, 'Usuario no encontrado.');
  await registrar(req.usuario.id, 'EDITAR_USUARIO', 'Administración', { id: rows[0].id, rol, activo }, req);
  res.json(rows[0]);
};

exports.getAuditoria = async (_req, res) => {
  const { rows } = await pool.query(
    'SELECT a.*, u.nombre AS usuario FROM auditoria a LEFT JOIN usuarios u ON u.id = a.usuario_id ORDER BY a.id DESC LIMIT 100');
  res.json(rows);
};

exports.getAiLogs = async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM ai_interaction_logs ORDER BY id DESC LIMIT 100');
  res.json(rows);
};
