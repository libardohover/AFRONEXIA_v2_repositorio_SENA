const express = require('express');
const h = require('../utils/asyncHandler');
const { requiereAuth, requiereRol } = require('../middleware/auth');
const cat = require('../controllers/catalogo.controller');
const part = require('../controllers/participacion.controller');
const admin = require('../controllers/admin.controller');

const router = express.Router();

// Catálogo cultural (lectura pública, escritura según rol)
router.get('/catalogo', h(cat.todo));
router.get('/catalogo/:entidad', h(cat.listar));
router.get('/catalogo/:entidad/:id', h(cat.obtener));
router.post('/catalogo/:entidad', requiereAuth, h(cat.crear));
router.put('/catalogo/:entidad/:id', requiereAuth, h(cat.actualizar));
router.delete('/catalogo/:entidad/:id', requiereAuth, h(cat.eliminar));

// Atajos compatibles con la v1 (/emprendimientos, /eventos, /contenidos)
const alias = (entidad) => (req, _res, next) => { req.params.entidad = entidad; next(); };
router.get('/emprendimientos', alias('emprendimientos'), h(cat.listar));
router.post('/emprendimientos', requiereAuth, alias('emprendimientos'), h(cat.crear));
router.get('/eventos', alias('eventos'), h(cat.listar));
router.post('/eventos', requiereAuth, alias('eventos'), h(cat.crear));
router.get('/contenidos', alias('saberes'), h(cat.listar));
router.post('/contenidos', requiereAuth, alias('saberes'), h(cat.crear));

// Participación
router.post('/reservas', h(part.crearReserva));
// Las reservas tienen datos personales de los visitantes: solo administrador y gestor cultural.
router.get('/reservas', requiereRol('administrador', 'gestor_cultural'), h(part.listarReservas));
router.patch('/reservas/:id', requiereRol('administrador', 'gestor_cultural'), h(part.actualizarReserva));
router.get('/valoraciones', h(part.listarValoraciones));
router.post('/valoraciones', requiereAuth, h(part.crearValoracion));
router.get('/favoritos', requiereAuth, h(part.listarFavoritos));
router.post('/favoritos', requiereAuth, h(part.alternarFavorito));
router.post('/mensajes', requiereAuth, h(part.crearMensaje));
router.get('/mensajes/:emp_id', requiereRol('administrador', 'emprendedor'), h(part.listarMensajes));

// Administración (solo administrador)
const soloAdmin = requiereRol('administrador');
router.get('/admin/stats', soloAdmin, h(admin.getStats));
router.get('/usuarios', soloAdmin, h(admin.getUsuarios));
router.post('/usuarios', soloAdmin, h(admin.createUsuario));
router.patch('/usuarios/:id', soloAdmin, h(admin.updateUsuario));
router.get('/auditoria', soloAdmin, h(admin.getAuditoria));
router.get('/ai-logs', soloAdmin, h(admin.getAiLogs));

module.exports = router;
