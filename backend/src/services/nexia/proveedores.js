/**
 * Proveedores de lenguaje para NEXIA. Se elige con IA_PROVIDER en .env:
 *   - openai     (OPENAI_API_KEY, OPENAI_MODEL)
 *   - anthropic  (ANTHROPIC_API_KEY, ANTHROPIC_MODEL)
 *   - local      (sin API: respuestas construidas con el catálogo)
 * Si no se define IA_PROVIDER, se usa el primero que tenga clave; si ninguno, local.
 */
require('dotenv').config();

function proveedorActivo() {
  const p = (process.env.IA_PROVIDER || '').toLowerCase();
  if (p === 'local') return 'local';
  if (p === 'openai' && process.env.OPENAI_API_KEY) return 'openai';
  if (p === 'anthropic' && process.env.ANTHROPIC_API_KEY) return 'anthropic';
  if (!p) {
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-') && !process.env.OPENAI_API_KEY.includes('tu-api-key')) return 'openai';
    if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.startsWith('sk-ant')) return 'anthropic';
  }
  return 'local';
}

let clienteOpenAI = null;
async function openai(system, mensajes, { maxTokens = 700, temperature = 0.6 } = {}) {
  if (!clienteOpenAI) {
    const OpenAI = require('openai');
    clienteOpenAI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 25000 });
  }
  const r = await clienteOpenAI.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [{ role: 'system', content: system }, ...mensajes],
    temperature,
    max_tokens: maxTokens,
  });
  return { texto: r.choices[0].message.content, tokens: r.usage ? r.usage.total_tokens : 0 };
}

async function anthropic(system, mensajes, { maxTokens = 700, temperature = 0.6 } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 25000);
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal: ctrl.signal,
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || 'claude-haiku-5-5',
        system,
        max_tokens: maxTokens,
        temperature,
        messages: mensajes,
      }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error ? data.error.message : `HTTP ${r.status}`);
    const texto = (data.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('\n');
    return { texto, tokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0) };
  } finally {
    clearTimeout(t);
  }
}

async function completar(system, mensajes, opciones) {
  const p = proveedorActivo();
  if (p === 'openai') return { ...(await openai(system, mensajes, opciones)), modo: 'openai' };
  if (p === 'anthropic') return { ...(await anthropic(system, mensajes, opciones)), modo: 'anthropic' };
  return null;
}

module.exports = { proveedorActivo, completar };
