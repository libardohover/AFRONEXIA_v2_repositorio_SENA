import React, { useState } from 'react';

export default function HomeView({ setActiveTab }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiado, setCopiado] = useState(false);

  const handleCopiar = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleCompartir = () => {
    if (navigator.share) {
      navigator.share({
        title: 'AFRONEXIA',
        text: 'Descubre la cultura y turismo afrodescendiente de Barrancabermeja',
        url: window.location.href,
      }).catch(() => {});
    } else {
      handleCopiar();
    }
  };

  const handleWpp = () => {
    window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent('Descubre AFRONEXIA en Barrancabermeja: ' + window.location.href), '_blank');
  };

  return (
    <div className="view-container">
      {/* HERO BANNER */}
      <section className="home-hero">
        <div className="hero-tag">Barrancabermeja • Magdalena Medio</div>
        <h1 className="hero-title">El río también guarda <span className="text-highlight">memoria afro</span></h1>
        <p className="hero-subtitle">
          AFRONEXIA conecta cultura, memoria, turismo y economía de la población afrodescendiente de Barrancabermeja en un solo ecosistema digital con inteligencia artificial.
        </p>

        {/* REPRODUCTOR DE VIDEO */}
        <div className="video-box-center">
          <video className="video-player-afro" controls autoPlay muted loop playsInline>
            <source src="/video_presentacion_nexia.mp4" type="video/mp4" />
          </video>
          <div className="video-footer-tag">
            🌺 <strong>Conoce a NexIA:</strong> Asistente virtual y guía cultural de Barrancabermeja
          </div>
        </div>

        {/* BUSCADOR */}
        <div className="hero-search-box">
          <input 
            type="text" 
            placeholder="🔍 Buscar un lugar, un saber, una ruta, un evento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setActiveTab('explorador')}
          />
        </div>

        {/* BOTONES ACCIÓN */}
        <div className="hero-cta-group">
          <button className="btn-hero-ia" onClick={() => setActiveTab('asistente')}>🌿 Planear mi visita con IA</button>
          <button className="btn-hero-explore" onClick={() => setActiveTab('explorador')}>Explorar el territorio</button>
        </div>

        {/* PÍLDORAS */}
        <div className="hero-metrics-row">
          <div className="metric-pill"><strong>8</strong> módulos</div>
          <div className="metric-pill"><strong>4</strong> rutas y experiencias</div>
          <div className="metric-pill"><strong>5</strong> saberes documentados</div>
          <div className="metric-pill"><strong>IA</strong> recomendación</div>
        </div>
      </section>

      {/* COMPARTE */}
      <section className="share-card-afro">
        <span className="share-tag">ECOSISTEMA CULTURAL</span>
        <h2>La memoria afro se <span className="text-highlight">cuida contándola</span></h2>
        <p>Envía AFRONEXIA a quien deba conocer las rutas, los saberes tradicionales y los emprendimientos afrodescendientes de Barrancabermeja.</p>
        
        <div className="share-btns-row">
          <button className="btn-share-clean btn-share-main" onClick={handleCompartir}>
            <span style={{ fontSize: '16px' }}>🔗</span> Compartir proyecto
          </button>
          <button className="btn-share-clean btn-share-copy" onClick={handleCopiar}>
            <span style={{ fontSize: '16px' }}>📋</span> {copiado ? '¡Enlace copiado!' : 'Copiar enlace'}
          </button>
          <button className="btn-share-clean btn-share-wpp" onClick={handleWpp}>
            <span style={{ fontSize: '18px' }}>💬</span> WhatsApp
          </button>
        </div>
      </section>
    </div>
  );
}