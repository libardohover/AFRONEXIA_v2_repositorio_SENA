import React, { useState } from 'react';
import MapModal from '../components/MapModal';
import useCatalogo from '../hooks/useCatalogo';


export default function AgendaView() {
  const [filtro, setFiltro] = useState('Todas');
  const [modalSitio, setModalSitio] = useState(null);
  const { datos } = useCatalogo('eventos');
  // Próximos primero (por fecha ascendente) y luego los ya realizados (más recientes primero).
  const eventosData = [...datos].sort((a, b) => (a.pasado - b.pasado) || (a.pasado ? b.fecha_iso.localeCompare(a.fecha_iso) : a.fecha_iso.localeCompare(b.fecha_iso)));
  const proximos = eventosData.filter((e) => !e.pasado).length;

  const filtrados = filtro === 'Todas' ? eventosData : eventosData.filter(e => e.tipo.toLowerCase().includes(filtro.toLowerCase()));

  return (
    <div className="view-container">
      <div className="module-header-banner">
        <span className="module-badge-tag">MÓDULO 3</span>
        <h1>Agenda cultural</h1>
        <p>Festivales folclóricos, talleres de tambora, ferias de emprendimiento y encuentros de cocina tradicional organizados por fecha.</p>
      </div>

      {proximos === 0 && (
        <div className="aviso-agenda">📅 No hay eventos próximos publicados por ahora. Abajo puedes ver los más recientes; vuelve pronto o pregúntale a NEXIA por experiencias disponibles.</div>
      )}

      <div className="pill-group mb-20">
        {['Todas', 'Festival', 'Taller', 'Feria', 'Gastronómica', 'Patrimonial'].map(cat => (
          <button key={cat} className={filtro === cat ? 'filter-pill active' : 'filter-pill'} onClick={() => setFiltro(cat)}>
            {cat}
          </button>
        ))}
      </div>

      <div className="agenda-grid-cards">
        {filtrados.map(ev => (
          <div key={ev.id} className={'agenda-card-pro' + (ev.pasado ? ' evento-pasado' : '')}>
            <div className="agenda-card-media">
              <img src={ev.img || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80'} alt={ev.titulo} className="agenda-card-img" loading="lazy" />
              <div className="agenda-date-floating">
                <span className="date-number">{ev.dia}</span>
                <span className="date-month">{ev.mes}</span>
              </div>
            </div>

            <div className="agenda-card-body">
              <div className="agenda-top-meta">
                <span className="badge-event-type">{ev.tipo}</span>
                {ev.pasado && <span className="badge-finalizado">Finalizado</span>}
                <small className="agenda-organizer-badge">🏛️ {ev.organ}</small>
              </div>

              <h3 className="agenda-event-title">{ev.titulo}</h3>
              <p className="agenda-event-desc">{ev.desc}</p>

              <div className="agenda-details-row">
                <div>📅 <strong>Fecha:</strong> {ev.fecha}</div>
                <div>🕒 <strong>Hora:</strong> {ev.hora}</div>
                <div>📍 <strong>Lugar:</strong> {ev.lugar}</div>
              </div>

              <button 
                className="btn-event-map-action"
                onClick={() => setModalSitio({ nombre: ev.titulo, categoria: ev.tipo, dir: ev.lugar, horario: ev.fecha + ' - ' + ev.hora, lat: ev.lat, lng: ev.lng })}
              >
                🗺️ Ver ubicación en el mapa de Barrancabermeja →
              </button>
            </div>
          </div>
        ))}
      </div>

      <MapModal isOpen={!!modalSitio} sitio={modalSitio} onClose={() => setModalSitio(null)} />
    </div>
  );
}