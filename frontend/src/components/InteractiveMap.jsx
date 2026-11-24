import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Íconos empaquetados localmente (no dependen de un CDN externo).
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

const CENTRO_BARRANCA = [7.0653, -73.8547];

/** Mapa interactivo (Leaflet + OpenStreetMap) con todos los sitios recibidos. */
export default function InteractiveMap({ sitios = [] }) {
  const conCoords = sitios.filter((s) => s.lat && s.lng);
  return (
    <div className="map-wrapper mapa-explorador">
      <MapContainer center={CENTRO_BARRANCA} zoom={13} scrollWheelZoom={false} className="leaflet-map">
        <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {conCoords.map((sitio) => (
          <Marker key={sitio.id} position={[sitio.lat, sitio.lng]}>
            <Popup>
              <div className="popup-card">
                <span className="popup-badge">{sitio.categoria}</span>
                <h4>{sitio.nombre}</h4>
                <p>{sitio.desc}</p>
                {sitio.horario && <small>🕒 {sitio.horario}</small>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
