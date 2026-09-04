import React, { useState } from 'react';

export default function AdminPanelView({ user, setActiveTab, onLogout }) {
  if (!user || user.rol !== 'administrador') {
    return (
      <div className="view-container">
        <div className="access-denied-card">
          <div className="denied-icon">🔒</div>
          <h2>Acceso Restringido</h2>
          <p>Este panel es de uso exclusivo para el <strong>Administrador del Sistema</strong>.</p>
          <p className="denied-sub">Por favor inicia sesión con tus credenciales de administrador (ej: admin@afronexia.com).</p>
          <button className="btn-login-redirect" onClick={() => setActiveTab('login')}>Ir al formulario de ingreso</button>
        </div>
      </div>
    );
  }

  const [activeSubTab, setActiveSubTab] = useState('lugares');
  const [showAddForm, setShowAddForm] = useState(false);

  const [lugares, setLugares] = useState([
    'Malecón del Río Magdalena', 'Casa de la Cultura Piedra del Sol', 'Comuna 7 – Territorio Tambó',
    'Ciénaga San Silvestre', 'Mercado Central – Fogón Afro', 'Parque Infantil y Plaza del Tambor'
  ]);
  const [eventos, setEventos] = useState([
    'Festival de Tambores del Magdalena Medio', 'Taller de danza afro para jóvenes',
    'Feria de emprendimientos afro', 'Encuentro de sabedores y sabedoras', 'Noche de cocinas tradicionales'
  ]);
  const [talentos, setTalentos] = useState([
    'Sabores de Aminta', 'Grupo Tambó del Magdalena Medio', 'Trenzas y Raíces', 'Artesanías Río Grande', 'Ecoturismo Boga'
  ]);
  const [saberes, setSaberes] = useState([
    'El canto de boga en el Magdalena', 'Arroz de coco: memoria del Pacífico en el río',
    'Medicina de patio: plantas que curan', 'La leyenda de la Madre de Agua', 'El trenzado como mapa de libertad'
  ]);
  const [experiencias, setExperiencias] = useState([
    'Una tarde con los saberes del río', 'Taller de tambor y danza afro', 'Cocina de fogón: arroz de coco', 'Trenzado y memoria'
  ]);
  const [rutas, setRutas] = useState([
    'Ruta de la Memoria Afro', 'Ruta del Río y los Saberes', 'Ruta del Sabor Afro'
  ]);

  const [formData, setFormData] = useState({ nombre: '', categoria: '', direccion: '', horario: '', contacto: '', descripcion: '' });

  const totalRegistros = lugares.length + eventos.length + talentos.length + saberes.length + rutas.length + experiencias.length;

  const handleAgregar = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return;

    if (activeSubTab === 'lugares') setLugares([...lugares, formData.nombre]);
    if (activeSubTab === 'eventos') setEventos([...eventos, formData.nombre]);
    if (activeSubTab === 'talentos') setTalentos([...talentos, formData.nombre]);
    if (activeSubTab === 'saberes') setSaberes([...saberes, formData.nombre]);
    if (activeSubTab === 'experiencias') setExperiencias([...experiencias, formData.nombre]);

    setFormData({ nombre: '', categoria: '', direccion: '', horario: '', contacto: '', descripcion: '' });
    setShowAddForm(false);
    alert('✅ Registro guardado y publicado exitosamente en la base de datos.');
  };

  const handleEliminar = (index) => {
    if (confirm('¿Deseas eliminar este registro del sistema?')) {
      if (activeSubTab === 'lugares') setLugares(lugares.filter((_, i) => i !== index));
      if (activeSubTab === 'eventos') setEventos(eventos.filter((_, i) => i !== index));
      if (activeSubTab === 'talentos') setTalentos(talentos.filter((_, i) => i !== index));
      if (activeSubTab === 'saberes') setSaberes(saberes.filter((_, i) => i !== index));
      if (activeSubTab === 'experiencias') setExperiencias(experiencias.filter((_, i) => i !== index));
    }
  };

  const getConfigTab = () => {
    switch (activeSubTab) {
      case 'lugares': return { lista: lugares, label: 'Lugares del explorador', singular: 'lugar' };
      case 'eventos': return { lista: eventos, label: 'Agenda cultural', singular: 'evento' };
      case 'talentos': return { lista: talentos, label: 'Directorio de talentos', singular: 'emprendimiento' };
      case 'saberes': return { lista: saberes, label: 'Archivo de memoria', singular: 'saber' };
      case 'experiencias': return { lista: experiencias, label: 'Experiencias turísticas', singular: 'experiencia' };
      default: return { lista: lugares, label: 'Lugares del explorador', singular: 'lugar' };
    }
  };

  const currentConfig = getConfigTab();

  return (
    <div className="view-container">
      <div className="module-header-banner">
        <span className="module-badge-tag">MÓDULO 8</span>
        <h1>Panel administrativo</h1>
        <p>Gestiona el contenido del ecosistema y consulta los indicadores del sistema de información.</p>
        <small className="user-session-badge">
          Sesión de Administrador iniciada como: <strong>{user.email}</strong>
        </small>
      </div>

      <section className="dashboard-stats-section">
        <div className="dashboard-title-row">
          <h3>📊 Dashboard de estadísticas</h3>
        </div>

        <div className="kpi-main-grid">
          <div className="kpi-box kpi-green">
            <div className="kpi-value">{totalRegistros}</div>
            <div className="kpi-label">REGISTROS TOTALES</div>
          </div>
          <div className="kpi-box kpi-white">
            <div className="kpi-value text-dark">{totalRegistros}</div>
            <div className="kpi-label text-muted">PUBLICADOS</div>
          </div>
          <div className="kpi-box kpi-white">
            <div className="kpi-value text-muted">0</div>
            <div className="kpi-label text-muted">BORRADORES</div>
          </div>
        </div>

        <div className="kpi-breakdown-grid">
          <div className="mini-stat-card"><span>🏛️ Lugares</span> <strong>{lugares.length}</strong></div>
          <div className="mini-stat-card"><span>📅 Eventos</span> <strong>{eventos.length}</strong></div>
          <div className="mini-stat-card"><span>🍲 Emprendimientos</span> <strong>{talentos.length}</strong></div>
          <div className="mini-stat-card"><span>📜 Saberes</span> <strong>{saberes.length}</strong></div>
          <div className="mini-stat-card"><span>🗺️ Rutas</span> <strong>{rutas.length}</strong></div>
          <div className="mini-stat-card"><span>🛶 Experiencias</span> <strong>{experiencias.length}</strong></div>
        </div>
      </section>

      <section className="dashboard-crud-section">
        <div className="admin-nav-tabs">
          {['lugares', 'eventos', 'talentos', 'saberes', 'experiencias'].map(t => (
            <button key={t} className={activeSubTab === t ? 'crud-tab active' : 'crud-tab'} onClick={() => { setActiveSubTab(t); setShowAddForm(false); }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="crud-toolbar">
          <div>
            <h3 className="crud-section-title">{currentConfig.label}</h3>
            <p className="crud-section-count">{currentConfig.lista.length} registros en el sistema</p>
          </div>
          <button className="btn-add-entity" onClick={() => setShowAddForm(!showAddForm)}>
            + Nuevo {currentConfig.singular}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAgregar} className="crud-create-card">
            <h4 className="form-card-title">Publicar nuevo {currentConfig.singular}</h4>
            <div className="form-grid-2">
              <div className="form-field-group">
                <label>Nombre:</label>
                <input type="text" required placeholder={"Nombre del " + currentConfig.singular + "..."} value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
              </div>
              <div className="form-field-group">
                <label>Categoría:</label>
                <input type="text" placeholder="Ej: Gastronomía, Tradición..." value={formData.categoria} onChange={(e) => setFormData({ ...formData, categoria: e.target.value })} />
              </div>
              <div className="form-field-group full-width">
                <label>Dirección / Ubicación en Barrancabermeja:</label>
                <input type="text" placeholder="Ej: Malecón, Comuna 7..." value={formData.direccion} onChange={(e) => setFormData({ ...formData, direccion: e.target.value })} />
              </div>
              <div className="form-field-group full-width">
                <label>Descripción:</label>
                <textarea rows="2" placeholder="Detalles de la oferta..." value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} />
              </div>
            </div>
            <div className="form-actions-row">
              <button type="submit" className="btn-submit-publish">Publicar</button>
              <button type="button" className="btn-cancel-form" onClick={() => setShowAddForm(false)}>Cancelar</button>
            </div>
          </form>
        )}

        <div className="crud-list-wrapper">
          {currentConfig.lista.map((item, idx) => (
            <div key={idx} className="crud-row-item">
              <span className="crud-item-name">{item}</span>
              <button className="btn-trash-action" title="Eliminar del sistema" onClick={() => handleEliminar(idx)}>
                🗑️
              </button>
            </div>
          ))}
        </div>

        <div className="dashboard-footer-actions-centered">
          <button className="btn-footer-center btn-primary-gray" onClick={() => setActiveTab('inicio')}>
            🏠 Volver al inicio
          </button>
          <button className="btn-footer-center btn-danger-red" onClick={onLogout}>
            🚪 Cerrar sesión
          </button>
        </div>
      </section>
    </div>
  );
}