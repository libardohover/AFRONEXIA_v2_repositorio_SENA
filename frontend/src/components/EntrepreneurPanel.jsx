import React, { useState } from 'react';

export default function EntrepreneurPanel({ user }) {
  const [formData, setFormData] = useState({ nombre: '', categoria: 'Gastronomía', descripcion: '', ubicacion: 'Paseo del Río, Barrancabermeja', telefono_contacto: '+57 300 000 0000', precio: '' });
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [message, setMessage] = useState('');

  const handleOptimizeAI = () => {
    if (!formData.descripcion.trim()) { alert('Escribe unas palabras primero.'); return; }
    setIsOptimizing(true);
    setTimeout(() => {
      const enriquecido = `Especialidad tradicional "${formData.nombre || 'Plato Afro'}": ${formData.descripcion}. Elaborado artesanalmente siguiendo recetas ancestrales del Río Magdalena en Barrancabermeja.`;
      setFormData((prev) => ({ ...prev, descripcion: enriquecido }));
      setIsOptimizing(false);
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/v1/emprendimientos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id: user ? user.id : 2, nombre: formData.nombre, categoria: formData.categoria, descripcion: formData.descripcion, ubicacion: formData.ubicacion, telefono_contacto: formData.telefono_contacto })
      });
      if (res.ok) {
        setMessage('✅ ¡Publicado exitosamente en el catálogo!');
        setFormData({ nombre: '', categoria: 'Gastronomía', descripcion: '', ubicacion: 'Paseo del Río, Barrancabermeja', telefono_contacto: '+57 300 000 0000', precio: '' });
      }
    } catch { setMessage('❌ Error al guardar.'); }
  };

  return (
    <div className="panel-container">
      <div className="panel-header">
        <h2>🍲 Panel de Gestión del Emprendedor</h2>
        <p>Publica tus platos y experiencias para que los turistas te contacten.</p>
      </div>
      {message && <div className="alert-success">{message}</div>}
      <div className="panel-grid">
        <form onSubmit={handleSubmit} className="form-card">
          <h3>Publicar Nuevo Producto</h3>
          <div className="form-group">
            <label>Nombre del Plato:</label>
            <input type="text" required placeholder="Ej: Sancocho de Bocachico Doña Chava" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Categoría:</label>
              <select value={formData.categoria} onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}>
                <option value="Gastronomía">Gastronomía Ribereña</option>
                <option value="Artesanía">Artesanía y Turbantes</option>
                <option value="Música/Danza">Música Folclórica</option>
              </select>
            </div>
            <div className="form-group">
              <label>Precio ($ COP):</label>
              <input type="number" placeholder="25000" value={formData.precio} onChange={(e) => setFormData({ ...formData, precio: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <div className="label-ai-row">
              <label>Descripción:</label>
              <button type="button" className="btn-ai-magic" onClick={handleOptimizeAI} disabled={isOptimizing}>
                ✨ {isOptimizing ? 'Optimizando...' : 'Mejorar con IA'}
              </button>
            </div>
            <textarea rows="3" required placeholder="Describe tu plato..." value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Ubicación:</label>
              <input type="text" required value={formData.ubicacion} onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })} />
            </div>
            <div className="form-group">
              <label>WhatsApp:</label>
              <input type="text" required value={formData.telefono_contacto} onChange={(e) => setFormData({ ...formData, telefono_contacto: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn-submit-main">Guardar y Publicar</button>
        </form>

        <div className="preview-card">
          <h3>Vista Previa en Vivo</h3>
          <div className="card">
            <span className="badge">{formData.categoria}</span>
            <h3>{formData.nombre || 'Nombre de tu plato'}</h3>
            <p>{formData.descripcion || 'Descripción optimizada con IA...'}</p>
            <small>📍 {formData.ubicacion}</small>
          </div>
        </div>
      </div>
    </div>
  );
}