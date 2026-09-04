import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [user, setUser] = useState({ nombre: 'Administrador', email: 'admin@afronexia.com', rol: 'administrador' });

  return (
    <div className="app-main-layout">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={() => { setUser(null); setActiveTab('inicio'); }} />
      <main className="main-content">
        {activeTab === 'inicio' && <HomeView setActiveTab={setActiveTab} />}
        {activeTab === 'explorador' && <ExploradorView setActiveTab={setActiveTab} />}
        {activeTab === 'memoria' && <MemoriaView setActiveTab={setActiveTab} />}
        {activeTab === 'agenda' && <AgendaView />}
        {activeTab === 'emprendimientos' && <EmprendimientosView user={user} setActiveTab={setActiveTab} />}
        {activeTab === 'rutas' && <RutasView />}
        {activeTab === 'experiencias' && <ExperienciasView />}
        {activeTab === 'asistente' && <AsistenteIAView />}
        {activeTab === 'login' && <LoginView setActiveTab={setActiveTab} onLoginSuccess={(u) => setUser(u)} />}
        {activeTab === 'admin' && <AdminPanelView user={user} setActiveTab={setActiveTab} onLogout={() => { setUser(null); setActiveTab('inicio'); }} />}
      </main>
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}