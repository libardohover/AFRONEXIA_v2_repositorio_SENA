import React, { useEffect, useRef, useState } from 'react';
import { api } from '../lib/api';
import './NexiaChat.css';

const CLAVE_SID = 'nexia_session_id';
const CLAVE_MSG = 'nexia_mensajes';
const BIENVENIDA = {
  rol: 'bot',
  texto: '¡Hola! Soy **NEXIA** 🌺, tu guía cultural en Barrancabermeja. Te armo itinerarios, te recomiendo dónde comer cocina afro del río, te cuento los saberes de la comunidad y te ayudo a reservar experiencias con guías locales. ¿Qué quieres vivir?',
  sugerencias: ['Planea mi tarde cultural', '¿Dónde como sancocho de bocachico?', 'Fin de semana con mi familia', 'Cuéntame la leyenda de la Madre de Agua'],
};

function idSesion() {
  let sid = sessionStorage.getItem(CLAVE_SID);
  if (!sid) {
    sid = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2)).slice(0, 36);
    sessionStorage.setItem(CLAVE_SID, sid);
  }
  return sid;
}

// Markdown mínimo y seguro: **negrita**, viñetas y saltos de línea (sin HTML inyectado).
function Texto({ texto }) {
  return String(texto).split('\n').map((linea, i) => {
    const partes = linea.split(/(\*\*[^*]+\*\*)/g).map((p, j) =>
      p.startsWith('**') && p.endsWith('**') ? <strong key={j}>{p.slice(2, -2)}</strong> : <React.Fragment key={j}>{p}</React.Fragment>);
    const esVineta = /^\s*[•\-]\s/.test(linea);
    return <div key={i} className={esVineta ? 'nx-linea nx-vineta' : 'nx-linea'}>{linea.trim() === '' ? ' ' : partes}</div>;
  });
}

const ICONOS = { lugar: '📍', evento: '📅', emprendimiento: '🛍️', saber: '📜', ruta: '🗺️', experiencia: '🌿' };

