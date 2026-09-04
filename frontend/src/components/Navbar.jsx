import React from 'react';

export default function Navbar({ activeTab, setActiveTab, user, onLogout }) {
  return (
    <header className="navbar-oficial">
      <div className="nav-container-oficial">
        <div className="nav-logo-oficial" onClick={() => setActiveTab('inicio')}>
          <img 
            src="/logo_afronexia.png" 
            alt="Logo AFRONEXIA" 
            className="navbar-logo-img"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <span className="logo-texto">AFRONEXIA</span>
        </div>

        <nav className="nav-links-oficial">
          <button className={activeTab === 'explorador' ? 'nav-btn-oficial active-tab' : 'nav-btn-oficial'} onClick={() => setActiveTab('explorador')}>Explorar</button>
          <button className={activeTab === 'memoria' ? 'nav-btn-oficial active-tab' : 'nav-btn-oficial'} onClick={() => setActiveTab('memoria')}>Memoria</button>
          <button className={activeTab === 'agenda' ? 'nav-btn-oficial active-tab' : 'nav-btn-oficial'} onClick={() => setActiveTab('agenda')}>Agenda</button>
          <button className={activeTab === 'emprendimientos' ? 'nav-btn-oficial active-tab' : 'nav-btn-oficial'} onClick={() => setActiveTab('emprendimientos')}>Emprendimientos</button>
          <button className={activeTab === 'rutas' ? 'nav-btn-oficial active-tab' : 'nav-btn-oficial'} onClick={() => setActiveTab('rutas')}>Rutas</button>
          <button className={activeTab === 'experiencias' ? 'nav-btn-oficial active-tab' : 'nav-btn-oficial'} onClick={() => setActiveTab('experiencias')}>Experiencias</button>
          
          <button className={activeTab === 'asistente' ? 'btn-ia-pill active-ia' : 'btn-ia-pill'} onClick={() => setActiveTab('asistente')}>
            🌿 Asistente IA
          </button>

          {user ? (
            <>
              {user.rol === 'administrador' && (
                <button className={activeTab === 'admin' ? 'nav-btn-oficial active-tab' : 'nav-btn-oficial'} onClick={() => setActiveTab('admin')}>Panel</button>
              )}
              <span className="user-nav-badge">👤 {user.nombre} ({user.rol})</span>
              <button className="nav-btn-oficial text-danger" onClick={onLogout}>Salir</button>
            </>
          ) : (
            <button className={activeTab === 'login' ? 'nav-btn-oficial active-tab' : 'nav-btn-oficial'} onClick={() => setActiveTab('login')}>Ingresar</button>
          )}
        </nav>
      </div>
    </header>
  );
}