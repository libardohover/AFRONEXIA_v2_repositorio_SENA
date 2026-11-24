/**
 * Motor de respuestas local de NEXIA: responde con datos reales del catálogo
 * cuando no hay proveedor de IA configurado (o falla). Sin inventar datos.
 */
const { buscar, porTipo, sinDuplicados } = require('./conocimiento');
const { generarItinerario, itinerarioATexto } = require('./itinerario');
const { parametrosViaje } = require('./intenciones');

const lista = (docs, fn) => docs.map(fn).join('\n');
const SUGERENCIAS_BASE = ['Planea mi tarde cultural', '¿Dónde como sancocho de bocachico?', '¿Qué eventos afro hay?', 'Cuéntame la leyenda de la Madre de Agua'];

async function responderLocal(mensaje, intencion) {
  let texto = '';
  let docs = [];
  let itinerario = null;
  let sugerencias = SUGERENCIAS_BASE;

  switch (intencion) {
    case 'saludo':
      texto = '¡Hola, caminante! 🌺 Soy NEXIA, la guía cultural de AFRONEXIA en Barrancabermeja. Puedo armarte un itinerario, recomendarte dónde comer cocina afro del río, contarte los saberes y leyendas de la comunidad o mostrarte la agenda y las experiencias con guías locales. ¿Qué te gustaría vivir?';
      break;
    case 'agradecimiento':
      texto = '¡Con todo el gusto! Que disfrutes el río y su gente. Si necesitas algo más para tu visita, aquí estoy. 🌿';
      sugerencias = ['Planea mi fin de semana', '¿Qué experiencias puedo reservar?'];
      break;
    case 'despedida':
      texto = '¡Hasta pronto! La memoria afro se cuida contándola: comparte AFRONEXIA con quien quiera conocer Barrancabermeja. 🥁';
      sugerencias = [];
      break;
    case 'ayuda':
      texto = 'Soy NEXIA, el agente virtual de AFRONEXIA. Esto es lo que puedo hacer por ti:\n• Armar itinerarios por horas, tarde o fin de semana.\n• Recomendar cocina tradicional y emprendimientos afro, con su contacto.\n• Contarte la agenda cultural y las rutas con sus paradas.\n• Explicar saberes, mitos y tradiciones del río.\n• Ayudarte a reservar experiencias con guías de la comunidad.\nTodo lo que te digo sale del catálogo comunitario de AFRONEXIA.';
      break;
    case 'itinerario': {
      const params = parametrosViaje(mensaje);
      itinerario = await generarItinerario(params);
      const cuando = params.dias > 1 ? `tus ${params.dias} días` : params.inicio >= 14 ? 'tu tarde' : params.horas ? `tus ${params.horas} horas` : 'tu día';
      texto = `Te armé este plan para ${cuando} en Barrancabermeja 🗺️\n\n${itinerarioATexto(itinerario)}`;
      docs = (await porTipo('ruta')).filter((d) => itinerario.dias.some((x) => x.rutaId === d.id));
      sugerencias = ['Quiero reservar una experiencia', '¿Dónde almuerzo cerca?', 'Hazlo más económico'];
      break;
    }
    case 'eventos': {
      const eventos = await porTipo('evento');
      const proximos = eventos.filter((e) => !e.pasado).sort((a, b) => a.fecha.localeCompare(b.fecha));
      if (proximos.length) {
        docs = proximos.slice(0, 4);
        texto = `Estos son los próximos eventos de la agenda afro 📅\n${lista(docs, (d) => `• ${d.linea}`)}`;
      } else {
        docs = eventos.sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 3);
        texto = `Por ahora no hay eventos próximos publicados en la agenda de AFRONEXIA. Los más recientes fueron:\n${lista(docs, (d) => `• ${d.titulo} (${d.tarjeta.subtitulo.split(' · ')[1]})`)}\nMientras se publican nuevas fechas, puedes vivir las experiencias con guías locales, que están disponibles con reserva.`;
        sugerencias = ['¿Qué experiencias puedo reservar?', 'Muéstrame las rutas culturales'];
      }
      break;
    }
    case 'reserva':
    case 'experiencias': {
      docs = await buscar(mensaje, { k: 4, tipos: ['experiencia'] });
      if (!docs.length) docs = await porTipo('experiencia');
      texto = `Estas experiencias las guían personas de la comunidad 🌿\n${lista(docs, (d) => `• ${d.linea}`)}\n\nPara reservar, toca la tarjeta de la experiencia y completa tu fecha y número de personas; el guía te contactará para confirmar.`;
      sugerencias = ['Planea mi tarde cultural', '¿Cuál es la más económica?'];
      break;
    }
    case 'rutas':
      docs = await porTipo('ruta');
      texto = `AFRONEXIA tiene ${docs.length} rutas diseñadas con la comunidad:\n${lista(docs, (d) => `• **${d.titulo}** — ${d.tarjeta.subtitulo}. Paradas: ${d.tarjeta.detalle}.`)}\n¿Quieres que te arme el horario de alguna?`;
      sugerencias = ['Arma la Ruta del Sabor para una tarde', 'Plan de fin de semana con mi familia'];
      break;
    default: {
      const tipos = {
        gastronomia: ['emprendimiento', 'lugar', 'saber', 'experiencia'],
        emprendimientos: ['emprendimiento'],
        precios: ['experiencia', 'emprendimiento'],
        memoria: ['saber', 'lugar', 'evento'],
        lugares: ['lugar'],
      }[intencion] || null;
      docs = sinDuplicados(await buscar(mensaje, { k: 6, tipos })).slice(0, 4);
      if (!docs.length && tipos) docs = (await porTipo(tipos[0])).slice(0, 4);
      if (!docs.length) {
        texto = 'No encontré algo exacto sobre eso en el catálogo de AFRONEXIA. Puedo ayudarte con cocina tradicional, rutas, eventos, saberes y emprendimientos afro de Barrancabermeja. ¿Qué te interesa?';
        break;
      }
      const intro = {
        gastronomia: 'Para comer sabroso y con historia, te recomiendo 🍲',
        emprendimientos: 'Estos emprendimientos afro te pueden atender directamente 🛍️',
        precios: 'Estos son los precios publicados en AFRONEXIA (por persona o desde) 💵',
        memoria: 'Esto es lo que guarda la memoria comunitaria 📜',
        lugares: 'Estos lugares del territorio te pueden interesar 📍',
      }[intencion] || 'Esto encontré en AFRONEXIA para ti:';
      texto = `${intro}\n${lista(docs, (d) => `• ${d.linea}`)}`;
      if (docs.some((d) => d.tipo === 'emprendimiento')) texto += '\n\nPuedes escribirles por WhatsApp desde la tarjeta.';
    }
  }
  return { texto, docs, itinerario, sugerencias };
}

module.exports = { responderLocal, SUGERENCIAS_BASE };
