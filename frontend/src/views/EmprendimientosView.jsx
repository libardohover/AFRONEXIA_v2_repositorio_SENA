import React, { useState } from 'react';
import useCatalogo from '../hooks/useCatalogo';
import CampoGuiado from '../components/CampoGuiado';
import { api, formatoCOP } from '../lib/api';

const IMG_DEFECTO = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80';
const CATEGORIAS = ['Gastronomía', 'Artesanía', 'Estética ancestral', 'Música tradicional', 'Turismo comunitario'];
const VACIO = { nombre: '', categoria: 'Gastronomía', desc: '', barrio: '', social: '', tel: '', email: '', precio: '', img: '' };

export default function EmprendimientosView({ user, setActiveTab }) {
  const { datos: lista, recargar, fuente } = useCatalogo('emprendimientos');
  const [showForm, setShowForm] = useState(false);
  const [nuevo, setNuevo] = useState(VACIO);
  const [filtro, setFiltro] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  const [mejorando, setMejorando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [aviso, setAviso] = useState(null);

  const esEmprendedor = user && (user.rol === 'emprendedor' || user.rol === 'administrador');
  const set = (k) => (e) => setNuevo({ ...nuevo, [k]: e.target.value });

  const visibles = lista
    .filter((x) => filtro === 'Todas' || x.categoria === filtro)
    .filter((x) => !busqueda || `${x.nombre} ${x.desc} ${x.titular} ${x.barrio}`.toLowerCase().includes(busqueda.toLowerCase()));

  const mejorarConIA = async () => {
    if (nuevo.desc.trim().length < 5) { setAviso({ tipo: 'error', texto: 'Escribe primero una o dos frases sobre tu producto; NEXIA las mejora.' }); return; }
    setMejorando(true);
    setAviso(null);
    try {
      const r = await api('/ia/mejorar-descripcion', { method: 'POST', body: { nombre: nuevo.nombre, categoria: nuevo.categoria, descripcion: nuevo.desc, ubicacion: nuevo.barrio } });
      setNuevo((n) => ({ ...n, desc: r.descripcion }));
      setAviso({ tipo: 'ok', texto: '✨ NEXIA mejoró tu descripción. Revísala y ajústala si algo no es exacto.' });
    } catch (e) {
      setAviso({ tipo: 'error', texto: e.message });
    } finally {
      setMejorando(false);
    }
  };

  const handlePublicar = async (e) => {
    e.preventDefault();
    const tel = nuevo.tel.replace(/\D/g, '');
    if (tel.length < 10) { setAviso({ tipo: 'error', texto: 'Revisa el WhatsApp: escribe 57 y tu número, solo dígitos (ej. 573001234567).' }); return; }
    setGuardando(true);
    setAviso(null);
    try {
      await api('/catalogo/emprendimientos', { method: 'POST', body: { ...nuevo, tel, precio: Number(nuevo.precio) || null, img: nuevo.img || IMG_DEFECTO } });
      await recargar();
      setNuevo(VACIO);
      setShowForm(false);
      setAviso({ tipo: 'ok', texto: '✅ ¡Tu producto fue publicado en el catálogo! NEXIA ya puede recomendarlo.' });
    } catch (err) {
      setAviso({ tipo: 'error', texto: err.message });
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (item) => {
    if (!window.confirm(`¿Eliminar "${item.nombre}" del catálogo?`)) return;
    try {
      await api(`/catalogo/emprendimientos/${item.id}`, { method: 'DELETE' });
      await recargar();
    } catch (err) {
      setAviso({ tipo: 'error', texto: err.message });
    }
  };

  const puedeEditar = (item) => user && (user.rol === 'administrador' || (user.rol === 'emprendedor' && item.usuario_id === user.id));

  return (
    <div className="view-container">
      <div className="module-header-banner">
        <span className="module-badge-tag">MÓDULO 4</span>
        <h1>Talentos y emprendimientos</h1>
        <p>El componente económico del ecosistema: perfiles con historia, productos, precios, WhatsApp y contacto por correo electrónico.</p>
      </div>

      <div className="emprendedor-action-bar">
        {esEmprendedor ? (
          <div className="emp-authenticated-box">
            <span>👋 Hola <strong>{user.nombre}</strong>. Puedes publicar y gestionar tus productos.</span>
            <div className="emp-botones">
              <button className="btn-guia-link" onClick={() => setActiveTab('guia-emprendedor')}>📘 Guía paso a paso</button>
              <button className="btn-emp-new" onClick={() => { setShowForm(!showForm); setAviso(null); }}>
                {showForm ? '✕ Cerrar formulario' : '+ Publicar mi Producto / Plato'}
              </button>
            </div>
          </div>
        ) : (
          <div className="emp-guest-box">
            <span>¿Eres emprendedor/a afrodescendiente de Barrancabermeja?</span>
            <div className="emp-botones">
              <button className="btn-guia-link" onClick={() => setActiveTab('guia-emprendedor')}>📘 Cómo registrarme (guía)</button>
              <button className="btn-guest-login" onClick={() => setActiveTab('login')}>Inicia sesión como Emprendedor para subir tus productos</button>
            </div>
          </div>
        )}
      </div>

      {aviso && <div className={aviso.tipo === 'ok' ? 'alert-success-box' : 'alert-error-box'}>{aviso.texto}</div>}

      {showForm && esEmprendedor && (
        <form onSubmit={handlePublicar} className="emp-form-upload">
          <h3>Publicar Nuevo Producto o Experiencia</h3>
          <p className="form-ayuda-intro">Toca <strong>ⓘ ¿Qué escribo aquí?</strong> junto a cada casilla si tienes dudas. Los campos con * son obligatorios.</p>
          <div className="emp-grid-form">
            <CampoGuiado paso="publicacion" clave="nombre" etiqueta="Nombre del Producto / Plato">
              <input type="text" required placeholder="Ej: Arroz de coco con bocachico frito" value={nuevo.nombre} onChange={set('nombre')} maxLength={200} />
            </CampoGuiado>
            <CampoGuiado paso="publicacion" clave="categoria" etiqueta="Categoría">
              <select value={nuevo.categoria} onChange={set('categoria')}>
                {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </CampoGuiado>
            <CampoGuiado paso="publicacion" clave="precio" etiqueta="Precio ($ COP)">
              <input type="number" required min="0" step="500" placeholder="28000" value={nuevo.precio} onChange={set('precio')} />
            </CampoGuiado>
            <CampoGuiado paso="publicacion" clave="email" etiqueta="Correo Electrónico de Contacto">
              <input type="email" required placeholder="tucontacto@gmail.com" value={nuevo.email} onChange={set('email')} />
            </CampoGuiado>
            <CampoGuiado paso="publicacion" clave="tel" etiqueta="Teléfono / WhatsApp">
              <input type="tel" required inputMode="numeric" placeholder="573001234567" value={nuevo.tel} onChange={set('tel')} />
            </CampoGuiado>
            <CampoGuiado paso="publicacion" clave="barrio" etiqueta="Barrio o punto de venta">
              <input type="text" placeholder="Ej: Comuna 7 / Mercado Central" value={nuevo.barrio} onChange={set('barrio')} />
            </CampoGuiado>
            <CampoGuiado paso="publicacion" clave="social" etiqueta="Red social">
              <input type="text" placeholder="@tuemprendimiento" value={nuevo.social} onChange={set('social')} />
            </CampoGuiado>
            <CampoGuiado paso="publicacion" clave="img" etiqueta="URL de la Foto / Imagen">
              <input type="url" placeholder="https://ejemplo.com/foto.jpg" value={nuevo.img} onChange={set('img')} />
            </CampoGuiado>
            <CampoGuiado paso="publicacion" clave="desc" etiqueta="Descripción del Producto" className="full-col">
              <textarea rows="3" required placeholder="Describe los ingredientes, la historia y la preparación…" value={nuevo.desc} onChange={set('desc')} maxLength={800} />
              <button type="button" className="btn-ai-magic" onClick={mejorarConIA} disabled={mejorando}>
                ✨ {mejorando ? 'NEXIA está redactando…' : 'Mejorar con IA'}
              </button>
            </CampoGuiado>
          </div>

          <div className="emp-preview">
            <span className="emp-preview-label">Vista previa de tu tarjeta</span>
            <div className="card-afro with-img emp-preview-card">
              <img src={nuevo.img || IMG_DEFECTO} alt="" className="card-top-img" onError={(e) => { e.target.src = IMG_DEFECTO; }} />
              <div className="card-inner-body">
                <div className="card-badge-row">
                  <span className="card-badge">{nuevo.categoria}</span>
                  {nuevo.precio && <span className="price-badge-green">{formatoCOP(nuevo.precio)} COP</span>}
                </div>
                <h3>{nuevo.nombre || 'Nombre de tu producto'}</h3>
                <div className="titular-text">👤 {user.nombre}</div>
                <p className="card-desc">{nuevo.desc || 'Aquí aparecerá tu descripción.'}</p>
              </div>
            </div>
          </div>

          <button type="submit" className="btn-emp-submit" disabled={guardando}>{guardando ? 'Publicando…' : 'Guardar y Publicar en el Catálogo'}</button>
        </form>
      )}

      <div className="catalogo-toolbar">
        <div className="pill-group">
          {['Todas', ...CATEGORIAS].map((c) => (
            <button key={c} className={filtro === c ? 'filter-pill active' : 'filter-pill'} onClick={() => setFiltro(c)}>{c}</button>
          ))}
        </div>
        <input className="buscador-mini" placeholder="🔍 Buscar emprendimiento…" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
      </div>
      {fuente === 'local' && <p className="aviso-offline">Mostrando el catálogo guardado (sin conexión con el servidor).</p>}

      <div className="cards-grid-afro">
        {visibles.map((item) => (
          <div key={item.id} className="card-afro with-img">
            <img src={item.img || IMG_DEFECTO} alt={item.nombre} className="card-top-img" loading="lazy" onError={(e) => { e.target.src = IMG_DEFECTO; }} />
            <div className="card-inner-body">
              <div className="card-badge-row">
                <span className="card-badge">{item.categoria}</span>
                {item.precio ? <span className="price-badge-green">{formatoCOP(item.precio)} COP</span> : null}
              </div>
              <h3>{item.nombre}</h3>
              {item.titular && <div className="titular-text">👤 {item.titular}</div>}
              <p className="card-desc">{item.desc}</p>
              <div className="card-meta">
                {item.barrio && <div>📍 {item.barrio}</div>}
                {item.social && <div>📸 {item.social}</div>}
              </div>
              <div className="contact-actions-dual">
                {item.tel && (
                  <button className="btn-wpp-direct" onClick={() => window.open('https://wa.me/' + String(item.tel).replace(/\D/g, '') + '?text=' + encodeURIComponent(`Hola, vi "${item.nombre}" en AFRONEXIA y quisiera más información.`), '_blank', 'noopener')}>
                    💬 WhatsApp
                  </button>
                )}
                {item.email && (
                  <button className="btn-email-direct" onClick={() => window.open('mailto:' + item.email + '?subject=' + encodeURIComponent('Consulta sobre ' + item.nombre + ' en AFRONEXIA'), '_blank')}>
                    ✉️ Correo
                  </button>
                )}
              </div>
              {puedeEditar(item) && <button className="btn-eliminar-propio" onClick={() => eliminar(item)}>🗑️ Eliminar publicación</button>}
            </div>
          </div>
        ))}
        {!visibles.length && <p className="aviso-offline">No hay emprendimientos con ese filtro.</p>}
      </div>
    </div>
  );
}
