import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const sitiosCulturales = [
  { id: 1, nombre: 'Pescado Frito Doña Chava', categoria: 'Gastronomía Ribereña', coords: [7.0653, -73.8547], descripcion: 'Sancocho de bocachico y bagre frito.', horario: 'Lunes a Domingo: 10am - 6pm' },
  { id: 2, nombre: 'Tambores del Magdalena', categoria: 'Música y Danza', coords: [7.0610, -73.8490], descripcion: 'Talleres de bullerengue y tambora.', horario: 'Viernes y Sábados: 4pm' },
  { id: 3, nombre: 'Turbantes y Moda Étnica Yemayá', categoria: 'Artesanías', coords: [7.0680, -73.8580], descripcion: 'Accesorios y peinados afro.', horario: 'Lunes a Sábado: 8am - 7pm' },
  { id: 4, nombre: 'Monumento al Cacique Pipatón', categoria: 'Patrimonio', coords: [7.0720, -73.8610], descripcion: 'Sitio histórico de memoria ribereña.', horario: 'Abierto 24 horas' }
];

export default function InteractiveMap() {
  const centroBarranca = [7.0653, -73.8547];
  return (
    <div className="map-view-container">
      <div className="map-header">
        <h2>🗺️ Georreferenciación Cultural de Barrancabermeja</h2>
        <p>Explora puntos gastronómicos, eventos folclóricos y patrimonio afrodescendiente en el mapa.</p>
      </div>
      <div className="map-wrapper">
        <MapContainer center={centroBarranca} zoom={14} scrollWheelZoom={false} className="leaflet-map">
          <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {sitiosCulturales.map((sitio) => (
            <Marker key={sitio.id} position={sitio.coords}>
              <Popup>
                <div className="popup-card">
                  <span className="popup-badge">{sitio.categoria}</span>
                  <h4>{sitio.nombre}</h4>
                  <p>{sitio.descripcion}</p>
                  <small>🕒 {sitio.horario}</small>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}