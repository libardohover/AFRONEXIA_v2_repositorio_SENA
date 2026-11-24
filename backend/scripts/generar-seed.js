/**
 * Genera database/seed.sql a partir de database/seed/catalogo.json.
 * Uso: npm run db:seed-sql
 *
 * catalogo.json es la ÚNICA fuente de los datos de ejemplo: la usan
 * la base de datos (seed.sql), el agente NEXIA (respaldo sin BD) y el
 * frontend (respaldo sin backend, copia en frontend/src/data).
 */
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const ROOT = path.resolve(__dirname, '..', '..');
const catalogo = JSON.parse(fs.readFileSync(path.join(ROOT, 'database', 'seed', 'catalogo.json'), 'utf8'));

const DEMO_PASSWORD = 'Afronexia2026*';
const usuarios = [
  { id: 1, nombre: 'Admin General', email: 'admin@afronexia.com', rol: 'administrador' },
  { id: 2, nombre: 'Doña Chava', email: 'chava@gastronomia.com', rol: 'emprendedor' },
  { id: 3, nombre: 'Don Emiro Mosquera', email: 'emiro@cultura.org', rol: 'gestor_cultural' },
  { id: 4, nombre: 'Visitante Demo', email: 'visitante@afronexia.com', rol: 'visitante' },
];

const raw = (sql) => ({ raw: sql });
const userRef = (email) => raw(`(SELECT id FROM usuarios WHERE email = '${email}')`);
const q = (v) => {
  if (v && v.raw) return v.raw;
  if (v === null || v === undefined || v === '') return 'NULL';
  if (typeof v === 'number') return String(v);
  return "'" + String(v).replace(/'/g, "''") + "'";
};
const row = (vals) => '(' + vals.map(q).join(', ') + ')';
const insert = (tabla, cols, filas) =>
  `INSERT INTO ${tabla} (${cols.join(', ')}) VALUES\n  ${filas.map(row).join(',\n  ')}\nON CONFLICT (id) DO NOTHING;\n`;

const hash = bcrypt.hashSync(DEMO_PASSWORD, 10);
const out = [];
out.push('-- =====================================================================');
out.push('-- AFRONEXIA - Datos de ejemplo (GENERADO por backend/scripts/generar-seed.js)');
out.push('-- No editar a mano: modificar database/seed/catalogo.json y regenerar.');
out.push(`-- Usuarios demo: contraseña "${DEMO_PASSWORD}" (cámbienla en producción).`);
out.push('-- =====================================================================\n');

// Usuarios: si ya existen (BD v1 con hashes falsos) se actualiza el hash para que el login funcione.
out.push(`INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES\n  ${usuarios
  .map((u) => row([u.nombre, u.email, hash, u.rol])).join(',\n  ')}\nON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash WHERE usuarios.password_hash NOT LIKE '$2%' OR length(usuarios.password_hash) < 50;\n`);

out.push(insert('lugares', ['id', 'nombre', 'categoria', 'descripcion', 'direccion', 'horario', 'telefono', 'imagen_url', 'lat', 'lng'],
  catalogo.lugares.map((l) => [l.id, l.nombre, l.categoria, l.desc, l.dir, l.horario, l.tel, l.img, l.lat, l.lng])));

// El emprendimiento 6 (Doña Chava) queda enlazado a su usuario emprendedor.
out.push(insert('emprendimientos', ['id', 'usuario_id', 'nombre', 'titular', 'categoria', 'descripcion', 'ubicacion', 'telefono_contacto', 'redes_sociales', 'email_contacto', 'precio', 'imagen_url'],
  catalogo.emprendimientos.map((e) => [e.id, e.email === 'chava@gastronomia.com' ? userRef('chava@gastronomia.com') : null, e.nombre, e.titular, e.categoria, e.desc, e.barrio, e.tel, e.social, e.email, e.precio, e.img])));

out.push(insert('contenidos_culturales', ['id', 'autor_id', 'titulo', 'subtitulo', 'categoria', 'contenido', 'portador', 'imagen_url'],
  catalogo.saberes.map((s) => [s.id, userRef('emiro@cultura.org'), s.titulo, s.subtitulo, s.categoria, s.texto, s.portador, s.img])));

out.push(insert('eventos', ['id', 'organizador_id', 'titulo', 'tipo', 'descripcion', 'lugar', 'fecha_inicio', 'organizador_nombre', 'imagen_url', 'lat', 'lng'],
  catalogo.eventos.map((e) => [e.id, userRef('emiro@cultura.org'), e.titulo, e.tipo, e.desc, e.lugar, e.fecha_iso.replace('T', ' '), e.organ, e.img, e.lat, e.lng])));

out.push(insert('rutas', ['id', 'etiqueta', 'titulo', 'descripcion', 'duracion', 'duracion_horas', 'dificultad', 'cupo', 'lat', 'lng', 'zoom'],
  catalogo.rutas.map((r) => [r.id, r.tag, r.titulo, r.desc, r.duracion, r.horas, r.dificultad, r.cupo, r.lat, r.lng, r.zoom])));

let paradaId = 1;
const paradas = [];
catalogo.rutas.forEach((r) => r.paradas.forEach((p) => paradas.push([paradaId++, r.id, p.num, p.nombre, p.detalle, p.tiempo, p.minutos])));
out.push(insert('ruta_paradas', ['id', 'ruta_id', 'orden', 'nombre', 'detalle', 'tiempo', 'minutos'], paradas));

out.push(insert('experiencias', ['id', 'titulo', 'descripcion', 'precio', 'duracion', 'cupo_max', 'guia', 'lugar'],
  catalogo.experiencias.map((x) => [x.id, x.tit, x.desc, x.precio, x.dur, x.cupo_max, x.guia, x.lug])));

// Ajustar secuencias para que los próximos INSERT no choquen con los ids de la semilla.
['lugares', 'emprendimientos', 'contenidos_culturales', 'eventos', 'rutas', 'ruta_paradas', 'experiencias'].forEach((t) => {
  out.push(`SELECT setval(pg_get_serial_sequence('${t}', 'id'), GREATEST((SELECT COALESCE(MAX(id), 1) FROM ${t}), 1));`);
});

const destino = path.join(ROOT, 'database', 'seed.sql');
fs.writeFileSync(destino, out.join('\n') + '\n');

// Copia para el respaldo offline del frontend.
const copiaFront = path.join(ROOT, 'frontend', 'src', 'data', 'catalogo.json');
fs.mkdirSync(path.dirname(copiaFront), { recursive: true });
fs.copyFileSync(path.join(ROOT, 'database', 'seed', 'catalogo.json'), copiaFront);

console.log('✅ Generado', destino);
console.log('✅ Copiado catálogo a', copiaFront);
