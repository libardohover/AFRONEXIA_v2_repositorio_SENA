/**
 * Catálogo cultural de AFRONEXIA: lugares, eventos, emprendimientos, saberes,
 * rutas y experiencias. Lee de PostgreSQL y, si la BD no está disponible,
 * usa database/seed/catalogo.json para que el sistema y el agente NEXIA
 * sigan funcionando (modo local).
 *
 * Los objetos se entregan con la misma forma que usan las vistas del
 * frontend (desc, dir, img, tel, ...) para no tener que adaptar cada vista.
 */
const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

const RUTA_JSON = path.resolve(__dirname, '..', '..', '..', 'database', 'seed', 'catalogo.json');
let catalogoLocal = null;
function leerLocal() {
  if (!catalogoLocal) catalogoLocal = JSON.parse(fs.readFileSync(RUTA_JSON, 'utf8'));
  return catalogoLocal;
}

const MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEPT', 'OCT', 'NOV', 'DIC'];
const MESES_LARGO = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

// Completa los campos de presentación de un evento a partir de su fecha ISO.
function decorarEvento(e) {
  const d = new Date(e.fecha_iso);
  if (isNaN(d)) return e;
  const h = d.getHours();
  const hora = `${String(((h + 11) % 12) + 1).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
  return {
    ...e,
    dia: String(d.getDate()).padStart(2, '0'),
    mes: MESES[d.getMonth()],
    fecha: `${d.getDate()} de ${MESES_LARGO[d.getMonth()]} de ${d.getFullYear()}`,
    hora,
    pasado: d < new Date(),
  };
}

const formatoCOP = (n) => (n || n === 0 ? '$' + Number(n).toLocaleString('es-CO') : '');

/**
 * Definición de cada entidad:
 *  - tabla y SELECT con alias a la forma del frontend
 *  - campos: clave del frontend -> columna de la BD (para crear/editar)
 *  - roles que pueden escribir
 */
const ENTIDADES = {
  lugares: {
    tabla: 'lugares',
    select: `SELECT id, categoria, nombre, descripcion AS "desc", direccion AS dir, horario, telefono AS tel,
             imagen_url AS img, lat::float, lng::float, estado FROM lugares`,
    orden: 'id',
    campos: { nombre: 'nombre', categoria: 'categoria', desc: 'descripcion', dir: 'direccion', horario: 'horario', tel: 'telefono', img: 'imagen_url', lat: 'lat', lng: 'lng', estado: 'estado' },
    requeridos: ['nombre', 'categoria'],
    roles: ['administrador', 'gestor_cultural'],
  },
  eventos: {
    tabla: 'eventos',
    select: `SELECT id, tipo, titulo, descripcion AS "desc", to_char(fecha_inicio, 'YYYY-MM-DD"T"HH24:MI:SS') AS fecha_iso,
             lugar, organizador_nombre AS organ, imagen_url AS img, lat::float, lng::float, estado FROM eventos`,
    orden: 'fecha_inicio',
    campos: { titulo: 'titulo', tipo: 'tipo', desc: 'descripcion', fecha_iso: 'fecha_inicio', lugar: 'lugar', organ: 'organizador_nombre', img: 'imagen_url', lat: 'lat', lng: 'lng', estado: 'estado' },
    requeridos: ['titulo', 'lugar', 'fecha_iso'],
    roles: ['administrador', 'gestor_cultural'],
    autor: 'organizador_id',
    decorar: decorarEvento,
  },
  emprendimientos: {
    tabla: 'emprendimientos',
    select: `SELECT id, usuario_id, categoria, nombre, titular, descripcion AS "desc", ubicacion AS barrio, redes_sociales AS social,
             telefono_contacto AS tel, email_contacto AS email, precio::float, imagen_url AS img, estado FROM emprendimientos`,
    orden: 'id',
    campos: { nombre: 'nombre', categoria: 'categoria', titular: 'titular', desc: 'descripcion', barrio: 'ubicacion', social: 'redes_sociales', tel: 'telefono_contacto', email: 'email_contacto', precio: 'precio', img: 'imagen_url', estado: 'estado' },
    requeridos: ['nombre', 'categoria'],
    roles: ['administrador', 'emprendedor'],
    autor: 'usuario_id',
    soloPropios: ['emprendedor'],
  },
  saberes: {
    tabla: 'contenidos_culturales',
    select: `SELECT id, categoria, titulo, subtitulo, contenido AS texto, portador, imagen_url AS img, estado FROM contenidos_culturales`,
    orden: 'id',
    campos: { titulo: 'titulo', categoria: 'categoria', subtitulo: 'subtitulo', texto: 'contenido', portador: 'portador', img: 'imagen_url', estado: 'estado' },
    requeridos: ['titulo', 'categoria', 'texto'],
    roles: ['administrador', 'gestor_cultural'],
    autor: 'autor_id',
  },
  rutas: {
    tabla: 'rutas',
    select: `SELECT r.id, r.etiqueta AS tag, r.titulo, r.descripcion AS "desc", r.duracion, r.duracion_horas::float AS horas,
             r.dificultad, r.cupo, r.lat::float, r.lng::float, r.zoom, r.estado,
             COALESCE((SELECT json_agg(json_build_object('num', p.orden, 'nombre', p.nombre, 'detalle', p.detalle, 'tiempo', p.tiempo, 'minutos', p.minutos) ORDER BY p.orden)
                       FROM ruta_paradas p WHERE p.ruta_id = r.id), '[]') AS paradas
             FROM rutas r`,
    orden: 'id',
    campos: { tag: 'etiqueta', titulo: 'titulo', desc: 'descripcion', duracion: 'duracion', horas: 'duracion_horas', dificultad: 'dificultad', cupo: 'cupo', lat: 'lat', lng: 'lng', zoom: 'zoom', estado: 'estado' },
    requeridos: ['titulo'],
    roles: ['administrador', 'gestor_cultural'],
  },
  experiencias: {
    tabla: 'experiencias',
    select: `SELECT id, titulo AS tit, descripcion AS "desc", precio::float, duracion AS dur, cupo_max, guia, lugar AS lug, estado FROM experiencias`,
    orden: 'id',
    campos: { tit: 'titulo', desc: 'descripcion', precio: 'precio', dur: 'duracion', cupo_max: 'cupo_max', guia: 'guia', lug: 'lugar', estado: 'estado' },
    requeridos: ['tit'],
    roles: ['administrador', 'emprendedor', 'gestor_cultural'],
    decorar: (x) => ({ ...x, pre: formatoCOP(x.precio), cup: x.cupo_max ? `${x.cupo_max} pers.` : '' }),
  },
};

// Pequeña caché en memoria para no consultar la BD en cada mensaje del agente.
const cache = new Map();
const TTL = 60 * 1000;
let version = 0; // la base de conocimiento de NEXIA se reconstruye cuando cambia
function invalidar(entidad) {
  if (entidad) { cache.delete(entidad); cache.delete(entidad + ':todo'); } else cache.clear();
  version++;
}
const versionActual = () => version;

async function listar(entidad, { incluirBorradores = false } = {}) {
  const def = ENTIDADES[entidad];
  if (!def) return null;
  const clave = entidad + (incluirBorradores ? ':todo' : '');
  const c = cache.get(clave);
  if (c && Date.now() - c.t < TTL) return c.v;

  let datos;
  let fuente = 'bd';
  if (await pool.disponible()) {
    const pre = entidad === 'rutas' ? 'r.' : '';
    const where = incluirBorradores ? '' : ` WHERE COALESCE(${pre}estado, 'publicado') = 'publicado'`;
    const { rows } = await pool.query(`${def.select}${where} ORDER BY ${pre}${def.orden}`);
    datos = rows;
  } else {
    datos = leerLocal()[entidad] || [];
    fuente = 'local';
  }
  if (def.decorar) datos = datos.map(def.decorar);
  const v = { datos, fuente };
  cache.set(clave, { v, t: Date.now() });
  return v;
}

async function obtener(entidad, id) {
  const r = await listar(entidad, { incluirBorradores: true });
  return r ? r.datos.find((x) => String(x.id) === String(id)) || null : null;
}

async function todo() {
  const out = {};
  let fuente = 'bd';
  for (const e of Object.keys(ENTIDADES)) {
    const r = await listar(e);
    out[e] = r.datos;
    if (r.fuente === 'local') fuente = 'local';
  }
  return { ...out, fuente };
}

// Convierte el cuerpo (forma frontend) en columnas válidas, descartando lo desconocido.
function aColumnas(entidad, cuerpo) {
  const def = ENTIDADES[entidad];
  const cols = {};
  for (const [k, col] of Object.entries(def.campos)) {
    if (cuerpo[k] !== undefined) cols[col] = cuerpo[k] === '' ? null : cuerpo[k];
    else if (cuerpo[col] !== undefined) cols[col] = cuerpo[col] === '' ? null : cuerpo[col];
  }
  return cols;
}

module.exports = { versionActual, ENTIDADES, listar, obtener, todo, aColumnas, invalidar, leerLocal, decorarEvento, formatoCOP };
