// Envuelve controladores async para que los errores lleguen al manejador central (Express 4 no lo hace solo).
module.exports = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
