const aiService = require('../services/ai.service');

exports.chat = async (req, res) => {
  try {
    const { mensaje, userId } = req.body;
    if (!mensaje) return res.status(400).json({ error: 'El mensaje es obligatorio' });
    const result = await aiService.chatConNexia(mensaje, userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};