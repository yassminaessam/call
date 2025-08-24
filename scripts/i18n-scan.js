#!/usr/bin/env node
/**
 * i18n-scan.js
 * Combined tool:
 *  1. Scan for translation usage keys: t('domain.key') / t("domain.key")
 *  2. Diff against locale JSON files in /locales/<locale>/<domain>.json
 *  3. (Optional) Heuristic scan for potential hardcoded UI strings not wrapped in t()
 *
 * Flags:
 *  --json            Output JSON summary
 *  --strict          Exit code 2 if there are missing keys in any locale
 *  --no-hardcoded    Skip hardcoded string heuristic
 *  --only-hardcoded  Only run hardcoded heuristic
 */
import fs from 'fs';
import path from 'path';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const LOCALES_DIR = path.join(ROOT, 'locales');
const SRC_DIRS = ['client', 'server', 'shared'].map(p => path.join(ROOT, p)).filter(p => fs.existsSync(p));

const args = process.argv.slice(2);
const JSON_OUT = args.includes('--json');
const STRICT = args.includes('--strict');
const ONLY_HARDCODED = args.includes('--only-hardcoded');
const SKIP_HARDCODED = args.includes('--no-hardcoded');

// --------------------- File Walking ---------------------
function walk(dir, exts = ['.ts', '.tsx', '.js', '.jsx']) {
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop();
    if (!d) continue;
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue;
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (exts.includes(path.extname(entry.name))) out.push(full);
    }
  }
  return out;
}

