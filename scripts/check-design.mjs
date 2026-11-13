#!/usr/bin/env node
// Checks the public CSS against the tokens in DESIGN.md.
// - Text under 12 px (.75rem) always fails: it is a readability regression.
// - Hex colours outside app/globals.css and radii outside the scale are reported
//   as existing debt; pass --strict to make them fail too.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const strict = process.argv.includes('--strict');
const allowedRadii = new Set(['0', '6px', '12px', '999px', '50%', 'var(--public-control-radius)', 'inherit']);

const cssFiles = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.css')) cssFiles.push(full);
  }
})(path.join(root, 'app'));

const errors = [];
const debt = { hex: 0, radius: 0 };
const debtByFile = new Map();
const note = (file, kind) => {
  debt[kind] += 1;
  const key = path.relative(root, file);
  debtByFile.set(key, (debtByFile.get(key) ?? 0) + 1);
};

for (const file of cssFiles) {
  const relative = path.relative(root, file);
  // The study workspace (globals.css) keeps its own reading scale; tokens live there.
  const isTokens = relative === path.join('app', 'globals.css');
  const css = fs.readFileSync(file, 'utf8');
  for (const match of css.matchAll(/font-size\s*:\s*(\d*\.?\d+)(rem|px)/g)) {
    const px = match[2] === 'rem' ? Number(match[1]) * 16 : Number(match[1]);
    if (px < 12 && !isTokens) errors.push(`${relative}: ${match[0]} (mínimo 12 px)`);
  }
  if (isTokens) continue;
  for (let i = css.match(/#[0-9a-fA-F]{3,8}\b/g)?.length ?? 0; i > 0; i -= 1) note(file, 'hex');
  for (const match of css.matchAll(/border-radius\s*:\s*([^;}]+)/g)) {
    const values = match[1].trim().replace(/!important/, '').trim().split(/\s+/);
    if (values.some(value => !allowedRadii.has(value))) note(file, 'radius');
  }
}

if (errors.length) {
  console.error(`Texto por debajo de 12 px (${errors.length}):\n  ${errors.join('\n  ')}`);
}
console.log(`Deuda de diseño: ${debt.hex} colores hex fuera de globals.css, ${debt.radius} radios fuera de la escala 6/12/999 px.`);
for (const [file, count] of [...debtByFile].sort((a, b) => b[1] - a[1])) console.log(`  ${file}: ${count}`);
if (errors.length || (strict && (debt.hex || debt.radius))) process.exit(1);
console.log('PASS: ningún texto público por debajo de 12 px.');
