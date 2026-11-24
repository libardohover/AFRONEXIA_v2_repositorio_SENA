const pool = require('../config/db');
const catalogo = require('../services/catalogo.service');
const { registrar } = require('../utils/auditoria');
const { errorHttp } = require('../middleware/errores');

function definicion(req) {
  const def = catalogo.ENTIDADES[req.params.entidad];
  if (!def) throw errorHttp(404, `Entidad desconocida: ${req.params.entidad}`);
  return def;
}

function verificarRol(req, def) {
  if (!def.roles.includes(req.usuario.rol)) throw errorHttp(403, 'Tu rol no puede gestionar este tipo de contenido.');
}

async function verificarPropiedad(req, def, id) {
  if (!def.soloPropios || !def.soloPropios.includes(req.usuario.rol)) return;
  const { rows } = await pool.query(`SELECT ${def.autor} AS autor FROM ${def.tabla} WHERE id = $1`, [id]);
  if (!rows.length) throw errorHttp(404, 'Registro no encontrado.');
  if (rows[0].autor !== req.usuario.id) throw errorHttp(403, 'Solo puedes modificar tus propios registros.');
}

async function exigirBD() {
  if (!(await pool.disponible())) throw errorHttp(503, 'La base de datos no está disponible; el catálogo está en modo solo lectura.');
}

async function guardarParadas(client, rutaId, paradas) {
  if (!Array.isArray(paradas)) return;
  await client.query('DELETE FROM ruta_paradas WHERE ruta_id = $1', [rutaId]);
  let orden = 1;
  for (const p of paradas) {
    if (!p || !p.nombre) continue;
    await client.query(
      'INSERT INTO ruta_paradas (ruta_id, orden, nombre, detalle, tiempo, minutos) VALUES ($1, $2, $3, $4, $5, $6)',
      [rutaId, orden++, p.nombre, p.detalle || null, p.tiempo || null, Number(p.minutos) || null]
    );
  }
}

exports.todo = async (_req, res) => res.json(await catalogo.todo());

exports.listar = async (req, res) => {
  definicion(req);
  const verTodo = req.query.todos === '1' && req.usuario && ['administrador', 'gestor_cultural'].includes(req.usuario.rol);
  const { datos, fuente } = await catalogo.listar(req.params.entidad, { incluirBorradores: verTodo });
  let resultado = datos;
  if (req.query.q) {
    const q = req.query.q.toLowerCase();
    resultado = datos.filter((x) => JSON.stringify(x).toLowerCase().includes(q));
  }
  res.set('X-Fuente-Datos', fuente).json(resultado);
};

exports.obtener = async (req, res) => {
  definicion(req);
  const item = await catalogo.obtener(req.params.entidad, req.params.id);
  if (!item) throw errorHttp(404, 'Registro no encontrado.');
  res.json(item);
};

exports.crear = async (req, res) => {
  const def = definicion(req);
  verificarRol(req, def);
  await exigirBD();
  const cols = catalogo.aColumnas(req.params.entidad, req.body);
  for (const r of def.requeridos) {
    if (!cols[def.campos[r]]) throw errorHttp(400, `El campo "${r}" es obligatorio.`);
  }
  if (def.autor) cols[def.autor] = req.usuario.id;
  if (req.params.entidad === 'emprendimientos' && !cols.titular) cols.titular = req.usuario.nombre;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const nombres = Object.keys(cols);
    const { rows } = await client.query(
      `INSERT INTO ${def.tabla} (${nombres.join(', ')}) VALUES (${nombres.map((_, i) => '$' + (i + 1)).join(', ')}) RETURNING id`,
      Object.values(cols)
    );
    if (req.params.entidad === 'rutas') await guardarParadas(client, rows[0].id, req.body.paradas);
    await client.query('COMMIT');
    catalogo.invalidar();
    await registrar(req.usuario.id, `CREAR_${req.params.entidad.toUpperCase()}`, 'Catálogo', { id: rows[0].id }, req);
    res.status(201).json(await catalogo.obtener(req.params.entidad, rows[0].id));
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

exports.actualizar = async (req, res) => {
  const def = definicion(req);
  verificarRol(req, def);
  await exigirBD();
  await verificarPropiedad(req, def, req.params.id);
  const cols = catalogo.aColumnas(req.params.entidad, req.body);
  const nombres = Object.keys(cols);
  if (!nombres.length && !Array.isArray(req.body.paradas)) throw errorHttp(400, 'No hay campos para actualizar.');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    if (nombres.length) {
      const r = await client.query(
        `UPDATE ${def.tabla} SET ${nombres.map((c, i) => `${c} = $${i + 1}`).join(', ')} WHERE id = $${nombres.length + 1}`,
        [...Object.values(cols), req.params.id]
      );
      if (!r.rowCount) throw errorHttp(404, 'Registro no encontrado.');
    }
    if (req.params.entidad === 'rutas') await guardarParadas(client, req.params.id, req.body.paradas);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
  catalogo.invalidar();
  await registrar(req.usuario.id, `EDITAR_${req.params.entidad.toUpperCase()}`, 'Catálogo', { id: req.params.id, campos: nombres }, req);
  res.json(await catalogo.obtener(req.params.entidad, req.params.id));
};

exports.eliminar = async (req, res) => {
  const def = definicion(req);
  verificarRol(req, def);
  await exigirBD();
  await verificarPropiedad(req, def, req.params.id);
  const r = await pool.query(`DELETE FROM ${def.tabla} WHERE id = $1`, [req.params.id]);
  if (!r.rowCount) throw errorHttp(404, 'Registro no encontrado.');
  catalogo.invalidar();
  await registrar(req.usuario.id, `ELIMINAR_${req.params.entidad.toUpperCase()}`, 'Catálogo', { id: req.params.id }, req);
  res.json({ ok: true });
};
