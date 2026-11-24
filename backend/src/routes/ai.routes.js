const express = require('express');
const rateLimit = require('express-rate-limit');
const h = require('../utils/asyncHandler');
const ai = require('../controllers/ai.controller');
const { requiereAuth } = require('../middleware/auth');

const router = express.Router();
const limiter = rateLimit({ windowMs: 60 * 1000, max: 20, message: { error: 'Límite de consultas excedido. Espera un minuto.' } });

router.get('/estado', h(ai.estado));
router.post('/chat', limiter, h(ai.chat));
router.post('/itinerario', limiter, h(ai.itinerario));
router.post('/feedback', h(ai.feedback));
router.post('/mejorar-descripcion', limiter, requiereAuth, h(ai.mejorarDescripcion));

module.exports = router;
