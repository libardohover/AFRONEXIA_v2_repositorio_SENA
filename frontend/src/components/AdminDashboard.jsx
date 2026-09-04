import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ usuarios: 3, emprendimientos: 2, eventos: 2, consultasIA: 14, logsRecientes: [] });

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/admin/stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => console.log('Cargando estadísticas'));
  }, []);

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>📊 Panel Administrativo y Métricas del Sistema</h2>
        <p>Monitoreo de tráfico, eventos y auditoría de la IA (**RF-13, RF-16**).</p>
      </div>
      <div className="kpi-grid">
        <div className="kpi-card green"><h3>👥 Usuarios</h3><div className="kpi-number">{stats.usuarios}</div><small>Registrados</small></div>
        <div className="kpi-card orange"><h3>🍲 Emprendimientos</h3><div className="kpi-number">{stats.emprendimientos}</div><small>Activos</small></div>
        <div className="kpi-card gold"><h3>📅 Eventos</h3><div className="kpi-number">{stats.eventos}</div><small>En agenda</small></div>
        <div className="kpi-card purple"><h3>🤖 Consultas IA</h3><div className="kpi-number">{stats.consultasIA}</div><small>Interacciones</small></div>
      </div>
      <div className="table-card">
        <h3>📋 Historial Reciente de la IA (Auditoría RF-19)</h3>
        <table className="custom-table">
          <thead>
            <tr><th>ID</th><th>Pregunta del Visitante</th><th>Tokens</th></tr>
          </thead>
          <tbody>
            {stats.logsRecientes.length > 0 ? (
              stats.logsRecientes.map((log) => (
                <tr key={log.id}>
                  <td>#{log.id}</td>
                  <td><strong>{log.pregunta}</strong></td>
                  <td><span className="token-badge">{log.tokens_usados || 45}</span></td>
                </tr>
              ))
            ) : (
              <tr><td>#1</td><td>¿Dónde comer pescado frito?</td><td><span className="token-badge">50</span></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}