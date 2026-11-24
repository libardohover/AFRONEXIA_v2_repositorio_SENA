function noEncontrado(req, res) {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function manejadorErrores(err, req, res, _next) {
  const status = err.status || (err.code === '23505' ? 409 : err.code === '23503' || err.code === '23514' || err.code === '22P02' ? 400 : 500);
  const mensajes = {
    '23505': 'El registro ya existe.',
    '23503': 'El registro referenciado no existe.',
    '23514': 'Algún valor no cumple las reglas permitidas.',
    '22P02': 'Algún valor tiene un formato inválido.',
  };
  if (status >= 500) console.error('❌', req.method, req.originalUrl, err);
  res.status(status).json({
    error: err.expose || status < 500 ? (mensajes[err.code] || err.message) : 'Error interno del servidor.',
    ...(process.env.NODE_ENV !== 'production' && status >= 500 && !err.expose ? { detalle: err.message } : {}),
  });
}

function errorHttp(status, mensaje) {
  const e = new Error(mensaje);
  e.status = status;
  e.expose = true;
  return e;
}

module.exports = { noEncontrado, manejadorErrores, errorHttp };
