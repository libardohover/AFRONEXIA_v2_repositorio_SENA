import React, { useState } from 'react';

const emprendimientosIniciales = [
  { id: 1, categoria: 'Artesanía', nombre: 'Artesanías Río Grande', titular: 'Segundo Rentería', desc: 'Cestería en fibras del río, tambores artesanales y accesorios inspirados en la iconografía afro.', barrio: 'Barrio Colombia', social: '@artesaniasriogrande', tel: '573123456789', email: 'artesaniasriogrande@gmail.com', precio: '45000', img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80' },
  { id: 2, categoria: 'Turismo comunitario', nombre: 'Ecoturismo Boga', titular: 'Cooperativa de bogas', desc: 'Recorridos en lancha por la ciénaga con relatos de pesca artesanal y avistamiento de aves.', barrio: 'Ciénaga San Silvestre', social: '@ecoturismoboga', tel: '573109876543', email: 'ecoturismoboga@gmail.com', precio: '80000', img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80' },
  { id: 3, categoria: 'Música tradicional', nombre: 'Grupo Tambó del Magdalena Medio', titular: 'Jhon Mosquera', desc: 'Agrupación de percusión y canto tradicional afro con talleres formativos de bullerengue.', barrio: 'Comuna 7', social: '@tambomagdalena', tel: '573155557890', email: 'tambomagdalena@gmail.com', precio: '60000', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80' },
  { id: 4, categoria: 'Gastronomía', nombre: 'Sabores de Aminta', titular: 'María Aminta Perea', desc: 'Cocina tradicional afro por encargo: arroz de coco, pusandao, cabeza de gato y dulces típicos.', barrio: 'Comuna 7', social: '@saboresdeaminta', tel: '573001234567', email: 'saboresdeaminta@gmail.com', precio: '28000', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80' },
  { id: 5, categoria: 'Estética ancestral', nombre: 'Trenzas y Raíces', titular: 'Yuranis Palacios', desc: 'Peinados ancestrales, trenzado africano y accesorios étnicos de memoria viva.', barrio: 'Comuna 5', social: '@trenzasyraices', tel: '573187654321', email: 'trenzasyraices@gmail.com', precio: '50000', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80' }
];

export default function EmprendimientosView({ user, setActiveTab }) {
  const [lista, setLista] = useState(emprendimientosIniciales);
  const [showForm, setShowForm] = useState(false);
  const [nuevo, setNuevo] = useState({ nombre: '', categoria: 'Gastronomía', desc: '', barrio: 'Barrancabermeja', social: '@emprendimiento', tel: '573000000000', email: '', precio: '', img: '' });

  const esEmprendedor = user && (user.rol === 'emprendedor' || user.rol === 'administrador');

  const handlePublicar = (e) => {
    e.preventDefault();
    if (!nuevo.nombre) return;
    const nuevoItem = {
      ...nuevo,
      id: Date.now(),
      titular: user.nombre,
      img: nuevo.img || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80'
    };
    setLista([nuevoItem, ...lista]);
    setShowForm(false);
    alert('✅ ¡Tu producto/emprendimiento ha sido publicado exitosamente!');
  };

  return (
    <div className="view-container">
      <div className="module-header-banner">
        <span className="module-badge-tag">MÓDULO 4</span>
        <h1>Talentos y emprendimientos</h1>
        <p>El componente económico del ecosistema: perfiles con historia, productos, precios, WhatsApp y contacto por correo electrónico.</p>
      </div>

      {/* ÁREA EXCLUSIVA PARA EMPRENDEDORES */}
      <div className="emprendedor-action-bar">
        {esEmprendedor ? (
          <div className="emp-authenticated-box">
            <span>👋 Hola <strong>{user.nombre}</strong>. Tienes permisos para publicar y gestionar productos.</span>
            <button className="btn-emp-new" onClick={() => setShowForm(!showForm)}>
              {showForm ? '✕ Cerrar formulario' : '+ Publicar mi Producto / Plato'}
            </button>
          </div>
        ) : (
          <div className="emp-guest-box">
            <span>¿Eres emprendedor/a afrodescendiente de Barrancabermeja?</span>
            <button className="btn-guest-login" onClick={() => setActiveTab('login')}>
              Inicia sesión como Emprendedor para subir tus productos
            </button>
          </div>
        )}
      </div>

      {/* FORMULARIO DE PUBLICACIÓN EXCLUSIVO */}
      {showForm && esEmprendedor && (
        <form onSubmit={handlePublicar} className="emp-form-upload">
          <h3>Publicar Nuevo Producto o Experiencia</h3>
          <div className="emp-grid-form">
            <div>
              <label>Nombre del Producto / Plato:</label>
              <input type="text" required placeholder="Ej: Arroz con Camarón Seco" value={nuevo.nombre} onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} />
            </div>
            <div>
              <label>Categoría:</label>
              <select value={nuevo.categoria} onChange={(e) => setNuevo({ ...nuevo, categoria: e.target.value })}>
                <option value="Gastronomía">Gastronomía</option>
                <option value="Artesanía">Artesanía</option>
                <option value="Estética ancestral">Estética ancestral / Trenzas</option>
                <option value="Música tradicional">Música tradicional</option>
                <option value="Turismo comunitario">Turismo comunitario</option>
              </select>
            </div>
            <div>
              <label>Precio ($ COP):</label>
              <input type="number" required placeholder="35000" value={nuevo.precio} onChange={(e) => setNuevo({ ...nuevo, precio: e.target.value })} />
            </div>
            <div>
              <label>Correo Electrónico de Contacto:</label>
              <input type="email" required placeholder="tucontacto@gmail.com" value={nuevo.email} onChange={(e) => setNuevo({ ...nuevo, email: e.target.value })} />
            </div>
            <div>
              <label>Teléfono / WhatsApp:</label>
              <input type="text" required placeholder="573001234567" value={nuevo.tel} onChange={(e) => setNuevo({ ...nuevo, tel: e.target.value })} />
            </div>
            <div>
              <label>URL de la Foto / Imagen:</label>
              <input type="url" placeholder="https://ejemplo.com/foto.jpg" value={nuevo.img} onChange={(e) => setNuevo({ ...nuevo, img: e.target.value })} />
            </div>
            <div className="full-col">
              <label>Descripción del Producto:</label>
              <textarea rows="2" required placeholder="Describe los ingredientes, la historia y preparación..." value={nuevo.desc} onChange={(e) => setNuevo({ ...nuevo, desc: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn-emp-submit">Guardar y Publicar en el Catálogo</button>
        </form>
      )}

      {/* REJILLA DE TARJETAS */}
      <div className="cards-grid-afro">
        {lista.map(item => (
          <div key={item.id} className="card-afro with-img">
            <img src={item.img} alt={item.nombre} className="card-top-img" />
            <div className="card-inner-body">
              <div className="card-badge-row">
                <span className="card-badge">{item.categoria}</span>
                {item.precio && <span className="price-badge-green">{"$" + Number(item.precio).toLocaleString() + " COP"}</span>}
              </div>
              <h3>{item.nombre}</h3>
              <div className="titular-text">👤 {item.titular}</div>
              <p className="card-desc">{item.desc}</p>
              <div className="card-meta">
                <div>📍 {item.barrio}</div>
                <div>📸 {item.social}</div>
              </div>
              <div className="contact-actions-dual">
                <button className="btn-wpp-direct" onClick={() => window.open('https://wa.me/' + String(item.tel).replace(/\D/g, ''), '_blank')}>
                  💬 WhatsApp
                </button>
                <button className="btn-email-direct" onClick={() => window.open('mailto:' + item.email + '?subject=Consulta sobre ' + encodeURIComponent(item.nombre) + ' en AFRONEXIA', '_blank')}>
                  ✉️ Correo
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}