const { Pool } = require('pg');
require('dotenv').config();

// Admite DATABASE_URL (Render, Railway, Supabase...) o variables sueltas.
const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false })
  : new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'afronexia_db',
      connectionTimeoutMillis: 3000,
    });

pool.on('error', (err) => console.error('⚠️  Error inesperado en PostgreSQL:', err.message));

// Comprueba si la BD responde (cacheado 15 s) para que el sistema funcione en modo local si no hay BD.
let ultimoChequeo = { ok: false, t: 0 };
pool.disponible = async () => {
  if (Date.now() - ultimoChequeo.t < 15000) return ultimoChequeo.ok;
  try {
    await pool.query('SELECT 1');
    ultimoChequeo = { ok: true, t: Date.now() };
  } catch {
    ultimoChequeo = { ok: false, t: Date.now() };
  }
  return ultimoChequeo.ok;
};

module.exports = pool;
