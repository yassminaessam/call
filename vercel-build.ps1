Write-Host "[vercel-build] Node: $(node -v)"
Write-Host "[vercel-build] PWD: $(Get-Location)"
Write-Host "[vercel-build] Generating Prisma client"
 npx prisma generate
Write-Host "[vercel-build] Building SPA with production Vite config"
 npx vite build --config vite.config.prod.ts
Write-Host "[vercel-build] Copying locales"
 node scripts/copy-locales.mjs
Write-Host "[vercel-build] Done."