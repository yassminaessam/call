# i18n & Bilingual Development Guidelines (Arabic / English)

## 1. Objectives

- Zero hard‑coded user facing strings in components.
- Instant language switching (no full reload) with preserved UI state.
- Full RTL/LTR parity (layout, direction, focus order, typography, icons, charts, tables, overflow handling).
- Extensible to add French later without refactor.

## 2. Key Principles

| Principle | Description | Example |
|-----------|-------------|---------|
| Single Source | All keys defined centrally (current: `TranslationContext.tsx`, later external JSON or backend). | `marketing.campaign.status.running` |
| Stable Keys | English semantic snake / dot notation; never put language text inside key. | `support.tickets.newTicket` |
| No UI Copy In Logic | Logic uses enums / codes; mapping to text only at render via t(). | status="running" → `t('marketing.status.running')` |
| Logical CSS | Use `start/end` not `left/right`; rely on `dir` attribute. | `ps-4` instead of `pl-4` (utility alias) |
| Direction Agnostic Icons | Avoid arrows that break in RTL unless mirrored via CSS transform. | Use `chevron` with `[dir="rtl"] rotate-180` |
| Interpolation Safety | Use placeholders with braces; never concat raw strings. | `t('common.greeting', { name })` |
| Pluralization Ready | Reserve keys for counts even if single now. | `notifications.unread.one` / `.other` |

## 3. Key Naming Conventions

```text
<domain>.<subdomain>.<entity>.<property>[.<state>]
marketing.campaign.status.running
support.tickets.table.columns.subject
core.navbar.actions.logout
```

Use lowercase, dots for hierarchy, hyphen ONLY inside variable fragments if needed (`plan-enterprise`).

## 4. Directory / Extraction Roadmap

| Phase | Action | Tooling |
|-------|--------|---------|
| P0 | Keep TranslationContext central | Existing |
| P1 | Script scans for /"[A-Za-z].+"/ & suggests keys | Node + AST (recast / ts-morph) |
| P2 | Export keys to JSON per locale (`/locales/en/*.json`, `/locales/ar/*.json`) | Build step |
| P3 | Add ESLint rule `no-hardcoded-ui` | Custom ESLint plugin |
| P4 | ICU / messageformat integration for plurals & gender | `messageformat`, `intl-messageformat` |
| P5 | Dynamic locale bundles code-splitting | Vite dynamic import |

## 5. Implementation Checklist (Per Feature PR)

- All strings replaced with `t()`
- Keys added to both `en` & `ar`
- Direction verified (container flips, paddings logical, icons mirrored if needed)
- Snapshots updated (if using Storybook / Jest)
- A11y: `aria-label`, `title`, `alt` translated
- Numbers/date formatting via `Intl` (NOT manual)

## 6. RTL Testing Quick List

| Category    | Check |
|-------------|-------|
| Typography  | Baseline alignment, line-height unaffected. |
| Flex / Grid | Order is still logical; avoid manual reordering hacks. |
| Icons       | Arrows / carets mirrored only when directional. |
| Charts      | Axis labels & legends readable, not clipped (test both locales). |
| Tables      | Scrollbars & overflow behave; no horizontal scroll regression. |
| Forms       | Label alignment, required indicators consistent. |
| Dialogs     | Focus trap works in RTL. |

## 7. Sample Utilities (Proposed)

```ts
// src/i18n/direction.ts
export function applyDir(locale: string) {
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  if (document.documentElement.getAttribute('dir') !== dir) {
    document.documentElement.setAttribute('dir', dir);
  }
}
```

```ts
// src/i18n/format.ts
export const fmtNumber = (n: number, locale: string) => new Intl.NumberFormat(locale).format(n);
export const fmtDate = (d: Date, locale: string, opts: Intl.DateTimeFormatOptions={}) => new Intl.DateTimeFormat(locale, opts).format(d);
```

## 8. Automated Scan (Prototype Concept)

Pseudo-workflow:

1. Parse TSX files.
2. Find JSXText & string literals in props (e.g. `label="`, `placeholder="`, children text).
3. Ignore: tests, data mocks, icons, classNames.
4. Output report: `unlocalized-report.json` with file, line, preview string.
5. Exit non-zero in CI if new items appear.

## 9. Performance Considerations

- Avoid re-render storm: memoize `t` context value; provide stable reference.
- Lazy‑load large locale chunks (reports, long form text).
- Pre-generate direction-specific CSS if size inflates (optional stage).

## 10. Security & Compliance

- Never interpolate raw HTML through translations (avoid XSS). If needed, whitelist via components.
- Audit keys containing URLs.

## 11. Future Enhancements

| Target | Description |
|--------|------------|
| Language Detector | Detect browser language on first visit (persist user preference). |
| Content Fallback | Fallback chain: ar → en. |
| Live Editing | In-app translation override (admin) persists to backend. |
| Translation QA | Pseudo-locale (e.g., adding markers « ») to reveal overflow. |

## 12. Acceptance (Done Definition for i18n Epic)

- Policy documented & merged.
- Lint rule in place (even permissive warning initially).
- 0 hardcoded strings in critical pages (Dashboard, Marketing, Support, Settings).
- Direction toggle visually validated (screenshots stored per locale).
- Extraction script prototype delivering report.

---
Last Updated: {{DATE}}
