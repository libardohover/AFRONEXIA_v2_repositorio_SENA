import React from 'react';
import useCatalogo from '../hooks/useCatalogo';


export default function RutasView() {
  const { datos: rutasData } = useCatalogo('rutas');
  return (
    <div className="view-container">
      <div className="module-header-banner">
        <span className="module-badge-tag">MÓDULO 5</span>
        <h1>Rutas culturales</h1>
        <p>Itinerarios diseñados con la comunidad: cada circuito integra su cronograma de paradas y su recorrido georreferenciado en el mapa de Barrancabermeja.</p>
      </div>

      <div className="rutas-showcase-list">
        {rutasData.map(r => {
          const lat = r.lat || 7.0653, lng = r.lng || -73.8547;
          const mapEmbedUrl = 'https://www.openstreetmap.org/export/embed.html?bbox=' + (lng - 0.02) + '%2C' + (lat - 0.02) + '%2C' + (lng + 0.02) + '%2C' + (lat + 0.02) + '&layer=mapnik&marker=' + lat + '%2C' + lng;

          return (
            <div key={r.id} className="ruta-master-box">
              {/* ENCABEZADO DE LA RUTA */}
              <div className="ruta-box-header">
                <div className="ruta-title-meta">
                  <span className="ruta-tag-badge">{r.tag}</span>
                  <h2>{r.titulo}</h2>
                  <p>{r.desc}</p>
                </div>
                <div className="ruta-pills-stats">
                  <div className="stat-badge">⏱️ {r.duracion}</div>
                  <div className="stat-badge">🚶 {r.dificultad}</div>
                  <div className="stat-badge">📍 {(r.paradas || []).length} Paradas</div>
                </div>
              </div>

              {/* CUADRO DE DOBLE PANEL (ITINERARIO + MAPA INTEGRADO) */}
              <div className="ruta-split-layout">
                {/* LADO IZQUIERDO: LÍNEA DE TIEMPO */}
                <div className="ruta-timeline-panel">
                  <h4 className="panel-subtitle">📋 Itinerario de Paradas del Recorrido:</h4>
                  <div className="timeline-items-flow">
                    {(r.paradas || []).map(p => (
                      <div key={p.num} className="timeline-stop-card">
                        <div className="stop-step-circle">{p.num}</div>
                        <div className="stop-text-body">
                          <div className="stop-title-row">
                            <strong>{p.nombre}</strong>
                            <span className="stop-duration-tag">{p.tiempo}</span>
                          </div>
                          <p>{p.detalle}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* LADO DERECHO: MAPA DE BARRANCABERMEJA EN EL CUADRO */}
                <div className="ruta-map-panel">
                  <div className="map-panel-header">
                    <span>🗺️ <strong>Mapa del Circuito:</strong> Barrancabermeja</span>
                    <small>Sector de recorrido</small>
                  </div>
                  <div className="map-frame-box">
                    <iframe 
                      title={"Mapa " + r.titulo}
                      src={mapEmbedUrl}
                      className="route-interactive-iframe"
                    ></iframe>
                  </div>
                  <div className="map-panel-footer">
                    <span>📍 Coordenadas: {lat}, {lng}</span>
                    <button 
                      className="btn-open-full-map"
                      onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=' + lat + ',' + lng, '_blank')}
                    >
                      Abrir en GPS ↗
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}