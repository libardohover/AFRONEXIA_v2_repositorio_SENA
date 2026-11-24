import React, { useState } from 'react';
import useCatalogo from '../hooks/useCatalogo';
import { api } from '../lib/api';

const manana = () => new Date(Date.now() + 864e5).toISOString().slice(0, 10);

function FormReserva({ exp, user, onCerrar }) {
  const [f, setF] = useState({ nombre_contacto: user ? user.nombre : '', email_contacto: user ? user.email : '', telefono_contacto: '', fecha_deseada: manana(), personas: 1, comentario: '' });
  const [estado, setEstado] = useState({ enviando: false, ok: null, error: null });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const enviar = async (e) => {
    e.preventDefault();
    setEstado({ enviando: true, ok: null, error: null });
    try {
      const r = await api('/reservas', { method: 'POST', body: { ...f, experiencia_id: exp.id, personas: Number(f.personas) } });
      setEstado({ enviando: false, ok: r.mensaje, error: null });
    } catch (err) {
      setEstado({ enviando: false, ok: null, error: err.message });
    }
  };

  return (
    <div className="modal-map-overlay" onClick={onCerrar}>
      <div className="modal-reserva" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={'Reservar ' + exp.tit}>
        <div className="modal-reserva-header">
          <div><small>Reservar experiencia</small><h3>{exp.tit}</h3><small>{exp.pre} por persona · {exp.dur} · Guía: {exp.guia}</small></div>
          <button className="btn-close-map" onClick={onCerrar}>✕</button>
        </div>
        {estado.ok ? (
          <div className="reserva-ok">
            <div className="reserva-ok-icono">🌿</div>
            <p>{estado.ok}</p>
            <button className="btn-reservar-guia" onClick={onCerrar}>Listo</button>
          </div>
        ) : (
          <form onSubmit={enviar} className="form-reserva">
            {estado.error && <div className="alert-error-box">⚠️ {estado.error}</div>}
            <label>Nombre de contacto<input required value={f.nombre_contacto} onChange={set('nombre_contacto')} /></label>
            <div className="form-row-dual">
              <label>WhatsApp / teléfono<input type="tel" placeholder="573001234567" value={f.telefono_contacto} onChange={set('telefono_contacto')} /></label>
              <label>Correo<input type="email" value={f.email_contacto} onChange={set('email_contacto')} /></label>
            </div>
            <div className="form-row-dual">
              <label>Fecha deseada<input type="date" required min={new Date().toISOString().slice(0, 10)} value={f.fecha_deseada} onChange={set('fecha_deseada')} /></label>
              <label>Personas<input type="number" required min="1" max={exp.cupo_max || 50} value={f.personas} onChange={set('personas')} /></label>
            </div>
            <label>Comentario (opcional)<textarea rows="2" placeholder="Ej: vamos con dos niños, preferimos la tarde…" value={f.comentario} onChange={set('comentario')} /></label>
            <p className="reserva-nota">Deja al menos un teléfono o un correo. El guía confirma la reserva y el pago directamente contigo.</p>
            <button className="btn-reservar-guia" disabled={estado.enviando}>{estado.enviando ? 'Enviando…' : '🌿 Enviar solicitud de reserva'}</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ExperienciasView({ user }) {
  const { datos: exps } = useCatalogo('experiencias');
  const [reservando, setReservando] = useState(null);

  return (
    <div className="view-container">
      <div className="module-header-banner">
        <span className="module-badge-tag">MÓDULO 6</span>
        <h1>Experiencias turísticas</h1>
        <p>Vivencias guiadas por la comunidad con cupo y reserva directa.</p>
      </div>
      <div className="cards-grid-afro">
        {exps.map((e) => (
          <div key={e.id} className="card-afro">
            <div className="exp-top-row"><h3>{e.tit}</h3><span className="exp-price-badge">{e.pre}</span></div>
            {e.desc && <p className="card-desc exp-desc">{e.desc}</p>}
            <div className="card-meta"><div>⏱️ {e.dur} | 👥 {e.cup}</div><div>📍 {e.lug}</div><div>👤 <strong>Guía:</strong> {e.guia}</div></div>
            <button className="btn-reservar-guia" onClick={() => setReservando(e)}>🌿 Reservar con el guía</button>
          </div>
        ))}
      </div>
      {reservando && <FormReserva exp={reservando} user={user} onCerrar={() => setReservando(null)} />}
    </div>
  );
}
