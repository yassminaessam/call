import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'locales');
const destDir = path.join(process.cwd(), 'dist', 'spa', 'locales');

if (!fs.existsSync(srcDir)) {
  console.error('No locales directory found to copy.');
  process.exit(0);
}

fs.mkdirSync(destDir, { recursive: true });

function copyRecursive(src, dest) {
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest);
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

copyRecursive(srcDir, destDir);
console.log('[vercel] Copied locales to dist/spa/locales');
