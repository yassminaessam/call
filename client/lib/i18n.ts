// Lightweight i18n utility layer (phase 1)
// Future phases: dynamic JSON loading, ICU formatting, extraction pipeline

// Extend locales to include regional Egyptian Arabic variant
export type AppLocale = 'en' | 'ar' | 'ar-EG';

export function getDir(locale: AppLocale): 'ltr' | 'rtl' {
  return locale.startsWith('ar') ? 'rtl' : 'ltr';
}

export function applyDir(locale: AppLocale) {
  if (typeof document === 'undefined') return;
  const dir = getDir(locale);
  const root = document.documentElement;
  if (root.getAttribute('dir') !== dir) {
    root.setAttribute('dir', dir);
    root.classList.remove(dir === 'rtl' ? 'ltr' : 'rtl');
    root.classList.add(dir);
  }
}

export function formatNumber(value: number, locale: AppLocale, opts: Intl.NumberFormatOptions = {}) {
  return new Intl.NumberFormat(locale, opts).format(value);
}

export function formatDate(date: Date | string | number, locale: AppLocale, opts: Intl.DateTimeFormatOptions = {}) {
  const d = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat(locale, opts).format(d);
}

// Currency formatting with sensible defaults:
// - If locale is ar-EG (or any ar* variant) and no currency provided => EGP
// - Fallback to USD for en if currency omitted
export function formatCurrency(
  amount: number,
  locale: AppLocale,
  options: { currency?: string; maximumFractionDigits?: number; minimumFractionDigits?: number } = {}
) {
  const currency = options.currency || (locale.startsWith('ar') ? 'EGP' : 'USD');
  let { maximumFractionDigits = 2, minimumFractionDigits = 2 } = options;

  // Guard against invalid fractional digit values which can throw at runtime in some environments
  const clamp = (v: number) => {
    if (!Number.isFinite(v)) return 2;
    if (v < 0) return 0;
    if (v > 20) return 20; // per ECMA-402 typical upper bound
    return Math.floor(v);
  };
  maximumFractionDigits = clamp(maximumFractionDigits);
  minimumFractionDigits = clamp(minimumFractionDigits);
  if (minimumFractionDigits > maximumFractionDigits) {
    // swap to ensure valid relationship
    [minimumFractionDigits, maximumFractionDigits] = [maximumFractionDigits, minimumFractionDigits];
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits,
      minimumFractionDigits,
    }).format(amount);
  } catch (e) {
    console.error('[i18n.formatCurrency] fallback due to error', e);
    return amount.toString();
  }
}

// Placeholder translate function for when we migrate to JSON-based dynamic loading
// Currently TranslationContext supplies t(); this is for future externalization.
export type TranslationDict = Record<string, any>;

export function resolveKey(dict: TranslationDict, key: string): string | undefined {
  return key.split('.').reduce<any>((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), dict);
}

export function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/{{\s*(\w+)\s*}}/g, (_, k) => String(params[k] ?? ''));
}

// Basic pluralization stub (Phase 1) – to be replaced by ICU message formatting.
// Usage: plural(locale, count, { one: 'X item', other: '{{count}} items' })
export function plural(
  locale: AppLocale,
  count: number,
  forms: { zero?: string; one?: string; two?: string; few?: string; many?: string; other: string }
) {
  // Arabic has complex rules; for phase 1 we implement minimal rules and fall back to 'other'
  const lang = locale.startsWith('ar') ? 'ar' : 'en';
  let chosen: string | undefined;
  if (lang === 'en') {
    chosen = count === 1 ? forms.one : forms.other;
  } else {
    // Simplified Arabic mapping
    if (count === 0 && forms.zero) chosen = forms.zero;
    else if (count === 1 && forms.one) chosen = forms.one;
    else if (count === 2 && forms.two) chosen = forms.two;
    else if (count >= 3 && count <= 10 && forms.few) chosen = forms.few;
    else if (count > 10 && forms.many) chosen = forms.many;
    else chosen = forms.other;
  }
  return interpolate(chosen, { count });
}
