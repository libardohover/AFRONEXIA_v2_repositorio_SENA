import React, { useState } from 'react';
export default function AsistenteIAView() {
  const [q, setQ] = useState('');
  const [res, setRes] = useState(null);
  const [load, setLoad] = useState(false);

  const consultar = (texto) => {
    const query = texto || q;
    if (!query) return;
    setQ(query);
    setLoad(true);
    setTimeout(() => {
      setRes('¡Cálido saludo, caminante! En AFRONEXIA te recomendamos: 09:00 AM Malecón del Río Magdalena, 10:00 AM Recorrido de tambora en Comuna 7 y 12:00 PM Almuerzo tradicional en el Mercado Central Fogón Afro.');
      setLoad(false);
    }, 800);
  };

  return (
    <div className="view-container">
      <div className="module-header-banner">
        <span className="module-badge-tag">MÓDULO 7</span>
        <h1>Asistente turístico cultural</h1>
        <p>Un sistema inteligente que arma tu itinerario con lugares, eventos y rutas del catálogo.</p>
      </div>
      <div className="ia-prompt-grid">
        <button className="prompt-card-btn" onClick={() => consultar('Quiero conocer la cultura afro de Barrancabermeja')}>✨ Quiero conocer la cultura afro durante una tarde.</button>
        <button className="prompt-card-btn" onClick={() => consultar('Fin de semana con mi familia')}>✨ Fin de semana gastronómico con mi familia.</button>
        <button className="prompt-card-btn" onClick={() => consultar('Experiencia en el río')}>✨ Experiencia en el río con sabedores.</button>
        <button className="prompt-card-btn" onClick={() => consultar('Eventos próximos')}>✨ ¿Qué eventos culturales afro hay?</button>
      </div>
      <div className="ia-input-container">
        <input type="text" placeholder="Escribe lo que buscas para tu visita..." value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && consultar(q)} />
        <button className="btn-send-ia" onClick={() => consultar(q)}>{load ? 'Generando...' : 'Enviar'}</button>
      </div>
      {res && (
        <div className="ia-itinerary-response">
          <div className="ia-response-badge">ITINERARIO INTELIGENTE GENERADO POR NEXIA</div>
          <div className="ia-response-text">{res}</div>
        </div>
      )}
    </div>
  );
}