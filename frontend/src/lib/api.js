// Cliente HTTP único del frontend. Configurable con VITE_API_URL (archivo frontend/.env).
export const API_URL = (import.meta.env.VITE_API_URL || '/api/v1').replace(/\/$/, '');

const CLAVE_SESION = 'afronexia_sesion';

export function leerSesion() {
  try { return JSON.parse(localStorage.getItem(CLAVE_SESION)) || null; } catch { return null; }
}
export function guardarSesion(sesion) {
  try { sesion ? localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion)) : localStorage.removeItem(CLAVE_SESION); } catch { /* modo privado */ }
}

export class ApiError extends Error {
  constructor(mensaje, status) { super(mensaje); this.status = status; }
}

export async function api(ruta, { method = 'GET', body, timeout = 20000 } = {}) {
  const sesion = leerSesion();
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  try {
    const r = await fetch(API_URL + ruta, {
      method,
      signal: ctrl.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(sesion && sesion.token ? { Authorization: 'Bearer ' + sesion.token } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    let datos = null;
    try { datos = await r.json(); } catch { /* sin cuerpo */ }
    if (r.status === 401 && sesion && sesion.token) {
      guardarSesion(null);
      window.dispatchEvent(new Event('afronexia:sesion-vencida'));
    }
    if (!r.ok) throw new ApiError((datos && datos.error) || `Error ${r.status}`, r.status);
    return datos;
  } catch (e) {
    if (e instanceof ApiError) throw e;
    throw new ApiError('No hay conexión con el servidor de AFRONEXIA.', 0);
  } finally {
    clearTimeout(t);
  }
}

export const formatoCOP = (n) => (n || n === 0 ? '$' + Number(n).toLocaleString('es-CO') : '');
