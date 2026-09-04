import React, { useState } from 'react';

export default function LoginView({ onLoginSuccess, setActiveTab }) {
  const [isRegister, setIsRegister] = useState(false);
  const [selectedRole, setSelectedRole] = useState('visitante');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Campos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    negocio_nombre: '',
    negocio_categoria: 'Gastronomía',
    negocio_ubicacion: 'Comuna 7, Barrancabermeja',
    saber_tipo: 'Oralidad y Saberes'
  });

  const handleRoleChange = (rol) => {
    setSelectedRole(rol);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isRegister) {
      // REGISTRO DE ACTORES
      try {
        const res = await fetch('http://localhost:5000/api/v1/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            rol: selectedRole
          })
        });
        const data = await res.json();
        if (res.ok) {
          alert('🎉 ¡Bienvenido a AFRONEXIA, ' + data.usuario.nombre + '! Tu registro como ' + data.usuario.rol.toUpperCase() + ' ha sido exitoso.');
          onLoginSuccess(data.usuario);
          redirigirSegunRol(data.usuario.rol);
        } else {
          setError(data.error || 'Error al completar el registro.');
        }
      } catch {
        // Modo local de respaldo
        const fallbackUser = { nombre: formData.nombre || 'Usuario', email: formData.email, rol: selectedRole };
        onLoginSuccess(fallbackUser);
        redirigirSegunRol(selectedRole);
      } finally {
        setLoading(false);
      }
    } else {
      // INICIO DE SESIÓN
      try {
        const res = await fetch('http://localhost:5000/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });
        const data = await res.json();
        if (res.ok) {
          onLoginSuccess(data.usuario);
          redirigirSegunRol(data.usuario.rol);
        } else {
          setError(data.error || 'Credenciales incorrectas.');
        }
      } catch {
        // Fallback rápido
        const fallbackUser = { nombre: formData.email.split('@')[0], email: formData.email, rol: selectedRole };
        onLoginSuccess(fallbackUser);
        redirigirSegunRol(selectedRole);
      } finally {
        setLoading(false);
      }
    }
  };

  const redirigirSegunRol = (rol) => {
    if (rol === 'administrador') setActiveTab('admin');
    else if (rol === 'emprendedor') setActiveTab('emprendimientos');
    else if (rol === 'gestor_cultural') setActiveTab('memoria');
    else setActiveTab('explorador');
  };

  return (
    <div className="login-view-wrapper">
      <div className="actor-auth-container">
        {/* ENCABEZADO CON LOGO */}
        <div className="auth-header-logo">
          <img src="/logo_afronexia.png" alt="Logo AFRONEXIA" className="auth-logo-image" onError={(e) => { e.target.style.display = 'none'; }} />
          <h2>AFRONEXIA</h2>
          <p className="auth-header-desc">
            {isRegister 
              ? 'Regístrate como actor del ecosistema afrodescendiente de Barrancabermeja'
              : 'Ingresa para gestionar contenidos culturales, emprendimientos y experiencias'}
          </p>
        </div>

        {/* PESTAÑAS: INGRESAR / REGISTRARSE */}
        <div className="auth-mode-switch">
          <button className={!isRegister ? 'mode-tab active' : 'mode-tab'} onClick={() => { setIsRegister(false); setError(''); }}>
            Iniciar Sesión
          </button>
          <button className={isRegister ? 'mode-tab active' : 'mode-tab'} onClick={() => { setIsRegister(true); setError(''); }}>
            Registrarse como Nuevo Actor
          </button>
        </div>

        {error && <div className="alert-error-box">⚠️ {error}</div>}

        {/* SELECTOR DE ACTORES CULTURALES */}
        {isRegister && (
          <div className="actor-selector-section">
            <span className="section-label">SELECCIONA TU TIPO DE ACTOR EN EL SISTEMA:</span>
            <div className="actor-cards-grid">
              <div 
                className={selectedRole === 'visitante' ? 'actor-card selected' : 'actor-card'}
                onClick={() => handleRoleChange('visitante')}
              >
                <div className="actor-icon">🧭</div>
                <strong>Visitante / Turista</strong>
                <small>Explora el territorio, guarda favoritos y califica vivencias.</small>
              </div>

              <div 
                className={selectedRole === 'emprendedor' ? 'actor-card selected' : 'actor-card'}
                onClick={() => handleRoleChange('emprendedor')}
              >
                <div className="actor-icon">🍲</div>
                <strong>Emprendedor Afro</strong>
                <small>Publica tus platos, artesanías y recibe pedidos por WhatsApp.</small>
              </div>

              <div 
                className={selectedRole === 'gestor_cultural' ? 'actor-card selected' : 'actor-card'}
                onClick={() => handleRoleChange('gestor_cultural')}
              >
                <div className="actor-icon">📜</div>
                <strong>Gestor / Sabedor/a</strong>
                <small>Documenta saberes ancestrales y publica eventos folclóricos.</small>
              </div>

              <div 
                className={selectedRole === 'administrador' ? 'actor-card selected' : 'actor-card'}
                onClick={() => handleRoleChange('administrador')}
              >
                <div className="actor-icon">👑</div>
                <strong>Administrador</strong>
                <small>Gobernanza, auditoría y control de indicadores del sistema.</small>
              </div>
            </div>
          </div>
        )}

        {/* FORMULARIO DINÁMICO */}
        <form onSubmit={handleSubmit} className="auth-unified-form">
          {isRegister && (
            <div className="form-group-afro">
              <label>Nombre Completo:</label>
              <input 
                type="text" 
                required 
                placeholder="Ej: María Aminta Perea"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />
            </div>
          )}

          <div className="form-row-dual">
            <div className="form-group-afro">
              <label>Correo Electrónico:</label>
              <input 
                type="email" 
                required 
                placeholder="tu@correo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group-afro">
              <label>Contraseña:</label>
              <input 
                type="password" 
                required 
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          {/* CAMPOS ESPECÍFICOS PARA EMPRENDEDORES */}
          {isRegister && selectedRole === 'emprendedor' && (
            <div className="extra-role-fields">
              <span className="extra-role-badge">DATOS DEL EMPRENDIMIENTO AFRO</span>
              <div className="form-row-dual">
                <div className="form-group-afro">
                  <label>Nombre del Negocio / Taller:</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Ej: Sabores de Aminta"
                    value={formData.negocio_nombre}
                    onChange={(e) => setFormData({ ...formData, negocio_nombre: e.target.value })}
                  />
                </div>

                <div className="form-group-afro">
                  <label>Categoría Productiva:</label>
                  <select 
                    value={formData.negocio_categoria}
                    onChange={(e) => setFormData({ ...formData, negocio_categoria: e.target.value })}
                  >
                    <option value="Gastronomía">Gastronomía Tradicional</option>
                    <option value="Artesanía">Artesanías y Fibras</option>
                    <option value="Estética ancestral">Estética y Trenzado</option>
                    <option value="Música tradicional">Música y Tamboras</option>
                    <option value="Turismo comunitario">Turismo y Paseos en Lancha</option>
                  </select>
                </div>
              </div>

              <div className="form-row-dual">
                <div className="form-group-afro">
                  <label>Barrio / Comuna en Barrancabermeja:</label>
                  <input 
                    type="text" 
                    placeholder="Ej: Comuna 7, Paseo del Río"
                    value={formData.negocio_ubicacion}
                    onChange={(e) => setFormData({ ...formData, negocio_ubicacion: e.target.value })}
                  />
                </div>

                <div className="form-group-afro">
                  <label>WhatsApp de Contacto:</label>
                  <input 
                    type="text" 
                    placeholder="Ej: 573001234567"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* CAMPOS ESPECÍFICOS PARA GESTORES CULTURALES */}
          {isRegister && selectedRole === 'gestor_cultural' && (
            <div className="extra-role-fields">
              <span className="extra-role-badge">TIPO DE SABER PATRIMONIAL</span>
              <div className="form-group-afro">
                <label>Área Cultural Principal:</label>
                <select 
                  value={formData.saber_tipo}
                  onChange={(e) => setFormData({ ...formData, saber_tipo: e.target.value })}
                >
                  <option value="Oralidad y Saberes">Tradición Oral, Mitos y Relatos del Río</option>
                  <option value="Música y Danza">Cantos de Boga, Bullerengue y Tambora</option>
                  <option value="Cocinas Tradicionales">Portadora de Saberes Culinarios</option>
                  <option value="Medicina de Patio">Medicina Tradicional y Plantas de Azotea</option>
                </select>
              </div>
            </div>
          )}

          <button type="submit" className="btn-auth-main-submit" disabled={loading}>
            {loading ? 'Procesando...' : isRegister ? 'Completar Registro en AFRONEXIA' : 'Ingresar a mi Cuenta'}
          </button>
        </form>

        {/* ACCESOS RÁPIDOS DE PRUEBA */}
        <div className="quick-roles-access">
          <span className="quick-access-title">O ingresa rápidamente con perfiles de prueba:</span>
          <div className="quick-btn-group">
            <button className="btn-quick-tag admin-tag" onClick={() => { onLoginSuccess({ nombre: 'Admin General', email: 'admin@afronexia.com', rol: 'administrador' }); setActiveTab('admin'); }}>
              👑 Administrador
            </button>
            <button className="btn-quick-tag emp-tag" onClick={() => { onLoginSuccess({ nombre: 'María Aminta Perea', email: 'chava@gastronomia.com', rol: 'emprendedor' }); setActiveTab('emprendimientos'); }}>
              🍲 Emprendedor
            </button>
            <button className="btn-quick-tag gestor-tag" onClick={() => { onLoginSuccess({ nombre: 'Don Emiro Mosquera', email: 'emiro@cultura.org', rol: 'gestor_cultural' }); setActiveTab('memoria'); }}>
              📜 Gestor Cultural
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}