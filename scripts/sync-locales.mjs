// Keeps every locale file in step with en.json, the source of truth.
//   - Missing locale files are created as English copies marked "_status": "todo".
//   - Keys missing from an existing locale are filled from English.
//   - Keys that no longer exist in English are removed.
//   - Translated strings are never overwritten. Locales still marked "todo" are re-copied from English.
// Run: npm run locales:sync
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'locales');
const codes = ['ar', 'de', 'ru', 'es', 'it', 'fr', 'pt', 'ca', 'zh', 'hi', 'bal'];
const en = JSON.parse(readFileSync(join(dir, 'en.json'), 'utf8'));

function merge(source, target) {
  if (Array.isArray(source)) {
    return source.map((item, i) => merge(item, Array.isArray(target) ? target[i] : undefined));
  }
  if (source && typeof source === 'object') {
    const out = {};
    for (const key of Object.keys(source)) out[key] = merge(source[key], target?.[key]);
    return out;
  }
  return target === undefined ? source : target;
}

for (const code of codes) {
  const file = join(dir, `${code}.json`);
  const current = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : undefined;
  // An untranslated locale is only an English copy, so refresh it from en.json in full.
  const existing = current?._status === 'todo' ? undefined : current;
  const merged = merge(en, existing);
  if (!existing) {
    merged._status = 'todo';
  }
  const out = {
    _status: merged._status,
    _todo: merged._status === 'todo'
      ? `TODO: translate into "${code}". Every string below is an English placeholder copied from en.json. Set "_status" to "done" when translated.`
      : undefined,
    ...merged,
  };
  writeFileSync(file, JSON.stringify(out, null, 2) + '\n');
  console.log(`${code}.json ${existing ? 'synced' : 'created'} (${out._status})`);
}
