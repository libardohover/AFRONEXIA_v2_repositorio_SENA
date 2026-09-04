import React from 'react';
const exps = [
  { id: 1, tit: 'Cocina de fogón: arroz de coco', pre: '$70.000', dur: '3h', cup: '8 pers.', guia: 'María Aminta Perea', lug: 'Comuna 7' },
  { id: 2, tit: 'Taller de tambor y danza afro', pre: '$45.000', dur: '2h', cup: '20 pers.', guia: 'Jhon Mosquera', lug: 'Casa de la Cultura' },
  { id: 3, tit: 'Trenzado y memoria', pre: '$60.000', dur: '2h', cup: '6 pers.', guia: 'Yuranis Palacios', lug: 'Comuna 5' },
  { id: 4, tit: 'Tarde con saberes del río', pre: '$85.000', dur: '4h', cup: '12 pers.', guia: 'Coop. de bogas', lug: 'Malecón' }
];

export default function ExperienciasView() {
  return (
    <div className="view-container">
      <div className="module-header-banner">
        <span className="module-badge-tag">MÓDULO 6</span>
        <h1>Experiencias turísticas</h1>
        <p>Vivencias guiadas por la comunidad con cupo y reserva directa.</p>
      </div>
      <div className="cards-grid-afro">
        {exps.map(e => (
          <div key={e.id} className="card-afro">
            <div className="exp-top-row"><h3>{e.tit}</h3><span className="exp-price-badge">{e.pre}</span></div>
            <div className="card-meta"><div>⏱️ {e.dur} | 👥 {e.cup}</div><div>📍 {e.lug}</div><div>👤 <strong>Guía:</strong> {e.guia}</div></div>
            <button className="btn-reservar-guia" onClick={() => alert('Solicitud enviada al guía')}>🌿 Reservar con el guía</button>
          </div>
        ))}
      </div>
    </div>
  );
}