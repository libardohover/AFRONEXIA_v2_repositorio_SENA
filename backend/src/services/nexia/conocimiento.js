/**
 * Base de conocimiento de NEXIA (RAG ligero, sin dependencias externas).
 * Convierte el catálogo en documentos y los recupera con un puntaje
 * tipo BM25 sobre texto normalizado (sin tildes) + sinónimos del territorio.
 */
const catalogo = require('../catalogo.service');

const STOP = new Set(('a al algo algun alguna algunas alguno algunos ante con contra cual cuales de del desde donde el ella ellas ellos en entre era es esa ese eso esta este esto estos estas ha hay la las le les lo los me mi mis muy nos o para pero por que se si sin sobre su sus te tu tus un una uno unos unas y ya yo quiero quisiera puedo puede como hola gracias favor me gustaria saber conocer hacer ver tengo tienen hay ir voy vamos dia dias').split(' '));

// Sinónimos y vocabulario local -> términos que sí aparecen en el catálogo.
const SINONIMOS = {
  comer: ['gastronomia', 'cocina', 'plato', 'sancocho', 'arroz', 'pescado'],
  comida: ['gastronomia', 'cocina', 'plato', 'sancocho', 'arroz', 'pescado'],
  almorzar: ['gastronomia', 'cocina', 'almuerzo', 'mercado'],
  almuerzo: ['gastronomia', 'cocina', 'mercado'],
  restaurante: ['gastronomia', 'cocina', 'fogon'],
  pescado: ['bocachico', 'bagre', 'pesca', 'frito'],
  postre: ['dulces', 'cocadas', 'coco'],
  musica: ['tambor', 'tambora', 'bullerengue', 'percusion', 'canto', 'boga'],
  baile: ['danza', 'bullerengue', 'mapale', 'currulao'],
  bailar: ['danza', 'bullerengue', 'mapale', 'currulao'],
  tambores: ['tambor', 'tambora', 'percusion'],
  artesanias: ['artesania', 'cesteria', 'fibras', 'tambores'],
  comprar: ['artesania', 'emprendimiento', 'precio', 'productos'],
  regalo: ['artesania', 'accesorios', 'turbantes'],
  peinado: ['trenzas', 'trenzado', 'estetica'],
  trenzas: ['trenzado', 'peinados', 'estetica'],
  rio: ['magdalena', 'malecon', 'cienaga', 'lancha', 'boga'],
  lancha: ['rio', 'cienaga', 'boga', 'navegacion'],
  naturaleza: ['cienaga', 'humedal', 'aves', 'rio'],
  aves: ['avistamiento', 'cienaga'],
  historia: ['memoria', 'historico', 'saber', 'relato', 'llegada'],
  leyenda: ['mitos', 'leyendas', 'madre', 'agua'],
  mito: ['mitos', 'leyendas'],
  plantas: ['medicina', 'patio', 'medicinales', 'azotea'],
  medicina: ['plantas', 'patio', 'tradicional'],
  ninos: ['familias', 'infantil', 'jovenes'],
  familia: ['familias', 'infantil'],
  taller: ['talleres', 'formacion', 'aprende'],
  aprender: ['taller', 'talleres', 'aprende'],
};

const normalizar = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9ñ\s]/g, ' ');
const raiz = (w) => (w.length > 5 ? w.replace(/(es|s)$/, '') : w);
function tokens(texto, expandir = false) {
  const base = normalizar(texto).split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));
  if (!expandir) return base.map(raiz);
  const out = [];
  base.forEach((w) => { out.push(w); (SINONIMOS[w] || SINONIMOS[raiz(w)] || []).forEach((s) => out.push(s)); });
  return out.map(raiz);
}

