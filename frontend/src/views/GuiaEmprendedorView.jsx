import React from 'react';
import guia from '../data/guiaEmprendimiento.json';

// Guía paso a paso imprimible (o "Guardar como PDF") para llenar el formulario del emprendimiento.
export default function GuiaEmprendedorView({ setActiveTab, user }) {
  const esEmprendedor = user && ['emprendedor', 'administrador'].includes(user.rol);
  return (
    <div className="view-container guia-emp">
      <div className="module-header-banner no-print">
        <span className="module-badge-tag">GUÍA DEL EMPRENDEDOR</span>
        <h1>{guia.titulo}</h1>
        <p>{guia.intro}</p>
      </div>
      <h1 className="solo-print">{guia.titulo}</h1>

      <div className="guia-acciones no-print">
        <button className="btn-emp-new" onClick={() => window.print()}>🖨️ Imprimir o guardar en PDF</button>
        <button className="btn-guest-login" onClick={() => setActiveTab(esEmprendedor ? 'emprendimientos' : 'login')}>
          {esEmprendedor ? 'Ir a publicar mi producto →' : 'Ir a registrarme →'}
        </button>
      </div>

      <section className="guia-bloque">
        <h2>Antes de empezar, ten a mano</h2>
        <ul>{guia.antes.map((a) => <li key={a}>{a}</li>)}</ul>
      </section>

      {guia.pasos.map((p) => (
        <section key={p.id} className="guia-bloque">
          <h2>{p.titulo}</h2>
          <p className="guia-donde">📍 <strong>Dónde:</strong> {p.donde}</p>
          <ol className="guia-campos">
            {p.campos.map((c) => (
              <li key={c.clave}>
                <h3>{c.etiqueta} {c.obligatorio ? <span className="campo-obligatorio">(obligatorio)</span> : <span className="campo-opcional">(opcional)</span>}</h3>
                <p><strong>Qué escribir:</strong> {c.que}</p>
                <p><strong>Ejemplo:</strong> <span className="campo-ejemplo">{c.ejemplo}</span></p>
                <p className="campo-evita"><strong>Evita:</strong> {c.evita}</p>
              </li>
            ))}
          </ol>
        </section>
      ))}

      <section className="guia-bloque">
        <h2>Paso 3 · ¿Qué pasa después de publicar?</h2>
        <ul>{guia.despues.map((a) => <li key={a}>{a}</li>)}</ul>
        <p className="guia-donde">¿Dudas? Pregúntale a NEXIA (botón «Habla con NEXIA») o escribe al administrador de AFRONEXIA.</p>
      </section>
    </div>
  );
}
