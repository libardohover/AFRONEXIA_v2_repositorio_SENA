import React from 'react';

const rutasData = [
  {
    id: 1,
    tag: 'Ruta 1',
    titulo: 'Ruta de la Memoria Afro',
    desc: 'Recorrido por los lugares que narran la llegada por el río, el asentamiento de las familias y el aporte cultural en Barrancabermeja.',
    duracion: '4 horas',
    dificultad: 'Dificultad Baja',
    cupo: 'Ideal para familias y caminantes',
    lat: 7.0645, lng: -73.8525, zoom: 15,
    paradas: [
      { num: 1, nombre: 'Malecón del Río Magdalena', detalle: 'Apertura con relato histórico sobre la llegada de las familias afro en canoas.', tiempo: '45 MIN' },
      { num: 2, nombre: 'Comuna 7 – Territorio Tambó', detalle: 'Caminata comunitaria por el barrio y muestra de percusión en vivo.', tiempo: '1 HORA' },
      { num: 3, nombre: 'Casa de la Cultura Piedra del Sol', detalle: 'Taller de danza afro y recorrido por el archivo fotográfico de memoria.', tiempo: '1 HORA' },
      { num: 4, nombre: 'Mercado Central – Fogón Afro', detalle: 'Cierre con almuerzo tradicional de sancocho de bocachico y arroz de coco.', tiempo: '1 HORA 15 MIN' }
    ]
  },
  {
    id: 2,
    tag: 'Ruta 2',
    titulo: 'Ruta del Río y los Saberes',
    desc: 'Experiencia ribereña de navegación con cantos de boga, pesca artesanal y medicina tradicional en la ciénaga.',
    duracion: '6 horas',
    dificultad: 'Dificultad Media',
    cupo: 'Recorrido fluvial en lancha',
    lat: 7.0820, lng: -73.8300, zoom: 13,
    paradas: [
      { num: 1, nombre: 'Embarcadero del Malecón', detalle: 'Salida en lancha tradicional con cantos de boga interpretados en vivo.', tiempo: '1 HORA' },
      { num: 2, nombre: 'Ciénaga San Silvestre', detalle: 'Pesca artesanal, avistamiento de aves y relato de la Madre de Agua.', tiempo: '2 HORAS' },
      { num: 3, nombre: 'Azotea de Plantas Medicinales', detalle: 'Visita a una huerta elevada y taller práctico de medicina de patio.', tiempo: '1 HORA 30 MIN' }
    ]
  },
  {
    id: 3,
    tag: 'Ruta 3',
    titulo: 'Ruta del Sabor Afro',
    desc: 'Circuito gastronómico por las cocinas ancestrales, fogones portadores y repostería típica del municipio.',
    duracion: '3 horas',
    dificultad: 'Dificultad Baja',
    cupo: 'Recorrido gastronómico urbano',
    lat: 7.0650, lng: -73.8510, zoom: 15,
    paradas: [
      { num: 1, nombre: 'Sabores de Aminta', detalle: 'Preparación en vivo y secretos del arroz de coco con titoté.', tiempo: '1 HORA' },
      { num: 2, nombre: 'Mercado Central – Fogón Afro', detalle: 'Degustación de sancocho de pescado y dulces de coco con corozo.', tiempo: '1 HORA' },
      { num: 3, nombre: 'Plaza del Tambor', detalle: 'Cierre con postres tradicionales, cocadas y muestra de percusión.', tiempo: '45 MIN' }
    ]
  }
];

export default function RutasView() {
  return (
    <div className="view-container">
      <div className="module-header-banner">
        <span className="module-badge-tag">MÓDULO 5</span>
        <h1>Rutas culturales</h1>
        <p>Itinerarios diseñados con la comunidad: cada circuito integra su cronograma de paradas y su recorrido georreferenciado en el mapa de Barrancabermeja.</p>
      </div>

      <div className="rutas-showcase-list">
        {rutasData.map(r => {
          const mapEmbedUrl = 'https://www.openstreetmap.org/export/embed.html?bbox=' + (r.lng - 0.02) + '%2C' + (r.lat - 0.02) + '%2C' + (r.lng + 0.02) + '%2C' + (r.lat + 0.02) + '&layer=mapnik&marker=' + r.lat + '%2C' + r.lng;

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
                  <div className="stat-badge">📍 {r.paradas.length} Paradas</div>
                </div>
              </div>

              {/* CUADRO DE DOBLE PANEL (ITINERARIO + MAPA INTEGRADO) */}
              <div className="ruta-split-layout">
                {/* LADO IZQUIERDO: LÍNEA DE TIEMPO */}
                <div className="ruta-timeline-panel">
                  <h4 className="panel-subtitle">📋 Itinerario de Paradas del Recorrido:</h4>
                  <div className="timeline-items-flow">
                    {r.paradas.map(p => (
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
                    <span>📍 Coordenadas: {r.lat}, {r.lng}</span>
                    <button 
                      className="btn-open-full-map"
                      onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=' + r.lat + ',' + r.lng, '_blank')}
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