// --------------------- Usage Extraction -----------------
const USAGE_REGEX = /\bt\(\s*([`'"])([A-Za-z0-9_-]+\.[^`'"\)]+)\1/g; // t('domain.key.path')
function extractUsages(content) {
  const keys = new Set();
  let m;
  while ((m = USAGE_REGEX.exec(content))) {
    keys.add(m[2].trim());
  }
  return keys;
}

// --------------------- Locale Loading -------------------
function loadLocales() {
  const locales = {};
  if (!fs.existsSync(LOCALES_DIR)) return locales;
  for (const loc of fs.readdirSync(LOCALES_DIR)) {
    const locPath = path.join(LOCALES_DIR, loc);
    if (!fs.statSync(locPath).isDirectory()) continue;
    locales[loc] = {};
    for (const file of fs.readdirSync(locPath)) {
      if (!file.endsWith('.json') || file.startsWith('_')) continue;
      const domain = file.replace(/\.json$/, '');
      try {
        const raw = fs.readFileSync(path.join(locPath, file), 'utf8');
        locales[loc][domain] = JSON.parse(raw);
      } catch (e) {
        console.warn(`[i18n-scan] Failed to parse ${loc}/${file}: ${e.message}`);
        locales[loc][domain] = {};
      }
    }
  }
  return locales;
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

// --------------------- Hardcoded Detection --------------
const HARD_EXTS = ['.tsx', '.ts'];
const IGNORE_LINE_PATTERNS = [/class(Name)?=/, /import /, /https?:\/\//, /console\./, /aria-/, /data-/, /<\/?[A-Z][A-Za-z0-9]+/];
// naive text between tags or attribute values
const TEXT_REGEX = />\s*([^<>{}][^<>{}]*)\s*<|\b(placeholder|label|title|aria-label)=['"]([^'"]+)['"]/g;

function shouldIgnore(line) { return IGNORE_LINE_PATTERNS.some(r => r.test(line)); }

function scanHardcoded(file) {
  if (!HARD_EXTS.includes(path.extname(file))) return []; // limit
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split(/\r?\n/);
  const findings = [];
  lines.forEach((line, idx) => {
    if (shouldIgnore(line)) return;
    let m;
    TEXT_REGEX.lastIndex = 0;
    while ((m = TEXT_REGEX.exec(line))) {
      const raw = m[1] || m[3];
      if (!raw) continue;
      const text = raw.trim();
      if (!text) continue;
      if (/^[0-9]+$/.test(text)) continue;
      // Basic filter: at least one letter, not already using t(
      if (/[A-Za-z\u0600-\u06FF]/.test(text) && !/\bt\(/.test(line)) {
        findings.push({ file: path.relative(ROOT, file), line: idx + 1, text });
      }
    }
  });
  return findings;
}

// --------------------- Main -----------------------------
function main() {
  const allFiles = SRC_DIRS.flatMap(d => walk(d));
  let usageKeys = new Set();
  const fileUsageMap = {};
  if (!ONLY_HARDCODED) {
    for (const f of allFiles) {
      const c = fs.readFileSync(f, 'utf8');
      const u = extractUsages(c);
      if (u.size) fileUsageMap[f] = Array.from(u).sort();
      u.forEach(k => usageKeys.add(k));
    }
  }

  const locales = ONLY_HARDCODED ? {} : loadLocales();
  const localeNames = Object.keys(locales).sort();
  const flatLocales = {};
  if (!ONLY_HARDCODED) {
    for (const loc of localeNames) {
      flatLocales[loc] = {};
      for (const [domain, tree] of Object.entries(locales[loc])) {
        const flat = flatten(tree);
        for (const k of Object.keys(flat)) flatLocales[loc][`${domain}.${k}`] = flat[k];
      }
    }
  }

  const IGNORE_USAGE_KEYS = new Set([
    'dashboard.nonexistent' // intentional test key in translation.spec.tsx
  ]);
  // Remove ignored keys from usage so they don't show as missing.
  IGNORE_USAGE_KEYS.forEach(k => usageKeys.delete(k));
  const usageArray = Array.from(usageKeys).sort();
  const missingPerLocale = {};
  const unusedPerLocale = {};
  if (!ONLY_HARDCODED) {
    for (const loc of localeNames) {
      const defined = new Set(Object.keys(flatLocales[loc]));
      missingPerLocale[loc] = usageArray.filter(k => !defined.has(k));
      unusedPerLocale[loc] = Array.from(defined).filter(k => !usageKeys.has(k));
    }
  }

  let hardcoded = [];
  if (!SKIP_HARDCODED) {
    for (const f of allFiles) hardcoded = hardcoded.concat(scanHardcoded(f));
  }

  const summary = {
    locales: localeNames,
    totalUsageKeys: usageArray.length,
    filesScanned: allFiles.length,
    missingPerLocale,
    unusedPerLocale,
    hardcodedCount: hardcoded.length
  };

  if (JSON_OUT) {
    console.log(JSON.stringify({ summary, hardcoded, fileUsageMap }, null, 2));
  } else {
    console.log('\n=== i18n Usage Summary ===');
    console.log('Locales:', localeNames.join(', ') || '(none)');
    console.log('Total usage keys:', usageArray.length);
    console.log('Files scanned:', allFiles.length);
    for (const loc of localeNames) {
      console.log(`\nLocale: ${loc}`);
      console.log(`  Missing (${missingPerLocale[loc].length}):`);
      missingPerLocale[loc].slice(0, 15).forEach(k => console.log('    -', k));
      if (missingPerLocale[loc].length > 15) console.log('    ...');
      console.log(`  Unused (${unusedPerLocale[loc].length}):`);
      unusedPerLocale[loc].slice(0, 15).forEach(k => console.log('    -', k));
      if (unusedPerLocale[loc].length > 15) console.log('    ...');
    }
    if (!SKIP_HARDCODED) {
      console.log(`\nHardcoded string candidates: ${hardcoded.length}`);
      hardcoded.slice(0, 10).forEach(h => console.log(`  ${h.file}:${h.line} -> ${h.text}`));
      if (hardcoded.length > 10) console.log('  ...');
    }
    console.log('\nUse --json for machine readable output.');
  }

  if (hardcoded.length) {
    fs.writeFileSync(path.join(ROOT, 'unlocalized-report.json'), JSON.stringify(hardcoded, null, 2));
  }

  if (STRICT && Object.values(missingPerLocale).some(arr => arr.length)) {
    process.exit(2);
  }
}

main();
