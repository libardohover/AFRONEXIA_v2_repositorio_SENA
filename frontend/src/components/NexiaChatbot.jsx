import React, { useState } from 'react';
import NexiaChat from './NexiaChat';

// Acceso flotante a NEXIA desde cualquier módulo. Comparte la conversación con la vista del Asistente.
export default function NexiaChatbot({ onNavegar }) {
  const [abierto, setAbierto] = useState(false);
  return (
    <div className="nx-flotante-wrap">
      {abierto ? (
        <NexiaChat variante="flotante" onCerrar={() => setAbierto(false)} onNavegar={(m) => { onNavegar(m); }} />
      ) : (
        <button className="nx-btn-abrir" onClick={() => setAbierto(true)} aria-label="Abrir chat con NEXIA">
          <img src="/logo_afronexia.png" alt="" onError={(e) => { e.target.style.display = 'none'; }} />
          Habla con NEXIA
        </button>
      )}
    </div>
  );
}
