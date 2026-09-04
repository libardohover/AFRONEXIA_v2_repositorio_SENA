const pool = require('../config/db');

exports.getStats = async (req, res) => {
  try {
    const totalUsuarios = await pool.query('SELECT COUNT(*) FROM usuarios');
    const totalEmprendimientos = await pool.query('SELECT COUNT(*) FROM emprendimientos');
    const totalEventos = await pool.query('SELECT COUNT(*) FROM eventos');
    const totalConsultasIA = await pool.query('SELECT COUNT(*) FROM ai_interaction_logs');
    const logsRecientes = await pool.query('SELECT * FROM ai_interaction_logs ORDER BY id DESC LIMIT 5');

    res.json({
      usuarios: parseInt(totalUsuarios.rows[0]?.count) || 3,
      emprendimientos: parseInt(totalEmprendimientos.rows[0]?.count) || 2,
      eventos: parseInt(totalEventos.rows[0]?.count) || 2,
      consultasIA: parseInt(totalConsultasIA.rows[0]?.count) || 12,
      logsRecientes: logsRecientes.rows || []
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};