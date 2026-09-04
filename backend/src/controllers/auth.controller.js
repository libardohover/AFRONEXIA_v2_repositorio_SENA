const pool = require('../config/db');

exports.registerActor = async (req, res) => {
  const client = await pool.connect();
  try {
    const { nombre, email, password, rol, telefono, negocio_nombre, negocio_categoria, negocio_ubicacion, saber_tipo } = req.body;

    if (!nombre || !email || !password || !rol) {
      return res.status(400).json({ error: 'Todos los campos obligatorios deben ser completados.' });
    }

    await client.query('BEGIN');

    // 1. Verificar si el usuario ya existe
    const existUser = await client.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (existUser.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'El correo electrónico ya se encuentra registrado.' });
    }

    // 2. Insertar en la tabla usuarios
    const userResult = await client.query(
      'INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol, created_at',
      [nombre, email, password, rol]
    );
    const newUser = userResult.rows[0];

    // 3. Si es Emprendedor, crear su negocio inicial
    if (rol === 'emprendedor' && negocio_nombre) {
      await client.query(
        'INSERT INTO emprendimientos (usuario_id, nombre, titular, categoria, descripcion, ubicacion, telefono_contacto) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [
          newUser.id,
          negocio_nombre,
          nombre,
          negocio_categoria || 'Gastronomía',
          'Emprendimiento afrodescendiente de Barrancabermeja registrado en AFRONEXIA.',
          negocio_ubicacion || 'Barrancabermeja',
          telefono || '573000000000'
        ]
      );
    }

    // 4. Registrar en Auditoría (RF-20)
    await client.query(
      'INSERT INTO auditoria (usuario_id, accion, modulo, detalles) VALUES ($1, $2, $3, $4)',
      [newUser.id, 'REGISTRO_ACTOR_' + rol.toUpperCase(), 'Autenticación y Roles', JSON.stringify({ email, rol, fecha: new Date() })]
    );

    await client.query('COMMIT');
    res.status(201).json({ mensaje: '¡Registro exitoso!', usuario: newUser });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Error en el servidor: ' + error.message });
  } finally {
    client.release();
  }
};

exports.loginActor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { rows } = await pool.query('SELECT id, nombre, email, rol, created_at FROM usuarios WHERE email = $1', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'No existe una cuenta registrada con este correo.' });
    }

    const usuario = rows[0];

    // Registrar inicio de sesión en Auditoría
    await pool.query(
      'INSERT INTO auditoria (usuario_id, accion, modulo, detalles) VALUES ($1, $2, $3, $4)',
      [usuario.id, 'LOGIN_EXITOSO', 'Autenticación', JSON.stringify({ rol: usuario.rol, ip: '127.0.0.1' })]
    );

    res.json({ usuario, token: 'jwt_afronexia_' + usuario.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};