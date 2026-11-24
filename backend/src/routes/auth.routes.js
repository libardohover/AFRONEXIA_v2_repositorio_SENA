const express = require('express');
const rateLimit = require('express-rate-limit');
const h = require('../utils/asyncHandler');
const auth = require('../controllers/auth.controller');
const { requiereAuth, autenticacionOpcional } = require('../middleware/auth');

const router = express.Router();
// Frena ataques de fuerza bruta sobre el login.
const limiteLogin = rateLimit({ windowMs: 15 * 60 * 1000, max: 30, message: { error: 'Demasiados intentos. Espera unos minutos.' } });

router.post('/register', limiteLogin, autenticacionOpcional, h(auth.registerActor));
router.post('/login', limiteLogin, h(auth.loginActor));
router.get('/me', requiereAuth, h(auth.me));

module.exports = router;
