const pool = require('../config/db');
require('dotenv').config();

// Servicio de IA con modo seguro (funciona con o sin OpenAI API Key)
async function chatConNexia(userQuery, userId = null) {
  let reply = '¡Hola! Te doy la bienvenida a AFRONEXIA 🌺. En Barrancabermeja te invitamos a conocer el Paseo del Río para degustar el mejor pescado frito y disfrutar de los eventos de tamboras tradicionales.';
  let tokens = 0;

  // Si tienes una API Key configurada en .env, intenta usar OpenAI
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-')) {
    try {
      const OpenAI = require('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Eres NEXIA, asistente virtual de AFRONEXIA en Barrancabermeja. Promueve la cultura afrodescendiente, gastronomía y turismo con entusiasmo.' },
          { role: 'user', content: userQuery }
        ],
        temperature: 0.7,
      });
      reply = completion.choices[0].message.content;
      tokens = completion.usage.total_tokens;
    } catch (err) {
      console.warn('Modo local activado:', err.message);
    }
  }

  // Guardar log en la base de datos
  try {
    await pool.query(
      `INSERT INTO ai_interaction_logs (user_id, pregunta, respuesta, tokens_usados) VALUES ($1, $2, $3, $4)`,
      [userId, userQuery, reply, tokens]
    );
  } catch (e) {
    // Continúa normalmente si la tabla aún no tiene registros
  }

  return { respuesta: reply };
}

module.exports = { chatConNexia };
