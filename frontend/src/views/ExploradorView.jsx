import React, { useState } from 'react';
import MapModal from '../components/MapModal';

const lugaresIniciales = [
  { id: 1, categoria: 'Espacio cultural', nombre: 'Casa de la Cultura Piedra del Sol', desc: 'Escenario de talleres de danza afro, percusión y formación artística para niños y jóvenes.', dir: 'Calle 49 #9-30', horario: 'Lun-Vie 8:00-18:00', tel: '604 6021234', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80', lat: 7.0620, lng: -73.8510 },
  { id: 2, categoria: 'Sitio natural', nombre: 'Ciénaga San Silvestre', desc: 'Humedal asociado a los saberes de pesca artesanal y a la medicina tradicional de plantas ribereñas.', dir: 'Vía a San Silvestre', horario: '6:00-17:00', tel: 'Guías comunitarios', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80', lat: 7.0850, lng: -73.8200 },
  { id: 3, categoria: 'Lugar histórico', nombre: 'Comuna 7 – Territorio Tambó', desc: 'Barrio de fuerte asentamiento afrodescendiente del Pacífico; cuna de agrupaciones de tambora tradicional.', dir: 'Comuna 7', horario: 'Recorridos guiados con reserva', tel: 'Junta comunal', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80', lat: 7.0580, lng: -73.8420 },
  { id: 4, categoria: 'Sitio natural', nombre: 'Malecón del Río Magdalena', desc: 'Corredor ribereño donde la comunidad celebra encuentros de tambor, cantos de boga y ferias de cocina afro.', dir: 'Cra 1 con Calle 49', horario: 'Abierto todos los días', tel: 'Secretaría de Cultura', img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80', lat: 7.0653, lng: -73.8547 },
  { id: 5, categoria: 'Gastronomía', nombre: 'Mercado Central – Fogón Afro', desc: 'Pasillo de cocinas tradicionales donde se preparan arroz de coco, sancocho de bocachico y dulces de la costa.', dir: 'Calle 52 #8-10', horario: 'Mar-Dom 6:00-15:00', tel: 'Asoc. Cocineras', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80', lat: 7.0640, lng: -73.8530 },
  { id: 6, categoria: 'Espacio cultural', nombre: 'Parque Infantil y Plaza del Tambor', desc: 'Punto de encuentro para muestras de danza afro, peinados tradicionales y ferias artesanales.', dir: 'Calle 50 con Cra 12', horario: 'Abierto todos los días', tel: 'Alcaldía de Barrancabermeja', img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80', lat: 7.0670, lng: -73.8490 }
];

export default function ExploradorView() {
  const [filtro, setFiltro] = useState('Todas');
  const [modalSitio, setModalSitio] = useState(null);

  const filtrados = filtro === 'Todas' ? lugaresIniciales : lugaresIniciales.filter(l => l.categoria.toLowerCase() === filtro.toLowerCase());

  return (
    <div className="view-container">
      <div className="module-header-banner">
        <span className="module-badge-tag">MÓDULO 1</span>
        <h1>Explorador cultural y turístico</h1>
        <p>Cada lugar del territorio afro de Barrancabermeja con su ficha fotográfica, ubicación, horario y contacto.</p>
      </div>

      <div className="pill-group mb-20">
        {['Todas', 'Espacio cultural', 'Sitio natural', 'Lugar histórico', 'Gastronomía'].map(c => (
          <button key={c} className={filtro === c ? 'filter-pill active' : 'filter-pill'} onClick={() => setFiltro(c)}>{c}</button>
        ))}
      </div>

      <div className="cards-grid-afro">
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