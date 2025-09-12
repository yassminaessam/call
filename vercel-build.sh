#!/usr/bin/env bash
# This script is referenced in documentation; Vercel currently uses inline buildCommand in vercel.json
set -euo pipefail

echo "[vercel-build] Node: $(node -v)"
echo "[vercel-build] PWD: $(pwd)"

# Ensure clean install (Vercel already installed deps, but in case of local usage)
# npm ci --ignore-scripts

echo "[vercel-build] Generating Prisma client"
npx prisma generate

echo "[vercel-build] Building SPA with production Vite config"
npx vite build --config vite.config.prod.ts

echo "[vercel-build] Copying locales"
node scripts/copy-locales.mjs

echo "[vercel-build] Done."