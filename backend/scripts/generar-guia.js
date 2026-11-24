/**
 * Genera docs/GUIA_REGISTRO_EMPRENDIMIENTO.md desde frontend/src/data/guiaEmprendimiento.json,
 * la misma fuente que alimenta las pestañas «¿Qué escribo aquí?» del formulario.
 * Uso: node scripts/generar-guia.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const g = JSON.parse(fs.readFileSync(path.join(ROOT, 'frontend', 'src', 'data', 'guiaEmprendimiento.json'), 'utf8'));

const md = [`# ${g.titulo}`, '', g.intro, '', '## Antes de empezar, ten a mano', '', ...g.antes.map((a) => `- ${a}`), ''];
g.pasos.forEach((p) => {
  md.push(`## ${p.titulo}`, '', `**Dónde:** ${p.donde}`, '');
  p.campos.forEach((c, i) => {
    md.push(`### ${i + 1}. ${c.etiqueta} ${c.obligatorio ? '(obligatorio)' : '(opcional)'}`, '',
      `- **Qué escribir:** ${c.que}`, `- **Ejemplo:** \`${c.ejemplo}\``, `- **Evita:** ${c.evita}`, '');
  });
});
md.push('## Paso 3 · ¿Qué pasa después de publicar?', '', ...g.despues.map((a) => `- ${a}`), '',
  '---', '_Esta guía también está dentro del sistema: menú inferior → «Guía para emprendedores», y en cada casilla del formulario con la pestaña «ⓘ ¿Qué escribo aquí?»._', '');
const destino = path.join(ROOT, 'docs', 'GUIA_REGISTRO_EMPRENDIMIENTO.md');
fs.writeFileSync(destino, md.join('\n'));
console.log('✅ Generada', destino);
