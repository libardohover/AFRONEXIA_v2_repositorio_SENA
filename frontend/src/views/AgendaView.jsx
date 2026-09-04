import React, { useState } from 'react';
import MapModal from '../components/MapModal';

const eventosData = [
  { 
    id: 1, dia: '22', mes: 'AGO', tipo: 'Taller Formativo', 
    titulo: 'Taller de Danza Afro y Percusión para Jóvenes', 
    desc: 'Formación comunitaria en bullerengue, mapalé y currulao dirigida a jóvenes de las comunas 5, 6 y 7.', 
    fecha: '22 de agosto de 2026', hora: '09:00 AM', 
    lugar: 'Casa de la Cultura Piedra del Sol', organ: 'COLECTIVO TAMBÓ',
    img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
    lat: 7.0620, lng: -73.8510
  },
  { 
    id: 2, dia: '30', mes: 'AGO', tipo: 'Feria Comunitaria', 
    titulo: 'Gran Feria de Emprendimientos y Saberes Afro', 
    desc: 'Muestra comercial de artesanías en fibra de río, turbantes étnicos, cosmética natural y dulces tradicionales.', 
    fecha: '30 de agosto de 2026', hora: '10:00 AM', 
    lugar: 'Plaza del Tambor (Parque Infantil)', organ: 'SECRETARÍA DE DESARROLLO ECONÓMICO',
    img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
    lat: 7.0670, lng: -73.8490
  },
  { 
    id: 3, dia: '12', mes: 'SEPT', tipo: 'Festival Folclórico', 
    titulo: 'Festival de Tambores del Magdalena Medio', 
    desc: 'Tres días de conciertos en vivo, rueda de cumbia, cantos de boga y cocinas tradicionales a orillas del río.', 
    fecha: '12 de septiembre de 2026', hora: '04:00 PM', 
    lugar: 'Malecón del Río Magdalena', organ: 'SECRETARÍA DE CULTURA Y TURISMO',
    img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    lat: 7.0653, lng: -73.8547
  },
  { 
    id: 4, dia: '27', mes: 'SEPT', tipo: 'Muestra Gastronómica', 
    titulo: 'Noche de Cocinas Tradicionales y Fogón Afro', 
    desc: 'Degustación de arroz de coco con titoté, sancocho de bocachico y pusandao preparado por cocineras portadoras.', 
    fecha: '27 de septiembre de 2026', hora: '06:00 PM', 
    lugar: 'Mercado Central – Fogón Afro', organ: 'ASOCIACIÓN DE COCINERAS TRADICIONALES',
    img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
    lat: 7.0640, lng: -73.8530
  },
  { 
    id: 5, dia: '04', mes: 'OCT', tipo: 'Encuentro Patrimonial', 
    titulo: 'Encuentro de Sabedores y Sabedoras del Río', 
    desc: 'Conversatorio intergeneracional sobre oralidad, mitos de la ciénaga, medicina de patio y memoria ribereña.', 
    fecha: '4 de octubre de 2026', hora: '03:00 PM', 
    lugar: 'Casa de la Cultura Piedra del Sol', organ: 'RED DE MEMORIA COMUNITARIA',
    img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
    lat: 7.0620, lng: -73.8510
  }
];

export default function AgendaView() {
  const [filtro, setFiltro] = useState('Todas');
  const [modalSitio, setModalSitio] = useState(null);

  const filtrados = filtro === 'Todas' ? eventosData : eventosData.filter(e => e.tipo.toLowerCase().includes(filtro.toLowerCase()));

  return (
    <div className="view-container">
      <div className="module-header-banner">
        <span className="module-badge-tag">MÓDULO 3</span>
        <h1>Agenda cultural</h1>
        <p>Festivales folclóricos, talleres de tambora, ferias de emprendimiento y encuentros de cocina tradicional organizados por fecha.</p>
      </div>

      <div className="pill-group mb-20">
        {['Todas', 'Festival', 'Taller', 'Feria', 'Gastronómica', 'Patrimonial'].map(cat => (
          <button key={cat} className={filtro === cat ? 'filter-pill active' : 'filter-pill'} onClick={() => setFiltro(cat)}>
            {cat}
          </button>
        ))}
      </div>

      <div className="agenda-grid-cards">
        {filtrados.map(ev => (
          <div key={ev.id} className="agenda-card-pro">
            <div className="agenda-card-media">
              <img src={ev.img} alt={ev.titulo} className="agenda-card-img" />
              <div className="agenda-date-floating">
                <span className="date-number">{ev.dia}</span>
                <span className="date-month">{ev.mes}</span>
              </div>
            </div>

            <div className="agenda-card-body">
              <div className="agenda-top-meta">
                <span className="badge-event-type">{ev.tipo}</span>
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