// Checks every translated locale against en.json:
//   - same keys and the same array lengths (nothing missing, nothing extra)
//   - no string left identical to English, except names and codes that stay the same
// Run: npm run check:locales   (also runs before every build)
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'locales');
const en = JSON.parse(readFileSync(join(dir, 'en.json'), 'utf8'));

// Strings allowed to match English: brand names, place names, codes, reviews' original text.
const same = (path, value) =>
  /^_status$|\.lang$|\.quote$|^reviews\.items\.\d+\.quote|tagline|siteName|avatarLabel|logoLabel|\.year$/.test(path) ||
  /^[\d\s.,:+\-/()]*$/.test(value) ||
  // Words that are spelled the same in the target language.
  /^(Issam|Ninja|Tour|Tours|Home|Questions|Distance|Video|Wadi Shab|Wadi Bani Khalid|Bimmah Sinkhole|Sur|Birkat Al Mawz|Bait Al Safah|Misfat Al Abriyeen|Nizwa|Al Hamra|Quad|Dune bashing|Logo|Menu|FAQ|Toyota 4x4)$/i.test(value);

const problems = [];
function walk(a, b, path, code, strict) {
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return problems.push(`${code}: ${path} should be a list of ${a.length}`);
    a.forEach((v, i) => walk(v, b[i], `${path}.${i}`, code, strict));
  } else if (a && typeof a === 'object') {
    if (!b || typeof b !== 'object') return problems.push(`${code}: ${path} missing`);
    for (const k of Object.keys(a)) walk(a[k], b[k], path ? `${path}.${k}` : k, code, strict);
    for (const k of Object.keys(b)) if (!(k in a) && !k.startsWith('_')) problems.push(`${code}: ${path ? path + '.' : ''}${k} is not in en.json`);
  } else if (typeof a === 'string') {
    if (typeof b !== 'string' || !b.trim()) return problems.push(`${code}: ${path} missing`);
    if (strict && a === b && a.length > 3 && !same(path, a)) problems.push(`${code}: ${path} is still English: "${a.slice(0, 60)}"`);
  }
}

for (const f of readdirSync(dir).filter((f) => f.endsWith('.json') && f !== 'en.json')) {
  const code = f.replace('.json', '');
  const m = JSON.parse(readFileSync(join(dir, f), 'utf8'));
  walk(en, m, '', code, m._status !== 'todo');
}
if (problems.length) {
  console.error(`Locale check failed (${problems.length}):\n${problems.join('\n')}`);
  process.exit(1);
}
console.log('Locale check passed.');
