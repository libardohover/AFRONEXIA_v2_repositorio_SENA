import React, { useState } from 'react';

const saberesData = [
  { id: 1, categoria: 'Gastronomía', titulo: 'Arroz de coco: memoria del Pacífico en el río', subtitulo: 'Plato insignia que viajó con las familias afro hasta Barrancabermeja.', texto: 'El arroz de coco se prepara extrayendo la leche de coco, dorando el titoté y cocinando lentamente. Se acompaña con bocachico frito y patacón.', portador: 'María Aminta Perea', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80' },
  { id: 2, categoria: 'Música', titulo: 'El canto de boga en el Magdalena', subtitulo: 'Cantos de trabajo que acompañaban la navegación en canoa por el río.', texto: 'Los cantos de boga nacieron de remar contra la corriente, contando historias del río: crecientes, pescas y ausencias.', portador: 'Don Emiro Mosquera', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80' },
  { id: 3, categoria: 'Oralidad', titulo: 'El trenzado como mapa de libertad', subtitulo: 'Los peinados afro guardaron rutas de escape durante la esclavitud.', texto: 'Las trenzas fueron cartografía: líneas para caminos y nudos para encuentros. Se enseña esta historia mientras se peina.', portador: 'Yuranis Palacios', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80' },
  { id: 4, categoria: 'Mitos y leyendas', titulo: 'La leyenda de la Madre de Agua', subtitulo: 'Relato sobre la protectora de las ciénagas que cuida la fauna fluvial.', texto: 'Habita en la ciénaga San Silvestre protegiendo los peces y premiando a quienes pescan respetando el ciclo natural.', portador: 'Sabedores de la ciénaga', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80' },
  { id: 5, categoria: 'Medicina tradicional', titulo: 'Medicina de patio: plantas que curan', subtitulo: 'Saberes sobre plantas medicinales cultivadas en azoteas.', texto: 'Matarratón, hierbabuena, sábila y altamisa cultivadas en huertas elevadas que funcionan como botiquín vivo.', portador: 'Sabedora Rosalba Córdoba', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80' }
];

export default function MemoriaView({ setActiveTab }) {
  const [openId, setOpenId] = useState(1);

  return (
    <div className="view-container">
      <div className="module-header-banner">
        <span className="module-badge-tag">MÓDULO 2</span>
        <h1>Memoria y patrimonio</h1>
        <p>Archivo digital de memoria comunitaria construido con las y los sabedores: oralidad, música, medicina y cocina.</p>
      </div>

      <div className="memoria-layout">
        <div className="saberes-list">
          {saberesData.map(s => (
            <div key={s.id} className="saber-item-card">
              <div className="saber-header" onClick={() => setOpenId(openId === s.id ? null : s.id)}>
                <div className="saber-header-left">
                  <span className="badge-saber">{s.categoria}</span>
                  <h3>{s.titulo}</h3>
                  <small>{s.subtitulo}</small>
                </div>
                <span>{openId === s.id ? '▲' : '▼'}</span>
              </div>

              {openId === s.id && (
                <div className="saber-body">
                  <img src={s.img} alt={s.titulo} className="saber-detail-img" />
                  <p>{s.texto}</p>
                  <div className="portador-tag">🌿 <strong>Portador/a del saber:</strong> {s.portador}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="callout-card-sabedor">
          <h4>¿Eres sabedor o sabedora?</h4>
          <p>Documenta tus conocimientos ancestrales y súmalos al archivo comunitario de Barrancabermeja.</p>
          <button className="btn-sabedor-cta" onClick={() => setActiveTab('login')}>Registrar mis saberes</button>
        </div>
      </div>
    </div>
  );
}