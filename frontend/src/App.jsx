import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NexiaChatbot from './components/NexiaChatbot';
import HomeView from './views/HomeView';
import ExploradorView from './views/ExploradorView';
import MemoriaView from './views/MemoriaView';
import AgendaView from './views/AgendaView';
import EmprendimientosView from './views/EmprendimientosView';
import RutasView from './views/RutasView';
import ExperienciasView from './views/ExperienciasView';
import AsistenteIAView from './views/AsistenteIAView';
import LoginView from './views/LoginView';
import AdminPanelView from './views/AdminPanelView';
import GuiaEmprendedorView from './views/GuiaEmprendedorView';
import { guardarSesion, leerSesion } from './lib/api';
import './App.css';
import './extras.css';

const PESTANAS = ['inicio', 'explorador', 'memoria', 'agenda', 'emprendimientos', 'rutas', 'experiencias', 'asistente', 'login', 'admin', 'guia-emprendedor'];
const desdeHash = () => { const h = window.location.hash.replace('#/', ''); return PESTANAS.includes(h) ? h : 'inicio'; };

export default function App() {
  const [activeTab, setTab] = useState(desdeHash);
  const [sesion, setSesion] = useState(leerSesion);
  const user = sesion ? sesion.usuario : null;

  // Navegación con #/modulo: permite compartir enlaces y usar el botón "atrás" del navegador.
  const setActiveTab = (t) => {
    setTab(t);
    if (window.location.hash !== '#/' + t) window.history.pushState(null, '', '#/' + t);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  useEffect(() => {
    const alCambiar = () => setTab(desdeHash());
    const alVencer = () => { setSesion(null); };
    window.addEventListener('popstate', alCambiar);
    window.addEventListener('afronexia:sesion-vencida', alVencer);
    return () => { window.removeEventListener('popstate', alCambiar); window.removeEventListener('afronexia:sesion-vencida', alVencer); };
  }, []);

  const onLoginSuccess = (usuario, token) => {
    const s = { usuario, token };
    guardarSesion(s);
    setSesion(s);
  };
  const onLogout = () => { guardarSesion(null); setSesion(null); setActiveTab('inicio'); };

  return (
    <div className="app-main-layout">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={onLogout} />
      <main className="main-content">
        {activeTab === 'inicio' && <HomeView setActiveTab={setActiveTab} />}
        {activeTab === 'explorador' && <ExploradorView setActiveTab={setActiveTab} />}
        {activeTab === 'memoria' && <MemoriaView setActiveTab={setActiveTab} user={user} />}
        {activeTab === 'agenda' && <AgendaView />}
        {activeTab === 'emprendimientos' && <EmprendimientosView user={user} setActiveTab={setActiveTab} />}
        {activeTab === 'rutas' && <RutasView />}
        {activeTab === 'experiencias' && <ExperienciasView user={user} />}
        {activeTab === 'asistente' && <AsistenteIAView setActiveTab={setActiveTab} />}
        {activeTab === 'login' && <LoginView setActiveTab={setActiveTab} onLoginSuccess={onLoginSuccess} />}
        {activeTab === 'admin' && <AdminPanelView user={user} setActiveTab={setActiveTab} onLogout={onLogout} />}
        {activeTab === 'guia-emprendedor' && <GuiaEmprendedorView setActiveTab={setActiveTab} user={user} />}
      </main>
      <Footer setActiveTab={setActiveTab} />
      {activeTab !== 'asistente' && <NexiaChatbot onNavegar={setActiveTab} />}
    </div>
  );
}