// Convierte cada registro del catálogo en un documento recuperable + tarjeta para la interfaz.
function documentos(cat) {
  const docs = [];
  cat.lugares.forEach((l) => docs.push({
    tipo: 'lugar', id: l.id, titulo: l.nombre, categoria: l.categoria,
    texto: `${l.nombre}. ${l.categoria}. ${l.desc} Dirección: ${l.dir}. Horario: ${l.horario}. Contacto: ${l.tel}.`,
    linea: `**${l.nombre}** (${l.categoria}): ${l.desc || ''} 📍 ${l.dir}, 🕒 ${l.horario}.`,
    tarjeta: { tipo: 'lugar', id: l.id, titulo: l.nombre, subtitulo: l.categoria, detalle: `📍 ${l.dir} · 🕒 ${l.horario}`, img: l.img, lat: l.lat, lng: l.lng, modulo: 'explorador' },
  }));
  cat.eventos.forEach((e) => docs.push({
    tipo: 'evento', id: e.id, titulo: e.titulo, categoria: e.tipo, fecha: e.fecha_iso, pasado: e.pasado,
    texto: `${e.titulo}. ${e.tipo}. ${e.desc} Fecha: ${e.fecha} a las ${e.hora}. Lugar: ${e.lugar}. Organiza: ${e.organ}.`,
    linea: `**${e.titulo}** — ${e.fecha}, ${e.hora}, en ${e.lugar}. ${e.desc || ''}`,
    tarjeta: { tipo: 'evento', id: e.id, titulo: e.titulo, subtitulo: `${e.tipo} · ${e.fecha}`, detalle: `📍 ${e.lugar} · 🕒 ${e.hora}`, img: e.img, lat: e.lat, lng: e.lng, modulo: 'agenda', pasado: e.pasado },
  }));
  cat.emprendimientos.forEach((m) => docs.push({
    tipo: 'emprendimiento', id: m.id, titulo: m.nombre, categoria: m.categoria,
    texto: `${m.nombre}, emprendimiento de ${m.categoria} de ${m.titular}. ${m.desc} Ubicación: ${m.barrio}. Precio desde ${catalogo.formatoCOP(m.precio)} COP. Redes: ${m.social}.`,
    linea: `**${m.nombre}** (${m.categoria}, ${m.titular}): ${m.desc || ''} 📍 ${m.barrio}${m.precio ? `, desde ${catalogo.formatoCOP(m.precio)}` : ''}.`,
    tarjeta: { tipo: 'emprendimiento', id: m.id, titulo: m.nombre, subtitulo: `${m.categoria} · ${m.titular}`, detalle: `📍 ${m.barrio}${m.precio ? ' · desde ' + catalogo.formatoCOP(m.precio) : ''}`, img: m.img, whatsapp: m.tel ? String(m.tel).replace(/\D/g, '') : null, modulo: 'emprendimientos' },
  }));
  cat.saberes.forEach((s) => docs.push({
    tipo: 'saber', id: s.id, titulo: s.titulo, categoria: s.categoria,
    texto: `${s.titulo}. ${s.categoria}. ${s.subtitulo} ${s.texto} Portador/a: ${s.portador}.`,
    linea: `**${s.titulo}**: ${s.texto} (Portador/a del saber: ${s.portador}).`,
    tarjeta: { tipo: 'saber', id: s.id, titulo: s.titulo, subtitulo: `${s.categoria} · ${s.portador}`, detalle: s.subtitulo, img: s.img, modulo: 'memoria' },
  }));
  cat.rutas.forEach((r) => docs.push({
    tipo: 'ruta', id: r.id, titulo: r.titulo, categoria: 'Ruta', horas: r.horas, paradas: r.paradas,
    texto: `${r.titulo}. ${r.desc} Duración ${r.duracion}, ${r.dificultad}. ${r.cupo}. Paradas: ${(r.paradas || []).map((p) => `${p.nombre} (${p.detalle})`).join('; ')}.`,
    linea: `**${r.titulo}** (${r.duracion}, ${r.dificultad}): ${(r.paradas || []).map((p) => p.nombre).join(' → ')}.`,
    tarjeta: { tipo: 'ruta', id: r.id, titulo: r.titulo, subtitulo: `${r.duracion} · ${r.dificultad}`, detalle: (r.paradas || []).map((p) => p.nombre).join(' → '), lat: r.lat, lng: r.lng, modulo: 'rutas' },
  }));
  cat.experiencias.forEach((x) => docs.push({
    tipo: 'experiencia', id: x.id, titulo: x.tit, categoria: 'Experiencia',
    texto: `${x.tit}. ${x.desc || ''} Precio ${x.pre} por persona, duración ${x.dur}, cupo ${x.cup}. Guía: ${x.guia}. Lugar: ${x.lug}.`,
    linea: `**${x.tit}** — ${x.pre} por persona, ${x.dur}, hasta ${x.cupo_max || '?'} personas, con ${x.guia} (${x.lug}). ${x.desc || ''}`,
    tarjeta: { tipo: 'experiencia', id: x.id, titulo: x.tit, subtitulo: `${x.pre} · ${x.dur} · ${x.cup}`, detalle: `👤 ${x.guia} · 📍 ${x.lug}`, modulo: 'experiencias' },
  }));
  return docs;
}

let indice = { t: 0, docs: [], df: new Map(), promedio: 1, fuente: 'local' };

async function construirIndice() {
  if (Date.now() - indice.t < 60 * 1000 && indice.docs.length && indice.version === catalogo.versionActual()) return indice;
  const cat = await catalogo.todo();
  const docs = documentos(cat).map((d) => {
    const toks = tokens(`${d.titulo} ${d.titulo} ${d.categoria} ${d.texto}`);
    const tf = new Map();
    toks.forEach((w) => tf.set(w, (tf.get(w) || 0) + 1));
    return { ...d, tf, largo: toks.length };
  });
  const df = new Map();
  docs.forEach((d) => d.tf.forEach((_, w) => df.set(w, (df.get(w) || 0) + 1)));
  const promedio = docs.reduce((a, d) => a + d.largo, 0) / (docs.length || 1);
  indice = { t: Date.now(), version: catalogo.versionActual(), docs, df, promedio, fuente: cat.fuente, catalogo: cat };
  return indice;
}

/**
 * Recupera los documentos más relevantes para una consulta.
 * @param {string} consulta
 * @param {{k?: number, tipos?: string[]}} opciones
 */
async function buscar(consulta, { k = 6, tipos = null } = {}) {
  const idx = await construirIndice();
  const q = tokens(consulta, true);
  const N = idx.docs.length;
  const k1 = 1.4, b = 0.75;
  const resultados = idx.docs
    .filter((d) => !tipos || tipos.includes(d.tipo))
    .map((d) => {
      let s = 0;
      q.forEach((w) => {
        const f = d.tf.get(w);
        if (!f) return;
        const idf = Math.log(1 + (N - idx.df.get(w) + 0.5) / (idx.df.get(w) + 0.5));
        s += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * d.largo) / idx.promedio)));
      });
      return { doc: d, score: s };
    })
    .filter((r) => r.score > 0)
    .sort((a, b2) => b2.score - a.score)
    .slice(0, k);
  return resultados.map((r) => r.doc);
}

async function porTipo(tipo) {
  const idx = await construirIndice();
  return idx.docs.filter((d) => d.tipo === tipo);
}

// Quita duplicados del mismo nombre (p. ej. un sitio que también es emprendimiento).
function sinDuplicados(docs) {
  const vistos = new Set();
  return docs.filter((d) => { const k = normalizar(d.titulo).trim(); if (vistos.has(k)) return false; vistos.add(k); return true; });
}

module.exports = { sinDuplicados, buscar, porTipo, construirIndice, normalizar, tokens };
