// Copy rule: no em dashes anywhere in site copy or markup.
// Scans the locale JSON and every source file; exits non-zero on a hit.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const targets = ['src', 'index.html', 'public'];
const bad = /—/; // em dash
const hits = [];

function walk(p) {
  const st = statSync(p);
  if (st.isDirectory()) return readdirSync(p).forEach((f) => walk(join(p, f)));
  if (!/\.(json|tsx?|html|css|txt|svg)$/.test(p)) return;
  readFileSync(p, 'utf8')
    .split('\n')
    .forEach((line, i) => bad.test(line) && hits.push(`${p.replace(root, '.')}:${i + 1}: ${line.trim().slice(0, 100)}`));
}
targets.forEach((t) => {
  try {
    walk(join(root, t));
  } catch {}
});

if (hits.length) {
  console.error(`Em dashes found (${hits.length}). Rewrite these lines:\n${hits.join('\n')}`);
  process.exit(1);
}
console.log('Copy check passed: no em dashes.');
