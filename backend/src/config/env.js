require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'afronexia-dev-secret-cambiar';
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET no está definido en .env; se usa un secreto de desarrollo. Defínanlo antes de publicar.');
}

module.exports = {
  PORT: Number(process.env.PORT) || 5000,
  JWT_SECRET,
  JWT_EXPIRES: process.env.JWT_EXPIRES || '8h',
  CORS_ORIGINS: (process.env.CORS_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000').split(',').map((s) => s.trim()),
  ALLOW_ADMIN_SIGNUP: process.env.ALLOW_ADMIN_SIGNUP === 'true',
};
