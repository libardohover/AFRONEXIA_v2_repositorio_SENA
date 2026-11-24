const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

function leerToken(req) {
  const h = req.get('authorization') || '';
  return h.startsWith('Bearer ') ? h.slice(7) : null;
}

// Si hay token válido, deja req.usuario; si no, continúa como anónimo.
function autenticacionOpcional(req, _res, next) {
  const token = leerToken(req);
  if (token) {
    try { req.usuario = jwt.verify(token, JWT_SECRET); } catch { /* token inválido o vencido: anónimo */ }
  }
  next();
}

function requiereAuth(req, res, next) {
  const token = leerToken(req);
  if (!token) return res.status(401).json({ error: 'Debes iniciar sesión.' });
  try {
    req.usuario = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Sesión vencida o inválida. Vuelve a iniciar sesión.' });
  }
}

const requiereRol = (...roles) => (req, res, next) =>
  requiereAuth(req, res, () => {
    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({ error: 'No tienes permisos para esta acción.' });
    }
    next();
  });

module.exports = { autenticacionOpcional, requiereAuth, requiereRol };
