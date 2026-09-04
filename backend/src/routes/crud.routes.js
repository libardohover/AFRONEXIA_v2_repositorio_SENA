const express = require('express');
const router = express.Router();
const crud = require('../controllers/crud.controller');
const admin = require('../controllers/admin.controller');

// Auth Simulado
router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const pool = require('../config/db');
  try {
    const { rows } = await pool.query('SELECT id, nombre, email, rol FROM usuarios WHERE email = $1', [email]);
    if (rows.length) {
      res.json({ usuario: rows[0], token: 'jwt_simulado_afronexia_' + rows[0].id });
    } else {
      res.status(401).json({ error: 'Credenciales inválidas' });
    }
  } catch {
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

// Rutas CRUD
router.get('/usuarios', crud.getUsuarios);
router.post('/usuarios', crud.createUsuario);
router.get('/emprendimientos', crud.getEmprendimientos);
router.post('/emprendimientos', crud.createEmprendimiento);
router.get('/contenidos', crud.getContenidos);
router.post('/contenidos', crud.createContenido);
router.get('/eventos', crud.getEventos);
router.post('/eventos', crud.createEvento);
router.get('/valoraciones', crud.getValoraciones);
router.post('/valoraciones', crud.createValoracion);
router.get('/favoritos/:usuario_id', crud.getFavoritos);
router.post('/favoritos', crud.createFavorito);
router.get('/mensajes/:emp_id', crud.getMensajes);
router.post('/mensajes', crud.createMensaje);
router.get('/auditoria', crud.getAuditoria);
router.post('/auditoria', crud.createAuditoria);
router.get('/ai-logs', crud.getAiLogs);
router.get('/ofertas', crud.getOfertas);
router.get('/admin/stats', admin.getStats);

module.exports = router;