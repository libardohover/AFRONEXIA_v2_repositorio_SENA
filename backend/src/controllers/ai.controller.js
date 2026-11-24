const nexia = require('../services/nexia');
const { errorHttp } = require('../middleware/errores');

exports.chat = async (req, res) => {
  const { mensaje, sessionId } = req.body;
  if (!mensaje || !String(mensaje).trim()) throw errorHttp(400, 'El mensaje es obligatorio.');
  const r = await nexia.chatConNexia(mensaje, { userId: req.usuario ? req.usuario.id : null, sessionId });
  res.json(r);
};

exports.itinerario = async (req, res) => {
  res.json(await nexia.itinerario(req.body.texto || req.body.mensaje || ''));
};

exports.feedback = async (req, res) => {
  const { logId, calificacion, comentario } = req.body;
  if (!logId || ![1, -1].includes(Number(calificacion))) throw errorHttp(400, 'logId y calificación (1 o -1) son obligatorios.');
  const ok = await nexia.feedback(logId, Number(calificacion), comentario);
  if (!ok) throw errorHttp(404, 'Interacción no encontrada.');
  res.json({ ok: true });
};

exports.mejorarDescripcion = async (req, res) => {
  if (!req.body.descripcion || String(req.body.descripcion).trim().length < 5) {
    throw errorHttp(400, 'Escribe al menos una frase sobre tu producto para poder mejorarla.');
  }
  res.json(await nexia.mejorarDescripcion(req.body));
};

exports.estado = async (_req, res) => res.json(await nexia.estado());
