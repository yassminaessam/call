#!/usr/bin/env node
/**
 * Pseudo locale generator (ar-EG-x)
 * Expands strings and wraps them with markers to reveal truncation & layout issues.
 *
 * Usage:
 *   node scripts/i18n-pseudo-locale.js [--base en|ar] [--pct 35] [--digits arabic|latin]
 */
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
function getArg(name, fallback) {
  const idx = args.indexOf(name);
  if (idx !== -1 && args[idx + 1]) return args[idx + 1];
  return fallback;
}

const BASE = getArg('--base', 'en');
const EXPAND_PCT = parseInt(getArg('--pct', '35'), 10); // percentage expansion
const DIGITS = getArg('--digits', 'arabic');
const TARGET = 'ar-EG-x';
const ROOT = path.resolve(process.cwd(), 'locales');

const accentMap = {a:'á', e:'ë', i:'ï', o:'ø', u:'û', A:'Â', E:'Ë', I:'Ï', O:'Ø', U:'Û'};
const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
const latinDigits = '0123456789';

function expand(str){
  if (typeof str !== 'string') return str;
  const accented = str.split('').map(c => accentMap[c] || c).join('');
  const extra = Math.max(2, Math.floor(accented.length * (EXPAND_PCT/100)));
  const digitSource = DIGITS === 'latin' ? latinDigits : arabicDigits;
  let pad = '';
  while (pad.length < extra) pad += digitSource[pad.length % 10];
  return `⟦${accented}${pad}⟧`;
}

function deep(obj){
  if (Array.isArray(obj)) return obj.map(deep);
  if (obj && typeof obj === 'object') {
    const out = {};
    for (const [k,v] of Object.entries(obj)) out[k] = deep(v);
    return out;
  }
  return expand(obj);
}

function ensureDir(d){ if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }

function main(){
  const baseDir = path.join(ROOT, BASE);
  if (!fs.existsSync(baseDir)) {
    console.error(`Base locale ${BASE} not found under ${ROOT}`);
    process.exit(1);
  }
  const targetDir = path.join(ROOT, TARGET);
  ensureDir(targetDir);
  let count = 0;
  for (const file of fs.readdirSync(baseDir)) {
    if (!file.endsWith('.json')) continue;
    const raw = fs.readFileSync(path.join(baseDir, file), 'utf8');
    let data;
    try { data = JSON.parse(raw); } catch { data = {}; }
    const transformed = deep(data);
    fs.writeFileSync(path.join(targetDir, file), JSON.stringify(transformed, null, 2) + '\n', 'utf8');
    count++;
  }
  fs.writeFileSync(path.join(targetDir, 'README.txt'), `Pseudo locale generated from ${BASE} +${EXPAND_PCT}% expansion digits=${DIGITS}\n`, 'utf8');
  console.log(`✅ Pseudo locale '${TARGET}' regenerated from '${BASE}' (${count} files, +${EXPAND_PCT}% expansion).`);
}

main();
