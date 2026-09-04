const API_URL = 'http://localhost:5000/api/v1';

const verde = '\x1b[32m';
const rojo = '\x1b[31m';
const cyan = '\x1b[36m';
const amarillo = '\x1b[33m';
const reset = '\x1b[0m';

async function ejecutarPruebas() {
  console.log(`\n${cyan}====================================================${reset}`);
  console.log(`${cyan}   INICIANDO PRUEBAS CRUD - SISTEMA AFRONEXIA       ${reset}`);
  console.log(`${cyan}====================================================\n${reset}`);

  let exitos = 0;
  let fallos = 0;

  async function test(nombre, url, metodo, datos = null) {
    try {
      const opciones = {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
      };
      if (datos) opciones.body = JSON.stringify(datos);

      const respuesta = await fetch(url, opciones);
      const resultado = await respuesta.json();

      if (respuesta.ok) {
        console.log(`${verde} [OK] ${nombre}${reset}`);
        exitos++;
        return resultado;
      } else {
        console.log(`${rojo} [FALLO] ${nombre} -> Error: ${JSON.stringify(resultado)}${reset}`);
        fallos++;
        return null;
      }
    } catch (error) {
      console.log(`${rojo} [ERROR DE CONEXIÓN] ${nombre} -> ${error.message}${reset}`);
      fallos++;
      return null;
    }
  }

  // 1. EMPRENDEDOR
  console.log(`${amarillo}--- 1. PROBANDO ROL: EMPRENDEDOR ---${reset}`);
  await test('Crear Emprendimiento Gastronómico', `${API_URL}/emprendimientos`, 'POST', {
    usuario_id: 2,
    nombre: 'Cocadas y Dulces Ancestrales Doña Flor',
    categoria: 'Gastronomía',
    descripcion: 'Dulces tradicionales de coco, papaya y corozo.',
    ubicacion: 'Sector Muelle Fluvial, Barrancabermeja',
    telefono_contacto: '+573123456789'
  });
  await test('Consultar Lista de Emprendimientos', `${API_URL}/emprendimientos`, 'GET');

  // 2. GESTOR CULTURAL
  console.log(`\n${amarillo}--- 2. PROBANDO ROL: GESTOR CULTURAL ---${reset}`);
  await test('Publicar Saber Cultural / Tradición Oral', `${API_URL}/contenidos`, 'POST', {
    autor_id: 1,
    titulo: 'Historia de los Tambores en el Río',
    categoria: 'Tradición Oral',
    contenido: 'Reseña sobre la influencia afrodescendiente en la música ribereña.'
  });
  await test('Publicar Evento Folclórico', `${API_URL}/eventos`, 'POST', {
    organizador_id: 1,
    titulo: 'Gran Encuentro de Tambora',
    descripcion: 'Presentaciones folclóricas afrocolombianas.',
    lugar: 'Parque Infantil, Barrancabermeja',
    fecha_inicio: '2026-11-20 17:00:00',
    fecha_fin: '2026-11-20 22:00:00'
  });
  await test('Consultar Agenda de Eventos', `${API_URL}/eventos`, 'GET');

  // 3. VISITANTE
  console.log(`\n${amarillo}--- 3. PROBANDO ROL: VISITANTE / TURISTA ---${reset}`);
  await test('Enviar Mensaje de Contacto a Emprendedor', `${API_URL}/mensajes`, 'POST', {
    usuario_id: 1,
    emprendimiento_id: 1,
    mensaje: 'Hola Doña Chava, ¿qué horarios de atención tienen?'
  });
  await test('Registrar Valoración (5 Estrellas)', `${API_URL}/valoraciones`, 'POST', {
    usuario_id: 1,
    entidad_tipo: 'emprendimiento',
    entidad_id: 1,
    puntuacion: 5,
    comentario: 'Excelente pescado frito y atención.'
  });
  await test('Guardar en Favoritos', `${API_URL}/favoritos`, 'POST', {
    usuario_id: 1,
    entidad_tipo: 'emprendimiento',
    entidad_id: 1
  });

  // 4. ADMINISTRADOR
  console.log(`\n${amarillo}--- 4. PROBANDO ROL: ADMINISTRADOR ---${reset}`);
  await test('Registrar Acción de Auditoría', `${API_URL}/auditoria`, 'POST', {
    usuario_id: 1,
    accion: 'Aprobación de contenido cultural',
    modulo: 'Gestión Cultural',
    detalles: { estado: 'Aprobado', ip: '127.0.0.1' }
  });
  await test('Consultar Logs de Auditoría', `${API_URL}/auditoria`, 'GET');
  await test('Consultar Logs de IA', `${API_URL}/ai-logs`, 'GET');

  // 5. ASISTENTE IA
  console.log(`\n${amarillo}--- 5. PROBANDO ASISTENTE INTELIGENTE (NEXIA IA) ---${reset}`);
  const respuestaIA = await test('Consultar Asistente NEXIA vía API', `${API_URL}/ia/chat`, 'POST', {
    mensaje: '¿Dónde comer pescado frito en Barrancabermeja?'
  });

  if (respuestaIA) {
    console.log(`\n   💬 ${cyan}Respuesta de NEXIA IA:${reset}`);
    console.log(`   "${respuestaIA.respuesta}"\n`);
  }

  console.log(`${cyan}====================================================${reset}`);
  console.log(`  RESUMEN DE PRUEBAS: ${verde}${exitos} Exitosas${reset} | ${rojo}${fallos} Fallidas${reset}`);
  console.log(`${cyan}====================================================${reset}\n`);
}

ejecutarPruebas();
