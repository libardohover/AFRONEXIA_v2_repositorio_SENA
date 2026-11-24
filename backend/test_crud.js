/**
 * Pruebas de humo de la API AFRONEXIA v2.
 * Requiere el backend corriendo (npm run dev) y la BD con init.sql + seed.sql.
 * Uso: npm run test:api
 */
const API = process.env.API_URL || 'http://localhost:5000/api/v1';
const C = { ok: '\x1b[32m', err: '\x1b[31m', info: '\x1b[36m', reset: '\x1b[0m' };
let exitos = 0, fallos = 0;

async function req(metodo, ruta, datos, token) {
  const r = await fetch(API + ruta, {
    method: metodo,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
    body: datos ? JSON.stringify(datos) : undefined,
  });
  let cuerpo = null;
  try { cuerpo = await r.json(); } catch { /* sin cuerpo */ }
  return { status: r.status, cuerpo };
}

async function prueba(nombre, fn, esperado) {
  try {
    const r = await fn();
    const ok = Array.isArray(esperado) ? esperado.includes(r.status) : r.status === esperado;
    if (ok) { exitos++; console.log(`${C.ok} [OK] ${nombre} (${r.status})${C.reset}`); }
    else { fallos++; console.log(`${C.err} [FALLO] ${nombre}: esperado ${esperado}, recibido ${r.status} ${JSON.stringify(r.cuerpo)}${C.reset}`); }
    return r.cuerpo;
  } catch (e) {
    fallos++; console.log(`${C.err} [ERROR] ${nombre}: ${e.message}${C.reset}`);
    return null;
  }
}

(async () => {
  console.log(`${C.info}\n=== PRUEBAS API AFRONEXIA v2 → ${API} ===${C.reset}\n`);
  const sufijo = Date.now();

  await prueba('Salud del sistema', () => req('GET', '/salud'), 200);
  for (const e of ['lugares', 'eventos', 'emprendimientos', 'saberes', 'rutas', 'experiencias']) {
    await prueba(`Catálogo: ${e}`, () => req('GET', `/catalogo/${e}`), 200);
  }

  await prueba('Login con clave incorrecta es rechazado', () => req('POST', '/auth/login', { email: 'admin@afronexia.com', password: 'mala' }), 401);
  const admin = await prueba('Login administrador demo', () => req('POST', '/auth/login', { email: 'admin@afronexia.com', password: 'Afronexia2026*' }), 200);
  const tokAdmin = admin && admin.token;

  await prueba('Estadísticas sin sesión → 401', () => req('GET', '/admin/stats'), 401);
  await prueba('Estadísticas con administrador', () => req('GET', '/admin/stats', null, tokAdmin), 200);
  await prueba('Auto-registro como administrador bloqueado', () => req('POST', '/auth/register', { nombre: 'X', email: `x${sufijo}@t.co`, password: '12345678', rol: 'administrador' }), 403);

  const emp = await prueba('Registro de emprendedor', () => req('POST', '/auth/register', {
    nombre: 'Emprendedora Prueba', email: `emp${sufijo}@t.co`, password: 'Clave12345', rol: 'emprendedor',
    negocio_nombre: 'Dulces Prueba', negocio_categoria: 'Gastronomía', telefono: '573000000000',
  }), 201);
  const tokEmp = emp && emp.token;

  const nuevo = await prueba('Emprendedor publica producto', () => req('POST', '/catalogo/emprendimientos', { nombre: 'Cocadas prueba', categoria: 'Gastronomía', desc: 'Cocadas de coco', precio: 5000 }, tokEmp), 201);
  await prueba('Emprendedor no puede borrar lo ajeno', () => req('DELETE', '/catalogo/emprendimientos/2', null, tokEmp), 403);
  await prueba('Emprendedor no puede crear eventos', () => req('POST', '/catalogo/eventos', { titulo: 'x', lugar: 'y', fecha_iso: '2030-01-01T10:00:00' }, tokEmp), 403);
  await prueba('Mejorar descripción con IA', () => req('POST', '/ia/mejorar-descripcion', { nombre: 'Cocadas', categoria: 'Gastronomía', descripcion: 'cocadas de coco hechas en casa' }, tokEmp), 200);
  if (nuevo) await prueba('Emprendedor borra su producto', () => req('DELETE', `/catalogo/emprendimientos/${nuevo.id}`, null, tokEmp), 200);

  const ev = await prueba('Admin crea evento', () => req('POST', '/catalogo/eventos', { titulo: 'Evento de prueba', tipo: 'Taller Formativo', lugar: 'Casa de la Cultura', fecha_iso: '2030-05-01T10:00:00' }, tokAdmin), 201);
  if (ev) await prueba('Admin elimina evento', () => req('DELETE', `/catalogo/eventos/${ev.id}`, null, tokAdmin), 200);

  const gestor = await prueba('Login gestor cultural demo', () => req('POST', '/auth/login', { email: 'emiro@cultura.org', password: 'Afronexia2026*' }), 200);
  const tokGestor = gestor && gestor.token;
  const saber = await prueba('Gestor publica un saber', () => req('POST', '/catalogo/saberes', { titulo: 'Saber de prueba', categoria: 'Oralidad', texto: 'Relato de prueba' }, tokGestor), 201);
  if (saber) await prueba('Gestor elimina el saber', () => req('DELETE', `/catalogo/saberes/${saber.id}`, null, tokGestor), 200);
  await prueba('Gestor consulta reservas', () => req('GET', '/reservas', null, tokGestor), 200);
  await prueba('Emprendedor no ve reservas ajenas', () => req('GET', '/reservas', null, tokEmp), 403);

  const fecha = new Date(Date.now() + 20 * 864e5).toISOString().slice(0, 10);
  await prueba('Reserva de experiencia', () => req('POST', '/reservas', { experiencia_id: 2, nombre_contacto: 'Turista', telefono_contacto: '3000000000', fecha_deseada: fecha, personas: 1 }), 201);
  await prueba('Reserva sin datos → 400', () => req('POST', '/reservas', { experiencia_id: 2 }), 400);

  const chat = await prueba('NEXIA responde un itinerario', () => req('POST', '/ia/chat', { mensaje: 'Quiero conocer la cultura afro durante una tarde' }), 200);
  if (chat) console.log(`   ↳ intención: ${chat.intencion}, modo: ${chat.modo}, tarjetas: ${chat.tarjetas.length}`);
  await prueba('NEXIA recuerda la sesión', () => req('POST', '/ia/chat', { mensaje: '¿y cuánto cuesta?', sessionId: chat && chat.sessionId }), 200);
  if (chat && chat.logId) await prueba('Calificar respuesta de NEXIA', () => req('POST', '/ia/feedback', { logId: chat.logId, calificacion: 1 }), 200);

  console.log(`\n${C.info}Resultado: ${exitos} exitosas, ${fallos} fallidas${C.reset}\n`);
  process.exit(fallos ? 1 : 0);
})();
