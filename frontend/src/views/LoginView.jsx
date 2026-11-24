import React, { useState } from 'react';
import CampoGuiado from '../components/CampoGuiado';
import { api } from '../lib/api';

const DEMO_PASSWORD = 'Afronexia2026*';

// En el registro usa la casilla guiada; en el inicio de sesión, una casilla normal.
function Campo({ guiado, clave, etiqueta, children }) {
  if (guiado) return <CampoGuiado paso="registro" clave={clave} etiqueta={etiqueta} className="form-group-afro">{children}</CampoGuiado>;
  return <div className="form-group-afro"><label>{etiqueta}:</label>{children}</div>;
}

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
    negocio_ubicacion: '',
    saber_tipo: 'Oralidad y Saberes'
  });

  const handleRoleChange = (rol) => {
    setSelectedRole(rol);
    setError('');
  };

  const campo = (k) => (e) => setFormData({ ...formData, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (isRegister && formData.password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres.'); return; }
    if (isRegister && selectedRole === 'emprendedor' && formData.telefono.replace(/\D/g, '').length < 10) {
      setError('Escribe tu WhatsApp con 57 delante y solo números (ej. 573001234567).'); return;
    }
    setLoading(true);
    try {
      const data = isRegister
        ? await api('/auth/register', { method: 'POST', body: { ...formData, telefono: formData.telefono.replace(/\D/g, ''), rol: selectedRole } })
        : await api('/auth/login', { method: 'POST', body: { email: formData.email, password: formData.password } });
      onLoginSuccess(data.usuario, data.token);
      redirigirSegunRol(data.usuario.rol);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const ingresarDemo = async (email) => {
    setError('');
    setLoading(true);
    try {
      const data = await api('/auth/login', { method: 'POST', body: { email, password: DEMO_PASSWORD } });
      onLoginSuccess(data.usuario, data.token);
      redirigirSegunRol(data.usuario.rol);
    } catch (err) {
      setError(err.message + ' (Los perfiles de prueba requieren el backend con seed.sql cargado.)');
    } finally {
      setLoading(false);
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

            </div>
          </div>
        )}

        {/* FORMULARIO DINÁMICO (en el registro cada casilla tiene su pestaña «¿Qué escribo aquí?») */}
        {isRegister && selectedRole === 'emprendedor' && (
          <div className="guia-registro-aviso">
            📘 ¿Primera vez? Toca <strong>ⓘ ¿Qué escribo aquí?</strong> en cada casilla o revisa la{' '}
            <button type="button" className="link-inline" onClick={() => setActiveTab('guia-emprendedor')}>guía paso a paso completa</button>.
          </div>
        )}
        <form onSubmit={handleSubmit} className="auth-unified-form">
          {isRegister && (
            <CampoGuiado paso="registro" clave="nombre" etiqueta="Nombre Completo" className="form-group-afro">
              <input type="text" required placeholder="Ej: María Aminta Perea" value={formData.nombre} onChange={campo('nombre')} maxLength={150} />
            </CampoGuiado>
          )}

          <div className="form-row-dual">
            <Campo guiado={isRegister} clave="email" etiqueta="Correo Electrónico">
              <input type="email" required placeholder="tu@correo.com" autoComplete="email" value={formData.email} onChange={campo('email')} />
            </Campo>
            <Campo guiado={isRegister} clave="password" etiqueta="Contraseña">
              <input type="password" required minLength={isRegister ? 8 : undefined} placeholder="••••••••" autoComplete={isRegister ? 'new-password' : 'current-password'} value={formData.password} onChange={campo('password')} />
            </Campo>
          </div>

          {/* CAMPOS ESPECÍFICOS PARA EMPRENDEDORES */}
          {isRegister && selectedRole === 'emprendedor' && (
            <div className="extra-role-fields">
              <span className="extra-role-badge">DATOS DEL EMPRENDIMIENTO AFRO</span>
              <div className="form-row-dual">
                <CampoGuiado paso="registro" clave="negocio_nombre" etiqueta="Nombre del Negocio / Taller" className="form-group-afro">
                  <input type="text" required placeholder="Ej: Sabores de Aminta" value={formData.negocio_nombre} onChange={campo('negocio_nombre')} maxLength={200} />
                </CampoGuiado>
                <CampoGuiado paso="registro" clave="negocio_categoria" etiqueta="Categoría Productiva" className="form-group-afro">
                  <select value={formData.negocio_categoria} onChange={campo('negocio_categoria')}>
                    <option value="Gastronomía">Gastronomía Tradicional</option>
                    <option value="Artesanía">Artesanías y Fibras</option>
                    <option value="Estética ancestral">Estética y Trenzado</option>
                    <option value="Música tradicional">Música y Tamboras</option>
                    <option value="Turismo comunitario">Turismo y Paseos en Lancha</option>
                  </select>
                </CampoGuiado>
              </div>
              <div className="form-row-dual">
                <CampoGuiado paso="registro" clave="negocio_ubicacion" etiqueta="Barrio / Comuna en Barrancabermeja" className="form-group-afro">
                  <input type="text" placeholder="Ej: Comuna 7, Paseo del Río" value={formData.negocio_ubicacion} onChange={campo('negocio_ubicacion')} />
                </CampoGuiado>
                <CampoGuiado paso="registro" clave="telefono" etiqueta="WhatsApp de Contacto" className="form-group-afro">
                  <input type="tel" required inputMode="numeric" placeholder="Ej: 573001234567" value={formData.telefono} onChange={campo('telefono')} />
                </CampoGuiado>
              </div>
            </div>
          )}

          {/* CAMPOS ESPECÍFICOS PARA GESTORES CULTURALES */}
          {isRegister && selectedRole === 'gestor_cultural' && (
            <div className="extra-role-fields">
              <span className="extra-role-badge">TIPO DE SABER PATRIMONIAL</span>
              <div className="form-group-afro">
                <label>Área Cultural Principal:</label>
                <select value={formData.saber_tipo} onChange={campo('saber_tipo')}>
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
          <span className="quick-access-title">O ingresa con perfiles de prueba (contraseña: Afronexia2026*):</span>
          <div className="quick-btn-group">
            <button className="btn-quick-tag admin-tag" disabled={loading} onClick={() => ingresarDemo('admin@afronexia.com')}>
              👑 Administrador
            </button>
            <button className="btn-quick-tag emp-tag" disabled={loading} onClick={() => ingresarDemo('chava@gastronomia.com')}>
              🍲 Emprendedor
            </button>
            <button className="btn-quick-tag gestor-tag" disabled={loading} onClick={() => ingresarDemo('emiro@cultura.org')}>
              📜 Gestor Cultural
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}