const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth.controller');

router.post('/register', auth.registerActor);
router.post('/login', auth.loginActor);

module.exports = router;