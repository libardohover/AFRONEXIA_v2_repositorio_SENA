import React, { useState } from 'react';
import NexiaChat from '../components/NexiaChat';

const ATAJOS = [
  { t: 'Quiero conocer la cultura afro durante una tarde', i: '🌅' },
  { t: 'Fin de semana gastronómico con mi familia', i: '🍲' },
  { t: 'Experiencia en el río con sabedores', i: '🛶' },
  { t: '¿Qué eventos culturales afro hay?', i: '📅' },
  { t: 'Quiero comprar artesanías afro', i: '🛍️' },
  { t: 'Cuéntame la historia del canto de boga', i: '📜' },
];

export default function AsistenteIAView({ setActiveTab }) {
  const [semilla, setSemilla] = useState(() => {
    const p = sessionStorage.getItem('nexia_pregunta');
    sessionStorage.removeItem('nexia_pregunta');
    return p;
  });
  const [clave, setClave] = useState(0);

  return (
    <div className="view-container">
      <div className="module-header-banner">
        <span className="module-badge-tag">MÓDULO 7</span>
        <h1>Asistente turístico cultural · NEXIA</h1>
        <p>Un agente inteligente que arma tu itinerario con los lugares, eventos, rutas, saberes y emprendimientos reales del catálogo comunitario. Puedes escribirle o hablarle 🎙️.</p>
      </div>
      <div className="asistente-layout">
        <aside className="asistente-atajos">
          <h4>Pídele a NEXIA…</h4>
          {ATAJOS.map((a) => (
            <button key={a.t} className="prompt-card-btn" onClick={() => { setSemilla(a.t); setClave((k) => k + 1); }}>
              <span>{a.i}</span> {a.t}
            </button>
          ))}
          <div className="asistente-nota">
            <strong>¿Cómo funciona?</strong>
            <p>NEXIA busca en el catálogo de AFRONEXIA, arma el plan con horarios reales y te muestra tarjetas para ir al módulo, escribir por WhatsApp o abrir el mapa. Califica sus respuestas con 👍/👎 para ayudarnos a mejorarla.</p>
          </div>
        </aside>
        <NexiaChat key={clave} variante="pagina" mensajeInicial={semilla} onNavegar={setActiveTab} />
      </div>
    </div>
  );
}
