import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api';
import catalogoLocal from '../data/catalogo.json';

const MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEPT', 'OCT', 'NOV', 'DIC'];
const MESES_LARGO = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

// Igual que en el backend: completa día, mes, hora y si el evento ya pasó.
function decorarLocal(entidad, x) {
  if (entidad === 'eventos' && x.fecha_iso) {
    const d = new Date(x.fecha_iso);
    const h = d.getHours();
    return {
      ...x, dia: String(d.getDate()).padStart(2, '0'), mes: MESES[d.getMonth()],
      fecha: `${d.getDate()} de ${MESES_LARGO[d.getMonth()]} de ${d.getFullYear()}`,
      hora: `${String(((h + 11) % 12) + 1).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`,
      pasado: d < new Date(),
    };
  }
  return x;
}

/**
 * Carga una entidad del catálogo desde la API. Si el backend no responde,
 * usa la copia local (src/data/catalogo.json) para que la página nunca quede vacía.
 */
export default function useCatalogo(entidad) {
  const [datos, setDatos] = useState(() => (catalogoLocal[entidad] || []).map((x) => decorarLocal(entidad, x)));
  const [cargando, setCargando] = useState(true);
  const [fuente, setFuente] = useState('local');

  const recargar = useCallback(async () => {
    setCargando(true);
    try {
      const r = await api(`/catalogo/${entidad}`);
      setDatos(r);
      setFuente('api');
    } catch {
      setDatos((catalogoLocal[entidad] || []).map((x) => decorarLocal(entidad, x)));
      setFuente('local');
    } finally {
      setCargando(false);
    }
  }, [entidad]);

  useEffect(() => { recargar(); }, [recargar]);

  return { datos, cargando, fuente, recargar, setDatos };
}
