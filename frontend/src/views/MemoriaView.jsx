import React, { useState } from 'react';
import useCatalogo from '../hooks/useCatalogo';


export default function MemoriaView({ setActiveTab }) {
  const [openId, setOpenId] = useState(1);
  const { datos: saberesData } = useCatalogo('saberes');

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