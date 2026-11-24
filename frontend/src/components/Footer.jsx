import React from 'react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="footer-afro">
      <div className="footer-container">
        <div className="footer-col-main">
          <div className="footer-logo">
            <img src="/logo_afronexia.png" alt="Logo AFRONEXIA" className="footer-logo-img" />
            <div>
              <strong>AFRONEXIA</strong>
              <small className="footer-sena-tag">SENA • Centro de Comercio</small>
            </div>
          </div>
          <p className="footer-desc">
            Sistema de información inteligente para la gestión, preservación, promoción y aprovechamiento turístico de la memoria, cultura y economía de la población afrodescendiente de Barrancabermeja.
          </p>
        </div>

        <div className="footer-col">
          <h4>MÓDULOS</h4>
          <ul>
            <li onClick={() => setActiveTab('explorador')}>Explorador cultural y turístico</li>
            <li onClick={() => setActiveTab('memoria')}>Memoria y patrimonio</li>
            <li onClick={() => setActiveTab('agenda')}>Agenda cultural</li>
            <li onClick={() => setActiveTab('emprendimientos')}>Talentos y emprendimientos</li>
            <li onClick={() => setActiveTab('rutas')}>Rutas culturales</li>
            <li onClick={() => setActiveTab('experiencias')}>Experiencias turísticas</li>
            <li onClick={() => setActiveTab('asistente')}>Asistente turístico con IA</li>
            <li onClick={() => setActiveTab('admin')}>Panel administrativo</li>
            <li onClick={() => setActiveTab('guia-emprendedor')}>📘 Guía para emprendedores</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>ECOSISTEMA</h4>
          <p>Cultura + Memoria + Turismo + Economía con inteligencia artificial y participación comunitaria.</p>
          <small className="footer-loc">📍 Barrancabermeja, Santander • Colombia</small>
        </div>
      </div>
    </footer>
  );
}