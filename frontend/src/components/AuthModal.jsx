import React, { useState } from 'react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '', rol: 'visitante' });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
      try {
        const res = await fetch('http://localhost:5000/api/v1/usuarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre: formData.nombre, email: formData.email, password_hash: formData.password, rol: formData.rol })
        });
        const data = await res.json();
        if (res.ok) { onLoginSuccess(data); onClose(); }
        else { setError(data.error || 'Error al registrar usuario'); }
      } catch { setError('Error de conexión'); }
    } else {
      try {
        const res = await fetch('http://localhost:5000/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });
        const data = await res.json();
        if (res.ok) { onLoginSuccess(data.usuario); onClose(); }
        else { setError('Prueba: admin@afronexia.com o chava@gastronomia.com'); }
      } catch { setError('Error de conexión con el backend'); }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{isRegister ? 'Crear Cuenta en AFRONEXIA' : 'Iniciar Sesión'}</h3>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>
        {error && <div className="alert-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <div className="form-group">
              <label>Nombre Completo:</label>
              <input type="text" required value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
            </div>
          )}
          <div className="form-group">
            <label>Correo Electrónico:</label>
            <input type="email" required placeholder="ejemplo@correo.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Contraseña:</label>
            <input type="password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          </div>
          {isRegister && (
            <div className="form-group">
              <label>Rol:</label>
              <select value={formData.rol} onChange={(e) => setFormData({ ...formData, rol: e.target.value })}>
                <option value="visitante">Visitante / Turista</option>
                <option value="emprendedor">Emprendedor Afrodescendiente</option>
                <option value="gestor_cultural">Gestor Cultural</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>
          )}
          <button type="submit" className="btn-submit">{isRegister ? 'Registrarse' : 'Ingresar'}</button>
        </form>
        <button className="btn-switch" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate aquí'}
        </button>
      </div>
    </div>
  );
}