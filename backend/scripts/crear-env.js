/**
 * Crea (o actualiza) backend/.env a partir de .env.example.
 * Uso: node scripts/crear-env.js <contraseña_postgres> [usuario] [puerto]
 * - Pone la contraseña de PostgreSQL.
 * - Genera un JWT_SECRET aleatorio si no existe uno propio.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const [password = '', usuario = 'postgres', puerto = '5432'] = process.argv.slice(2);
const dir = path.resolve(__dirname, '..');
const destino = path.join(dir, '.env');
let texto = fs.existsSync(destino) ? fs.readFileSync(destino, 'utf8') : fs.readFileSync(path.join(dir, '.env.example'), 'utf8');

const poner = (clave, valor) => {
  const re = new RegExp(`^${clave}=.*$`, 'm');
  texto = re.test(texto) ? texto.replace(re, `${clave}=${valor}`) : `${texto.trimEnd()}\n${clave}=${valor}\n`;
};
poner('DB_PASSWORD', password);
poner('DB_USER', usuario);
poner('DB_PORT', puerto);
const actual = (texto.match(/^JWT_SECRET=(.*)$/m) || [])[1] || '';
if (!actual || actual.startsWith('cambia-esto')) poner('JWT_SECRET', crypto.randomBytes(48).toString('hex'));

fs.writeFileSync(destino, texto);
console.log('✅ Archivo backend/.env listo.');