function Tarjeta({ t, onNavegar }) {
  return (
    <div className={'nx-card' + (t.pasado ? ' nx-card-pasada' : '')}>
      {t.img && <img src={t.img} alt="" loading="lazy" />}
      <div className="nx-card-body">
        <span className="nx-card-tipo">{ICONOS[t.tipo]} {t.tipo}{t.pasado ? ' · ya pasó' : ''}</span>
        <strong>{t.titulo}</strong>
        <small>{t.subtitulo}</small>
        {t.detalle && <small className="nx-card-detalle">{t.detalle}</small>}
        <div className="nx-card-acciones">
          {onNavegar && <button onClick={() => onNavegar(t.modulo)}>Ver en {t.modulo}</button>}
          {t.whatsapp && <button onClick={() => window.open('https://wa.me/' + t.whatsapp, '_blank', 'noopener')}>💬 WhatsApp</button>}
          {t.lat && t.lng && <button onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${t.lat},${t.lng}`, '_blank', 'noopener')}>🧭 Cómo llegar</button>}
        </div>
      </div>
    </div>
  );
}

function Itinerario({ it }) {
  return (
    <div className="nx-itinerario">
      {it.dias.map((d) => (
        <div key={d.dia} className="nx-it-dia">
          <div className="nx-it-titulo">{it.dias.length > 1 ? `Día ${d.dia} · ` : ''}{d.titulo}</div>
          {d.paradas.map((p, i) => (
            <div key={i} className="nx-it-parada">
              <span className="nx-it-hora">{p.hora}</span>
              <span className="nx-it-punto" />
              <div><strong>{p.nombre}</strong><small>{p.detalle}</small></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function NexiaChat({ variante = 'pagina', onNavegar, onCerrar, mensajeInicial }) {
  const [mensajes, setMensajes] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem(CLAVE_MSG)) || [BIENVENIDA]; } catch { return [BIENVENIDA]; }
  });
  const [entrada, setEntrada] = useState('');
  const [cargando, setCargando] = useState(false);
  const [escuchando, setEscuchando] = useState(false);
  const [voz, setVoz] = useState(false);
  const finRef = useRef(null);
  const reconRef = useRef(null);
  const enviadoInicial = useRef(false);

  const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
  const puedeHablar = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => { finRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [mensajes, cargando]);
  useEffect(() => { try { sessionStorage.setItem(CLAVE_MSG, JSON.stringify(mensajes.slice(-40))); } catch { /* */ } }, [mensajes]);
  useEffect(() => () => { if (puedeHablar) window.speechSynthesis.cancel(); }, [puedeHablar]);

  const leerEnVoz = (texto) => {
    if (!puedeHablar) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(texto.replace(/\*\*/g, '').replace(/[•📍🕒📅🗺️💡🌺🌿🍲🛍️📜💵🥁]/gu, ''));
    u.lang = 'es-CO';
    u.rate = 1.02;
    window.speechSynthesis.speak(u);
  };

  const enviar = async (texto) => {
    const msg = (texto ?? entrada).trim();
    if (!msg || cargando) return;
    setEntrada('');
    setMensajes((m) => [...m, { rol: 'user', texto: msg }]);
    setCargando(true);
    try {
      const r = await api('/ia/chat', { method: 'POST', body: { mensaje: msg, sessionId: idSesion() }, timeout: 40000 });
      setMensajes((m) => [...m, { rol: 'bot', texto: r.respuesta, tarjetas: r.tarjetas, itinerario: r.itinerario, sugerencias: r.sugerencias, logId: r.logId, modo: r.modo }]);
      if (voz) leerEnVoz(r.respuesta);
    } catch (e) {
      setMensajes((m) => [...m, { rol: 'bot', error: true, texto: e.status === 429 ? 'Recibí muchas preguntas seguidas. Espera un minuto y seguimos. 🙏' : 'No pude conectarme con el servidor de AFRONEXIA. Revisa que el backend esté encendido e inténtalo de nuevo.' }]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (mensajeInicial && !enviadoInicial.current) { enviadoInicial.current = true; enviar(mensajeInicial); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mensajeInicial]);

  const calificar = async (idx, valor) => {
    const m = mensajes[idx];
    if (!m.logId || m.calificacion) return;
    setMensajes((ms) => ms.map((x, i) => (i === idx ? { ...x, calificacion: valor } : x)));
    try { await api('/ia/feedback', { method: 'POST', body: { logId: m.logId, calificacion: valor } }); } catch { /* no bloquea */ }
  };

  const dictar = () => {
    if (!SR) return;
    if (escuchando) { reconRef.current?.stop(); return; }
    const rec = new SR();
    rec.lang = 'es-CO';
    rec.interimResults = false;
    rec.onresult = (ev) => { const t = ev.results[0][0].transcript; setEntrada(t); enviar(t); };
    rec.onend = () => setEscuchando(false);
    rec.onerror = () => setEscuchando(false);
    reconRef.current = rec;
    setEscuchando(true);
    rec.start();
  };

  const reiniciar = () => {
    sessionStorage.removeItem(CLAVE_SID);
    setMensajes([BIENVENIDA]);
  };

  const ultimo = mensajes[mensajes.length - 1];

  return (
    <div className={`nx-chat nx-${variante}`}>
      <div className="nx-header">
        <img src="/logo_afronexia.png" alt="" className="nx-avatar" onError={(e) => { e.target.style.display = 'none'; }} />
        <div className="nx-header-txt">
          <strong>NEXIA · Guía cultural</strong>
          <small>{cargando ? 'escribiendo…' : 'AFRONEXIA · Barrancabermeja'}</small>
        </div>
        <div className="nx-header-btns">
          {puedeHablar && <button title={voz ? 'Desactivar lectura en voz alta' : 'Leer respuestas en voz alta'} onClick={() => { setVoz(!voz); window.speechSynthesis.cancel(); }}>{voz ? '🔊' : '🔈'}</button>}
          <button title="Nueva conversación" onClick={reiniciar}>↺</button>
          {onCerrar && <button title="Cerrar" onClick={onCerrar}>✕</button>}
        </div>
      </div>

      <div className="nx-body" aria-live="polite">
        {mensajes.map((m, i) => (
          <div key={i} className={`nx-msg nx-${m.rol}${m.error ? ' nx-error' : ''}`}>
            <div className="nx-burbuja"><Texto texto={m.texto} /></div>
            {m.itinerario && <Itinerario it={m.itinerario} />}
            {m.tarjetas && m.tarjetas.length > 0 && (
              <div className="nx-cards">{m.tarjetas.map((t) => <Tarjeta key={t.tipo + t.id} t={t} onNavegar={onNavegar} />)}</div>
            )}
            {m.rol === 'bot' && m.logId && (
              <div className="nx-feedback">
                <span>¿Te sirvió?</span>
                <button className={m.calificacion === 1 ? 'activo' : ''} onClick={() => calificar(i, 1)} disabled={!!m.calificacion}>👍</button>
                <button className={m.calificacion === -1 ? 'activo' : ''} onClick={() => calificar(i, -1)} disabled={!!m.calificacion}>👎</button>
                {puedeHablar && <button onClick={() => leerEnVoz(m.texto)} title="Escuchar">🔊</button>}
              </div>
            )}
          </div>
        ))}
        {cargando && <div className="nx-msg nx-bot"><div className="nx-burbuja nx-typing"><span /><span /><span /></div></div>}
        <div ref={finRef} />
      </div>

      {!cargando && ultimo.rol === 'bot' && ultimo.sugerencias && ultimo.sugerencias.length > 0 && (
        <div className="nx-sugerencias">
          {ultimo.sugerencias.map((s) => <button key={s} onClick={() => enviar(s)}>{s}</button>)}
        </div>
      )}

      <form className="nx-footer" onSubmit={(e) => { e.preventDefault(); enviar(); }}>
        <input
          value={entrada}
          onChange={(e) => setEntrada(e.target.value)}
          placeholder="Pregunta por rutas, comida, eventos, saberes…"
          maxLength={500}
          aria-label="Mensaje para NEXIA"
        />
        {SR && <button type="button" className={'nx-mic' + (escuchando ? ' activo' : '')} onClick={dictar} title="Hablarle a NEXIA">🎙️</button>}
        <button type="submit" disabled={cargando || !entrada.trim()}>Enviar</button>
      </form>
    </div>
  );
}
