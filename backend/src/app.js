const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { PORT, CORS_ORIGINS } = require('./config/env');
const pool = require('./config/db');
const { autenticacionOpcional } = require('./middleware/auth');
const { noEncontrado, manejadorErrores } = require('./middleware/errores');
const { proveedorActivo } = require('./services/nexia/proveedores');

const app = express();
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: (origin, cb) => cb(null, !origin || CORS_ORIGINS.includes('*') || CORS_ORIGINS.includes(origin)) }));
app.use(express.json({ limit: '200kb' }));
app.use(autenticacionOpcional);

app.get('/api/v1/salud', async (_req, res) => {
  res.json({ ok: true, baseDatos: (await pool.disponible()) ? 'conectada' : 'no disponible (modo local)', ia: proveedorActivo(), version: '2.0.0' });
});

app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/ia', require('./routes/ai.routes'));
app.use('/api/v1', require('./routes/api.routes'));

app.use(noEncontrado);
app.use(manejadorErrores);

if (require.main === module) {
  app.listen(PORT, async () => {
    console.log('🚀 Servidor AFRONEXIA corriendo en http://localhost:' + PORT);
    console.log(`   Base de datos: ${(await pool.disponible()) ? 'conectada' : 'NO disponible → catálogo en modo local'}`);
    console.log(`   Agente NEXIA: proveedor "${proveedorActivo()}"`);
  });
}

module.exports = app;
