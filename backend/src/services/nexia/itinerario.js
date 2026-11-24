/**
 * Generador de itinerarios de NEXIA: arma un plan con horario a partir de
 * las rutas, paradas, experiencias y eventos reales del catálogo.
 */
const { construirIndice } = require('./conocimiento');

const fmt = (min) => {
  const h = Math.floor(min / 60), m = min % 60;
  return `${String(((h + 11) % 12) + 1)}:${String(m).padStart(2, '0')} ${h < 12 ? 'a. m.' : 'p. m.'}`;
};

const PREFERENCIA = { sabor: /sabor/i, rio: /r[ií]o/i, memoria: /memoria/i, compras: /sabor|memoria/i };

function elegirRutas(rutas, { intereses, horas, dias }) {
  const puntaje = (r) => {
    let s = 0;
    intereses.forEach((i, pos) => { if (PREFERENCIA[i] && PREFERENCIA[i].test(r.titulo)) s += 10 - pos; });
    if (horas) s -= Math.max(0, (r.horas || 4) - horas) * 3; // penaliza rutas más largas que el tiempo disponible
    return s;
  };
  return [...rutas].sort((a, b) => puntaje(b) - puntaje(a)).slice(0, Math.max(1, dias));
}

async function generarItinerario(params) {
  const idx = await construirIndice();
  const cat = idx.catalogo;
  const { horas, dias = 1, inicio = 9, intereses = [], familia, economico } = params;
  const rutas = elegirRutas(cat.rutas, { intereses, horas, dias });

  const planDias = rutas.map((ruta, i) => {
    let reloj = (i === 0 ? inicio : 9) * 60;
    const limite = horas ? reloj + horas * 60 : Infinity;
    const paradas = [];
    let comio = /sabor/i.test(ruta.titulo);
    const esComida = (n) => /fog[oó]n|sabores|mercado/i.test(n);
    for (const [k, p] of (ruta.paradas || []).entries()) {
      if (reloj + (p.minutos || 60) > limite + 30 && paradas.length >= 2) break;
      // Almuerzo si el recorrido cruza el mediodía y la ruta no es gastronómica.
      const quedaComida = (ruta.paradas || []).slice(k).some((x) => esComida(x.nombre));
      if (!comio && !quedaComida && reloj >= 12 * 60 && reloj < 14 * 60) {
        paradas.push({ hora: fmt(reloj), nombre: 'Almuerzo en Mercado Central – Fogón Afro', detalle: 'Sancocho de bocachico o arroz de coco con cocineras tradicionales.', minutos: 60 });
        reloj += 75; comio = true;
      }
      if (esComida(p.nombre)) comio = true;
      paradas.push({ hora: fmt(reloj), nombre: p.nombre, detalle: p.detalle, minutos: p.minutos });
      reloj += (p.minutos || 60) + 15; // 15 min de traslado entre paradas
    }
    return { dia: i + 1, titulo: ruta.titulo, rutaId: ruta.id, paradas, fin: fmt(reloj - 15) };
  });

  // Experiencias recomendadas según intereses y presupuesto.
  const mapaExp = { sabor: /cocina|fog[oó]n/i, rio: /r[ií]o/i, memoria: /tambor|danza|trenz/i, compras: /trenz/i };
  let exps = cat.experiencias.filter((x) => intereses.some((i) => mapaExp[i] && mapaExp[i].test(x.tit)));
  if (!exps.length) exps = cat.experiencias.slice(0, 2);
  if (economico) exps = [...exps].sort((a, b) => (a.precio || 0) - (b.precio || 0));
  if (familia) exps = exps.filter((x) => !x.cupo_max || x.cupo_max >= 6);

  const hoy = new Date();
  const en45 = new Date(Date.now() + 45 * 864e5);
  const eventos = cat.eventos.filter((e) => { const d = new Date(e.fecha_iso); return d >= hoy && d <= en45; });

  const consejos = [
    'Lleva ropa fresca, bloqueador e hidratación: Barrancabermeja es cálida casi todo el año.',
    'Paga a los emprendedores directamente y pregunta por la historia de cada plato o pieza: es parte de la experiencia.',
  ];
  if (rutas.some((r) => /r[ií]o/i.test(r.titulo))) consejos.push('Para el recorrido en lancha usa chaleco salvavidas y reserva con anticipación con la cooperativa de bogas.');
  if (familia) consejos.push('Las rutas de dificultad baja (Memoria Afro y Sabor Afro) son las más cómodas para ir con niños.');

  return { dias: planDias, experiencias: exps.slice(0, 2), eventos, consejos };
}

function itinerarioATexto(it) {
  const partes = [];
  it.dias.forEach((d) => {
    partes.push(`${it.dias.length > 1 ? `**Día ${d.dia} – ${d.titulo}**` : `**${d.titulo}**`}`);
    d.paradas.forEach((p) => partes.push(`• ${p.hora} — ${p.nombre}: ${p.detalle}`));
  });
  if (it.experiencias.length) partes.push(`\nPara completar tu visita puedes reservar: ${it.experiencias.map((x) => `${x.tit} (${x.pre}, ${x.dur}, con ${x.guia})`).join(' o ')}.`);
  if (it.eventos.length) partes.push(`En esas fechas hay agenda: ${it.eventos.map((e) => `${e.titulo} (${e.fecha})`).join('; ')}.`);
  partes.push(`\n💡 ${it.consejos[0]}`);
  return partes.join('\n');
}

module.exports = { generarItinerario, itinerarioATexto };
