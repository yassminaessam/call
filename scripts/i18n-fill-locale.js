#!/usr/bin/env node
/**
 * i18n-fill-locale.js
 * Copies any missing keys from a source locale to a target locale (non-destructive for existing keys).
 * Usage:
 *   node scripts/i18n-fill-locale.js --from ar --to ar-EG [--dry]
 */
import fs from 'fs';
import path from 'path';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const LOCALES_DIR = path.join(ROOT, 'locales');
const args = process.argv.slice(2);

function getArg(name, fallback) {
  const i = args.indexOf(name);
  return i !== -1 ? args[i + 1] : fallback;
}

const FROM = getArg('--from', 'ar');
const TO = getArg('--to', 'ar-EG');
const DRY = args.includes('--dry');

function readJSON(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function writeJSON(file, data) { fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8'); }
function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }

function mergeMissing(srcObj, dstObj) {
  if (Array.isArray(srcObj)) return dstObj ?? srcObj; // arrays copied if missing
  if (srcObj && typeof srcObj === 'object') {
    const out = { ...(dstObj || {}) };
    for (const [k, v] of Object.entries(srcObj)) {
      out[k] = mergeMissing(v, out[k]);
    }
    return out;
  }
  return dstObj === undefined ? srcObj : dstObj; // keep existing target values
}

function main() {
  const fromDir = path.join(LOCALES_DIR, FROM);
  const toDir = path.join(LOCALES_DIR, TO);
  if (!fs.existsSync(fromDir)) { console.error('Source locale not found:', FROM); process.exit(1); }
  ensureDir(toDir);
  let added = 0; let filesProcessed = 0;
  for (const file of fs.readdirSync(fromDir)) {
    if (!file.endsWith('.json')) continue;
    const srcPath = path.join(fromDir, file);
    const dstPath = path.join(toDir, file);
    const src = readJSON(srcPath);
    const dst = fs.existsSync(dstPath) ? readJSON(dstPath) : {};
    const beforeFlat = flatten(dst);
    const merged = mergeMissing(src, dst);
    const afterFlat = flatten(merged);
    for (const k of Object.keys(afterFlat)) {
      if (!(k in beforeFlat)) added++;
    }
    if (!DRY) writeJSON(dstPath, merged);
    filesProcessed++;
  }
  console.log(`Filled locale '${TO}' from '${FROM}': +${added} keys across ${filesProcessed} domain files${DRY ? ' (dry-run)' : ''}.`);
}

function flatten(obj, prefix = '') {
  const out = {};
  for (const [k, v] of Object.entries(obj || {})) {
    const keyPath = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object') Object.assign(out, flatten(v, keyPath));
    else out[keyPath] = v;
  }
  return out;
}

main();
