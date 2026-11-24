const pool = require('../config/db');

// Registra una acción en la tabla auditoria (RF-20). Nunca rompe la petición si falla.
async function registrar(usuarioId, accion, modulo, detalles = {}, req = null) {
  try {
    const extra = req ? { ip: req.ip, agente: req.get('user-agent') } : {};
    await pool.query(
      'INSERT INTO auditoria (usuario_id, accion, modulo, detalles) VALUES ($1, $2, $3, $4)',
      [usuarioId || null, accion, modulo, JSON.stringify({ ...detalles, ...extra })]
    );
  } catch (e) {
    console.warn('Auditoría no registrada:', e.message);
  }
}

module.exports = { registrar };
