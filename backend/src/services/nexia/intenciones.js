/**
 * Detección de intención y de parámetros de viaje en español coloquial.
 */
const { normalizar } = require('./conocimiento');

const REGLAS = [
  ['saludo', /^(hola|buen[oa]s?( dias| tardes| noches)?|hey|que mas|saludos|ey)\b[\s!.,]*$/],
  ['agradecimiento', /^(muchas )?gracias|^chevere|^listo gracias|^perfecto gracias/],
  ['despedida', /\b(chao|adios|hasta luego|nos vemos)\b/],
  ['precios', /\b(cuanto (cuesta|vale|cobran)|precio|precios|tarifa|valor)\b/],
  ['reserva', /\b(reserv|apart|cupo|inscrib|agendar)/],
  ['itinerario', /\b(itinerario|plan(ear|ifica)?|una tarde|en la tarde|una manana|un dia|todo el dia|fin de semana|finde|\d+\s*(horas|dias)|que hago|que hacer|visita|recorrer|organiza)/],
  ['eventos', /\b(evento|eventos|agenda|festival|feria|concierto|cuando hay|proxim|este mes|esta semana|programacion|encuentro)/],
  ['rutas', /\b(ruta|rutas|recorrido|circuito|tour)\b/],
  ['experiencias', /\b(experiencia|experiencias|taller|talleres|vivencia|clase|aprender|actividad)/],
  ['gastronomia', /\b(comer|comida|almorz|cenar|plato|restaurante|gastronom|sancocho|pescado|arroz|bocachico|dulce|postre|cocina|hambre)/],
  ['emprendimientos', /\b(emprend|artesan|comprar|tienda|producto|regalo|turbante|trenza|peinad|negocio|whatsapp|contactar|contacto)/],
  ['memoria', /\b(historia|memoria|saber|saberes|leyenda|mito|tradicion|ancestral|patrimonio|canto de boga|medicina|origen|cultura afro)/],
  ['lugares', /\b(lugar|lugares|sitio|sitios|donde|ubicacion|como llego|como llegar|direccion|mapa|visitar|conocer)/],
  ['ayuda', /\b(ayuda|que puedes|que sabes|quien eres|como funciona|que es afronexia)/],
];

function detectarIntencion(texto) {
  const t = normalizar(texto).trim();
  for (const [nombre, re] of REGLAS) if (re.test(t)) return nombre;
  return 'general';
}

// Extrae parámetros útiles para armar un itinerario.
function parametrosViaje(texto) {
  const t = normalizar(texto);
  let horas = null;
  let dias = 1;
  let inicio = 9;
  if (/fin de semana|finde|dos dias|2 dias/.test(t)) { dias = 2; horas = 6; }
  else if (/\b(\d+)\s*dias\b/.test(t)) { dias = Math.min(3, Number(t.match(/\b(\d+)\s*dias\b/)[1])); horas = 6; }
  else if (/\btarde\b/.test(t)) { horas = 4; inicio = 14; }
  else if (/\bmanana\b/.test(t)) { horas = 4; inicio = 8; }
  else if (/\b(\d+)\s*horas?\b/.test(t)) horas = Math.min(10, Number(t.match(/\b(\d+)\s*horas?\b/)[1]));
  else if (/todo el dia|un dia|dia completo/.test(t)) horas = 7;

  const intereses = [];
  if (/comer|comida|gastronom|sabor|cocina|plato|sancocho|almuerzo/.test(t)) intereses.push('sabor');
  if (/rio|lancha|cienaga|naturaleza|aves|pesca|boga/.test(t)) intereses.push('rio');
  if (/historia|memoria|cultura|tambor|musica|danza|baile|barrio/.test(t)) intereses.push('memoria');
  if (/artesan|compra|regalo|trenza|peinad/.test(t)) intereses.push('compras');

  return {
    horas, dias, inicio, intereses,
    familia: /familia|ninos|hijos|abuel/.test(t),
    economico: /barato|economic|poco dinero|presupuesto|gratis/.test(t),
  };
}

module.exports = { detectarIntencion, parametrosViaje };
