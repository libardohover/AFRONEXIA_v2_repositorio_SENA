import React, { useCallback, useEffect, useState } from 'react';
import { api, formatoCOP } from '../lib/api';

// Campos del formulario de creación por tipo de contenido (claves = forma del catálogo).
const ENTIDADES = {
  lugares: { label: 'Lugares del explorador', singular: 'lugar', titulo: 'nombre', sub: (x) => `${x.categoria} · ${x.dir || ''}`,
    campos: [['nombre', 'Nombre', 'text', true], ['categoria', 'Categoría (Espacio cultural, Sitio natural, Lugar histórico, Gastronomía)', 'text', true], ['dir', 'Dirección', 'text'], ['horario', 'Horario', 'text'], ['tel', 'Contacto', 'text'], ['lat', 'Latitud', 'number'], ['lng', 'Longitud', 'number'], ['img', 'URL de imagen', 'url'], ['desc', 'Descripción', 'textarea']] },
  eventos: { label: 'Agenda cultural', singular: 'evento', titulo: 'titulo', sub: (x) => `${x.fecha || ''} · ${x.lugar}${x.pasado ? ' · finalizado' : ''}`,
    campos: [['titulo', 'Título', 'text', true], ['tipo', 'Tipo (Festival, Taller, Feria…)', 'text'], ['fecha_iso', 'Fecha y hora', 'datetime-local', true], ['lugar', 'Lugar', 'text', true], ['organ', 'Organiza', 'text'], ['img', 'URL de imagen', 'url'], ['desc', 'Descripción', 'textarea']] },
  emprendimientos: { label: 'Directorio de talentos', singular: 'emprendimiento', titulo: 'nombre', sub: (x) => `${x.categoria} · ${x.titular || ''} ${x.precio ? '· ' + formatoCOP(x.precio) : ''}`,
    campos: [['nombre', 'Nombre', 'text', true], ['categoria', 'Categoría', 'text', true], ['titular', 'Titular', 'text'], ['barrio', 'Barrio', 'text'], ['tel', 'WhatsApp (57…)', 'text'], ['email', 'Correo', 'email'], ['precio', 'Precio COP', 'number'], ['img', 'URL de imagen', 'url'], ['desc', 'Descripción', 'textarea']] },
  saberes: { label: 'Archivo de memoria', singular: 'saber', titulo: 'titulo', sub: (x) => `${x.categoria} · ${x.portador || ''}`,
    campos: [['titulo', 'Título', 'text', true], ['categoria', 'Categoría', 'text', true], ['portador', 'Portador/a del saber', 'text'], ['subtitulo', 'Resumen', 'text'], ['img', 'URL de imagen', 'url'], ['texto', 'Relato', 'textarea', true]] },
  experiencias: { label: 'Experiencias turísticas', singular: 'experiencia', titulo: 'tit', sub: (x) => `${x.pre} · ${x.dur} · ${x.guia}`,
    campos: [['tit', 'Título', 'text', true], ['guia', 'Guía', 'text'], ['lug', 'Lugar', 'text'], ['precio', 'Precio por persona', 'number'], ['dur', 'Duración (ej. 3h)', 'text'], ['cupo_max', 'Cupo máximo', 'number'], ['desc', 'Descripción', 'textarea']] },
  rutas: { label: 'Rutas culturales', singular: 'ruta', titulo: 'titulo', sub: (x) => `${x.duracion || ''} · ${(x.paradas || []).length} paradas`,
    campos: [['titulo', 'Título', 'text', true], ['duracion', 'Duración (ej. 4 horas)', 'text'], ['horas', 'Horas (número)', 'number'], ['dificultad', 'Dificultad', 'text'], ['desc', 'Descripción', 'textarea'], ['paradasTexto', 'Paradas (una por línea: Nombre | detalle | minutos)', 'textarea']] },
};

function Kpi({ valor, etiqueta, clase = 'kpi-white' }) {
  return <div className={`kpi-box ${clase}`}><div className="kpi-value">{valor ?? '—'}</div><div className="kpi-label">{etiqueta}</div></div>;
}

