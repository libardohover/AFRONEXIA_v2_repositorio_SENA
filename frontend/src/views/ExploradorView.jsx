import React, { useState } from 'react';
import MapModal from '../components/MapModal';
import InteractiveMap from '../components/InteractiveMap';
import useCatalogo from '../hooks/useCatalogo';


export default function ExploradorView() {
  const [filtro, setFiltro] = useState('Todas');
  const [modalSitio, setModalSitio] = useState(null);
  const [verMapa, setVerMapa] = useState(false);
  const { datos: lugaresIniciales } = useCatalogo('lugares');
  const categorias = ['Todas', ...new Set(lugaresIniciales.map((l) => l.categoria))];

  const filtrados = filtro === 'Todas' ? lugaresIniciales : lugaresIniciales.filter(l => l.categoria.toLowerCase() === filtro.toLowerCase());

  return (
    <div className="view-container">
      <div className="module-header-banner">
        <span className="module-badge-tag">MÓDULO 1</span>
        <h1>Explorador cultural y turístico</h1>
        <p>Cada lugar del territorio afro de Barrancabermeja con su ficha fotográfica, ubicación, horario y contacto.</p>
      </div>

      <div className="pill-group mb-20">
        {categorias.map(c => (
          <button key={c} className={filtro === c ? 'filter-pill active' : 'filter-pill'} onClick={() => setFiltro(c)}>{c}</button>
        ))}
      </div>

      <div className="vista-toggle">
        <button className={!verMapa ? 'filter-pill active' : 'filter-pill'} onClick={() => setVerMapa(false)}>▦ Fichas</button>
        <button className={verMapa ? 'filter-pill active' : 'filter-pill'} onClick={() => setVerMapa(true)}>🗺️ Mapa de todos los lugares</button>
      </div>

      {verMapa && <InteractiveMap sitios={filtrados} />}

      <div className="cards-grid-afro" style={verMapa ? { display: 'none' } : undefined}>
        {filtrados.map(l => (
          <div key={l.id} className="card-afro with-img">
            <img src={l.img} alt={l.nombre} className="card-top-img" />
            <div className="card-inner-body">
              <span className="card-badge">{l.categoria}</span>
              <h3>{l.nombre}</h3>
              <p className="card-desc">{l.desc}</p>
              <div className="card-meta">
                <div>📍 {l.dir}</div>
                <div>🕒 {l.horario}</div>
                <div>📞 {l.tel}</div>
              </div>
              <button className="link-action-map" onClick={() => setModalSitio(l)}>
                🗺️ Ver en el mapa de Barrancabermeja →
              </button>
            </div>
          </div>
        ))}
      </div>

      <MapModal isOpen={!!modalSitio} sitio={modalSitio} onClose={() => setModalSitio(null)} />
    </div>
  );
}