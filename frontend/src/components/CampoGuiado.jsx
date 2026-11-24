import React, { useState } from 'react';
import guia from '../data/guiaEmprendimiento.json';

// Busca la ayuda de un campo en la guía (paso "registro" o "publicacion").
export function ayudaDe(paso, clave) {
  const p = guia.pasos.find((x) => x.id === paso);
  return p ? p.campos.find((c) => c.clave === clave) : null;
}

/**
 * Campo de formulario con pestaña de ayuda «¿Qué escribo aquí?».
 * Al abrirla muestra qué escribir, un ejemplo (que se puede usar como guía) y qué evitar.
 */
export default function CampoGuiado({ paso, clave, etiqueta, children, className = '' }) {
  const [abierto, setAbierto] = useState(false);
  const ayuda = ayudaDe(paso, clave);
  const titulo = etiqueta || (ayuda && ayuda.etiqueta) || clave;
  const idAyuda = `ayuda-${paso}-${clave}`;

  return (
    <div className={`campo-guiado ${abierto ? 'abierto' : ''} ${className}`}>
      <div className="campo-guiado-cabecera">
        <label>
          {titulo}
          {ayuda && ayuda.obligatorio && <span className="campo-obligatorio" title="Obligatorio"> *</span>}
        </label>
        {ayuda && (
          <button
            type="button"
            className="campo-guiado-pestana"
            aria-expanded={abierto}
            aria-controls={idAyuda}
            onClick={() => setAbierto(!abierto)}
          >
            {abierto ? '✕ Cerrar ayuda' : 'ⓘ ¿Qué escribo aquí?'}
          </button>
        )}
      </div>
      {ayuda && abierto && (
        <div className="campo-guiado-ayuda" id={idAyuda} role="note">
          <p><strong>Qué escribir:</strong> {ayuda.que}</p>
          <p><strong>Ejemplo:</strong> <span className="campo-ejemplo">{ayuda.ejemplo}</span></p>
          <p className="campo-evita"><strong>Evita:</strong> {ayuda.evita}</p>
        </div>
      )}
      {children}
    </div>
  );
}