function Resumen({ stats }) {
  if (!stats) return <p className="aviso-offline">Cargando indicadores…</p>;
  const max = Math.max(1, ...stats.consultasPorDia.map((d) => d.total));
  return (
    <>
      <div className="kpi-main-grid">
        <Kpi valor={stats.totalRegistros} etiqueta="REGISTROS DEL CATÁLOGO" clase="kpi-green" />
        <Kpi valor={stats.usuarios} etiqueta="USUARIOS" />
        <Kpi valor={stats.reservasPendientes} etiqueta="RESERVAS PENDIENTES" />
        <Kpi valor={stats.eventosProximos} etiqueta="EVENTOS PRÓXIMOS" />
      </div>
      <div className="kpi-breakdown-grid">
        <div className="mini-stat-card"><span>🏛️ Lugares</span> <strong>{stats.lugares}</strong></div>
        <div className="mini-stat-card"><span>📅 Eventos</span> <strong>{stats.eventos}</strong></div>
        <div className="mini-stat-card"><span>🍲 Talentos</span> <strong>{stats.emprendimientos}</strong></div>
        <div className="mini-stat-card"><span>📜 Saberes</span> <strong>{stats.saberes}</strong></div>
        <div className="mini-stat-card"><span>🗺️ Rutas</span> <strong>{stats.rutas}</strong></div>
        <div className="mini-stat-card"><span>🛶 Experiencias</span> <strong>{stats.experiencias}</strong></div>
      </div>

      <h3 className="admin-subtitulo">🤖 Agente NEXIA (RF-19)</h3>
      <div className="kpi-main-grid">
        <Kpi valor={stats.consultasIA} etiqueta="CONSULTAS TOTALES" />
        <Kpi valor={stats.consultasIA7d} etiqueta="ÚLTIMOS 7 DÍAS" />
        <Kpi valor={stats.satisfaccionIA === null ? 'Sin datos' : stats.satisfaccionIA + '%'} etiqueta={`SATISFACCIÓN (👍${stats.feedbackIA.positivas} / 👎${stats.feedbackIA.negativas})`} />
        <Kpi valor={stats.latenciaPromedioMs + ' ms'} etiqueta="TIEMPO DE RESPUESTA" />
      </div>
      <div className="admin-dos-columnas">
        <div className="table-card">
          <h4>Consultas por día</h4>
          <div className="barras">
            {stats.consultasPorDia.map((d) => (
              <div key={d.dia} className="barra-col" title={`${d.dia}: ${d.total}`}>
                <span className="barra-valor">{d.total}</span>
                <div className="barra" style={{ height: `${(d.total / max) * 100}%` }} />
                <small>{d.dia.slice(5)}</small>
              </div>
            ))}
          </div>
        </div>
        <div className="table-card">
          <h4>¿Qué preguntan los visitantes?</h4>
          {stats.intenciones.length ? stats.intenciones.map((i) => (
            <div key={i.intencion} className="fila-intencion">
              <span>{i.intencion.replace('_', ' ')}</span>
              <div className="intencion-barra"><div style={{ width: `${(i.total / stats.consultasIA) * 100}%` }} /></div>
              <strong>{i.total}</strong>
            </div>
          )) : <p className="aviso-offline">Aún no hay consultas.</p>}
        </div>
      </div>
      <div className="table-card">
        <h4>Últimas preguntas a NEXIA</h4>
        <table className="custom-table">
          <thead><tr><th>#</th><th>Pregunta</th><th>Intención</th><th>Modo</th><th>👍/👎</th></tr></thead>
          <tbody>
            {stats.logsRecientes.map((l) => (
              <tr key={l.id}><td>{l.id}</td><td>{l.pregunta}</td><td>{l.intencion}</td><td>{l.modo}</td><td>{l.calificacion === 1 ? '👍' : l.calificacion === -1 ? '👎' : '—'}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-card">
        <h4>Auditoría reciente (RF-20)</h4>
        <table className="custom-table">
          <thead><tr><th>Fecha</th><th>Usuario</th><th>Acción</th><th>Módulo</th></tr></thead>
          <tbody>
            {stats.auditoria.map((a) => (
              <tr key={a.id}><td>{new Date(a.created_at).toLocaleString('es-CO')}</td><td>{a.usuario || '—'}</td><td>{a.accion}</td><td>{a.modulo}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Contenido({ setAviso }) {
  const [entidad, setEntidad] = useState('lugares');
  const [lista, setLista] = useState([]);
  const [form, setForm] = useState(null);
  const conf = ENTIDADES[entidad];

  const cargar = useCallback(async () => {
    try { setLista(await api(`/catalogo/${entidad}?todos=1`)); } catch (e) { setAviso({ tipo: 'error', texto: e.message }); }
  }, [entidad, setAviso]);
  useEffect(() => { cargar(); setForm(null); }, [cargar]);

  const guardar = async (e) => {
    e.preventDefault();
    const cuerpo = { ...form };
    if (entidad === 'rutas' && cuerpo.paradasTexto) {
      cuerpo.paradas = cuerpo.paradasTexto.split('\n').filter(Boolean).map((l) => {
        const [nombre, detalle, minutos] = l.split('|').map((x) => x.trim());
        return { nombre, detalle, minutos: Number(minutos) || 60, tiempo: `${Number(minutos) || 60} MIN` };
      });
      delete cuerpo.paradasTexto;
    }
    try {
      await api(`/catalogo/${entidad}`, { method: 'POST', body: cuerpo });
      setAviso({ tipo: 'ok', texto: `✅ ${conf.singular} publicado. NEXIA ya lo tiene en cuenta.` });
      setForm(null);
      cargar();
    } catch (err) { setAviso({ tipo: 'error', texto: err.message }); }
  };

  const eliminar = async (item) => {
    if (!window.confirm(`¿Eliminar "${item[conf.titulo]}" del sistema?`)) return;
    try { await api(`/catalogo/${entidad}/${item.id}`, { method: 'DELETE' }); cargar(); } catch (err) { setAviso({ tipo: 'error', texto: err.message }); }
  };

  const alternarEstado = async (item) => {
    const estado = item.estado === 'borrador' ? 'publicado' : 'borrador';
    try { await api(`/catalogo/${entidad}/${item.id}`, { method: 'PUT', body: { estado } }); cargar(); } catch (err) { setAviso({ tipo: 'error', texto: err.message }); }
  };

  return (
    <>
      <div className="admin-nav-tabs">
        {Object.keys(ENTIDADES).map((t) => (
          <button key={t} className={entidad === t ? 'crud-tab active' : 'crud-tab'} onClick={() => setEntidad(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
      </div>
      <div className="crud-toolbar">
        <div><h3 className="crud-section-title">{conf.label}</h3><p className="crud-section-count">{lista.length} registros en el sistema</p></div>
        <button className="btn-add-entity" onClick={() => setForm(form ? null : {})}>{form ? '✕ Cancelar' : `+ Nuevo ${conf.singular}`}</button>
      </div>
      {form && (
        <form onSubmit={guardar} className="crud-create-card">
          <h4 className="form-card-title">Publicar nuevo {conf.singular}</h4>
          <div className="form-grid-2">
            {conf.campos.map(([k, label, tipo, req]) => (
              <div key={k} className={'form-field-group' + (tipo === 'textarea' ? ' full-width' : '')}>
                <label>{label}{req ? ' *' : ''}</label>
                {tipo === 'textarea'
                  ? <textarea rows="3" required={req} value={form[k] || ''} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
                  : <input type={tipo} step={tipo === 'number' ? 'any' : undefined} required={req} value={form[k] || ''} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />}
              </div>
            ))}
          </div>
          <div className="form-actions-row"><button type="submit" className="btn-submit-publish">Publicar</button></div>
        </form>
      )}
      <div className="crud-list-wrapper">
        {lista.map((item) => (
          <div key={item.id} className={'crud-row-item' + (item.estado === 'borrador' ? ' borrador' : '')}>
            <div className="crud-item-texto">
              <span className="crud-item-name">{item[conf.titulo]}</span>
              <small>{conf.sub(item)}</small>
            </div>
            <div className="crud-item-acciones">
              <button className="btn-estado" onClick={() => alternarEstado(item)} title="Publicar / pasar a borrador">{item.estado === 'borrador' ? '📝 Borrador' : '✅ Publicado'}</button>
              <button className="btn-trash-action" title="Eliminar del sistema" onClick={() => eliminar(item)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Reservas({ setAviso }) {
  const [lista, setLista] = useState([]);
  const cargar = useCallback(async () => { try { setLista(await api('/reservas')); } catch (e) { setAviso({ tipo: 'error', texto: e.message }); } }, [setAviso]);
  useEffect(() => { cargar(); }, [cargar]);
  const cambiar = async (id, estado) => { try { await api(`/reservas/${id}`, { method: 'PATCH', body: { estado } }); cargar(); } catch (e) { setAviso({ tipo: 'error', texto: e.message }); } };
  return (
    <div className="table-card">
      <h4>Solicitudes de reserva de experiencias</h4>
      {!lista.length ? <p className="aviso-offline">Aún no hay reservas.</p> : (
        <table className="custom-table">
          <thead><tr><th>Experiencia</th><th>Contacto</th><th>Fecha</th><th>Pers.</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            {lista.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.experiencia}</strong><br /><small>Guía: {r.guia}</small></td>
                <td>{r.nombre_contacto}<br /><small>{r.telefono_contacto || ''} {r.email_contacto || ''}</small></td>
                <td>{String(r.fecha_deseada).slice(0, 10)}</td>
                <td>{r.personas}</td>
                <td><span className={'estado-reserva ' + r.estado}>{r.estado}</span></td>
                <td className="acciones-reserva">
                  {r.estado !== 'confirmada' && <button onClick={() => cambiar(r.id, 'confirmada')}>Confirmar</button>}
                  {r.estado !== 'cancelada' && <button onClick={() => cambiar(r.id, 'cancelada')}>Cancelar</button>}
                  {r.telefono_contacto && <button onClick={() => window.open('https://wa.me/' + r.telefono_contacto.replace(/\D/g, ''), '_blank', 'noopener')}>💬</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function Usuarios({ setAviso, yo }) {
  const [lista, setLista] = useState([]);
  const cargar = useCallback(async () => { try { setLista(await api('/usuarios')); } catch (e) { setAviso({ tipo: 'error', texto: e.message }); } }, [setAviso]);
  useEffect(() => { cargar(); }, [cargar]);
  const actualizar = async (id, cambios) => { try { await api(`/usuarios/${id}`, { method: 'PATCH', body: cambios }); cargar(); } catch (e) { setAviso({ tipo: 'error', texto: e.message }); } };
  return (
    <div className="table-card">
      <h4>Usuarios y roles</h4>
      <table className="custom-table">
        <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Último acceso</th><th>Activo</th></tr></thead>
        <tbody>
          {lista.map((u) => (
            <tr key={u.id}>
              <td>{u.nombre}</td><td>{u.email}</td>
              <td>
                <select value={u.rol} disabled={u.id === yo.id} onChange={(e) => actualizar(u.id, { rol: e.target.value })}>
                  {['visitante', 'emprendedor', 'gestor_cultural', 'administrador'].map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </td>
              <td>{u.ultimo_acceso ? new Date(u.ultimo_acceso).toLocaleString('es-CO') : '—'}</td>
              <td><input type="checkbox" checked={u.activo !== false} disabled={u.id === yo.id} onChange={(e) => actualizar(u.id, { activo: e.target.checked })} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminPanelView({ user, setActiveTab, onLogout }) {
  const [seccion, setSeccion] = useState('resumen');
  const [stats, setStats] = useState(null);
  const [aviso, setAviso] = useState(null);
  const esAdmin = user && user.rol === 'administrador';

  useEffect(() => {
    if (!esAdmin || seccion !== 'resumen') return;
    api('/admin/stats').then(setStats).catch((e) => setAviso({ tipo: 'error', texto: e.message }));
  }, [esAdmin, seccion]);

  if (!esAdmin) {
    return (
      <div className="view-container">
        <div className="access-denied-card">
          <div className="denied-icon">🔒</div>
          <h2>Acceso Restringido</h2>
          <p>Este panel es de uso exclusivo para el <strong>Administrador del Sistema</strong>.</p>
          <p className="denied-sub">Inicia sesión con una cuenta de administrador.</p>
          <button className="btn-login-redirect" onClick={() => setActiveTab('login')}>Ir al formulario de ingreso</button>
        </div>
      </div>
    );
  }

  return (
    <div className="view-container">
      <div className="module-header-banner">
        <span className="module-badge-tag">MÓDULO 8</span>
        <h1>Panel administrativo</h1>
        <p>Gestiona el contenido del ecosistema, las reservas y los usuarios, y consulta los indicadores del sistema y del agente NEXIA.</p>
        <small className="user-session-badge">Sesión de Administrador: <strong>{user.email}</strong></small>
      </div>

      <div className="admin-secciones">
        {[['resumen', '📊 Resumen'], ['contenido', '🗂️ Contenido'], ['reservas', '🛶 Reservas'], ['usuarios', '👥 Usuarios']].map(([k, l]) => (
          <button key={k} className={seccion === k ? 'filter-pill active' : 'filter-pill'} onClick={() => { setSeccion(k); setAviso(null); }}>{l}</button>
        ))}
      </div>
      {aviso && <div className={aviso.tipo === 'ok' ? 'alert-success-box' : 'alert-error-box'}>{aviso.texto}</div>}

      <section className="dashboard-stats-section">
        {seccion === 'resumen' && <Resumen stats={stats} />}
        {seccion === 'contenido' && <Contenido setAviso={setAviso} />}
        {seccion === 'reservas' && <Reservas setAviso={setAviso} />}
        {seccion === 'usuarios' && <Usuarios setAviso={setAviso} yo={user} />}
      </section>

      <div className="dashboard-footer-actions-centered">
        <button className="btn-footer-center btn-primary-gray" onClick={() => setActiveTab('inicio')}>🏠 Volver al inicio</button>
        <button className="btn-footer-center btn-danger-red" onClick={onLogout}>🚪 Cerrar sesión</button>
      </div>
    </div>
  );
}
