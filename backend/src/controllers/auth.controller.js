const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { JWT_SECRET, JWT_EXPIRES, ALLOW_ADMIN_SIGNUP } = require('../config/env');
const { registrar } = require('../utils/auditoria');
const { errorHttp } = require('../middleware/errores');

const ROLES = ['visitante', 'emprendedor', 'gestor_cultural', 'administrador'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function firmar(usuario) {
  return jwt.sign({ id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

exports.registerActor = async (req, res) => {
  const { nombre, email, password, rol = 'visitante', telefono, negocio_nombre, negocio_categoria, negocio_ubicacion, saber_tipo } = req.body;

  if (!nombre || !email || !password) throw errorHttp(400, 'Nombre, correo y contraseña son obligatorios.');
  if (!EMAIL_RE.test(email)) throw errorHttp(400, 'El correo electrónico no es válido.');
  if (String(password).length < 8) throw errorHttp(400, 'La contraseña debe tener al menos 8 caracteres.');
  if (!ROLES.includes(rol)) throw errorHttp(400, 'Rol no válido.');
  // Un administrador no se puede auto-registrar desde la web (salvo que se habilite explícitamente).
  const esAdminCreando = req.usuario && req.usuario.rol === 'administrador';
  if (rol === 'administrador' && !ALLOW_ADMIN_SIGNUP && !esAdminCreando) {
    throw errorHttp(403, 'Las cuentas de administrador solo las crea otro administrador.');
  }
  if (rol === 'emprendedor' && !negocio_nombre) throw errorHttp(400, 'Indica el nombre de tu emprendimiento.');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const existe = await client.query('SELECT id FROM usuarios WHERE lower(email) = lower($1)', [email]);
    if (existe.rows.length) throw errorHttp(409, 'El correo electrónico ya se encuentra registrado.');

    const hash = await bcrypt.hash(String(password), 10);
    const { rows } = await client.query(
      `INSERT INTO usuarios (nombre, email, password_hash, rol, telefono, area_cultural)
       VALUES ($1, lower($2), $3, $4, $5, $6) RETURNING id, nombre, email, rol, created_at`,
      [nombre.trim(), email.trim(), hash, rol, telefono || null, rol === 'gestor_cultural' ? saber_tipo || null : null]
    );
    const usuario = rows[0];

    if (rol === 'emprendedor') {
      await client.query(
        `INSERT INTO emprendimientos (usuario_id, nombre, titular, categoria, descripcion, ubicacion, telefono_contacto, email_contacto)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [usuario.id, negocio_nombre, nombre, negocio_categoria || 'Gastronomía',
          'Emprendimiento afrodescendiente de Barrancabermeja registrado en AFRONEXIA.',
          negocio_ubicacion || 'Barrancabermeja', telefono || null, usuario.email]
      );
    }

    await client.query(
      'INSERT INTO auditoria (usuario_id, accion, modulo, detalles) VALUES ($1, $2, $3, $4)',
      [usuario.id, 'REGISTRO_ACTOR_' + rol.toUpperCase(), 'Autenticación y Roles', JSON.stringify({ email: usuario.email, rol, ip: req.ip })]
    );
    await client.query('COMMIT');
    require('../services/catalogo.service').invalidar('emprendimientos');
    res.status(201).json({ mensaje: '¡Registro exitoso!', usuario, token: firmar(usuario) });
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

exports.loginActor = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw errorHttp(400, 'Correo y contraseña son obligatorios.');

  const { rows } = await pool.query(
    'SELECT id, nombre, email, rol, password_hash, activo, created_at FROM usuarios WHERE lower(email) = lower($1)', [email]
  );
  const u = rows[0];
  let valido = false;
  if (u) {
    if (u.password_hash.startsWith('$2')) {
      valido = await bcrypt.compare(String(password), u.password_hash);
    } else if (u.password_hash === String(password)) {
      // Cuenta de la versión 1 (contraseña guardada en texto plano): se migra a bcrypt al ingresar.
      valido = true;
      await pool.query('UPDATE usuarios SET password_hash = $1 WHERE id = $2', [await bcrypt.hash(String(password), 10), u.id]);
    }
  }
  if (!valido) {
    await registrar(u ? u.id : null, 'LOGIN_FALLIDO', 'Autenticación', { email }, req);
    throw errorHttp(401, 'Correo o contraseña incorrectos.');
  }
  if (u.activo === false) throw errorHttp(403, 'La cuenta está desactivada. Contacta al administrador.');

  await pool.query('UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = $1', [u.id]);
  await registrar(u.id, 'LOGIN_EXITOSO', 'Autenticación', { rol: u.rol }, req);
  const usuario = { id: u.id, nombre: u.nombre, email: u.email, rol: u.rol, created_at: u.created_at };
  res.json({ usuario, token: firmar(usuario) });
};

exports.me = async (req, res) => {
  const { rows } = await pool.query('SELECT id, nombre, email, rol, telefono, created_at FROM usuarios WHERE id = $1', [req.usuario.id]);
  if (!rows.length) throw errorHttp(404, 'Usuario no encontrado.');
  res.json({ usuario: rows[0] });
};
