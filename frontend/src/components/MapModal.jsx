import React from 'react';

export default function MapModal({ isOpen, onClose, sitio }) {
  if (!isOpen || !sitio) return null;

  const lat = sitio.lat || 7.0653;
  const lng = sitio.lng || -73.8547;
  const mapUrl = 'https://www.openstreetmap.org/export/embed.html?bbox=' + (lng - 0.015) + '%2C' + (lat - 0.015) + '%2C' + (lng + 0.015) + '%2C' + (lat + 0.015) + '&layer=mapnik&marker=' + lat + '%2C' + lng;

  return (
    <div className="modal-map-overlay" onClick={onClose}>
      <div className="modal-map-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-map-header">
          <div>
            <span className="badge-tag-mini">{sitio.categoria || 'Ubicación'}</span>
            <h3>📍 {sitio.nombre}</h3>
            <small>{sitio.dir || 'Barrancabermeja, Santander'}</small>
          </div>
          <button className="btn-close-map" onClick={onClose}>✕</button>
        </div>
        <div className="map-iframe-wrapper">
          <iframe title="Mapa de Barrancabermeja" src={mapUrl} className="map-iframe"></iframe>
        </div>
        <div className="modal-map-footer">
          <span>🕒 {sitio.horario || 'Abierto al público'}</span>
          <button className="btn-open-ext-map" onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=' + lat + ',' + lng, '_blank')}>
            Ver en Google Maps ↗
          </button>
        </div>
      </div>
    </div>
  );
}