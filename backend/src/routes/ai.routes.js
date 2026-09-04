const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: 'Límite de consultas excedido.' }
});

router.post('/chat', limiter, aiController.chat);

module.exports = router;