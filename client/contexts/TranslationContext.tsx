import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';

// Clean implementation: dynamic locale domain loading (Vite eager glob) with fallback chain ar-EG -> ar -> en

export type Language = 'en' | 'ar' | 'ar-EG' | 'ar-EG-x'; // include pseudo-locale ar-EG-x for testing
export type Direction = 'rtl' | 'ltr';

interface TranslationContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isRTL: boolean;
  ready: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const useTranslation = () => {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error('useTranslation must be used within TranslationProvider');
  return ctx;
};

interface TranslationProviderProps { children: React.ReactNode }

// Dynamic import map (lazy) for all JSON locale domain files under /locales/<locale>/<domain>.json
// Files starting with _ are ignored (reserved for meta / tooling helpers)
const moduleLoaders = import.meta.glob('/locales/**/!(_)*.json', { import: 'default' }) as Record<string, () => Promise<any>>;

type DomainMap = Record<string, any>; // path inside domain
type LocaleStore = Record<Language, Record<string, DomainMap>>;

// In-memory cache of loaded domains per locale
const localeStore: LocaleStore = { en: {}, ar: {}, 'ar-EG': {}, 'ar-EG-x': {} } as any;

async function loadDomain(locale: Language, domain: string): Promise<void> {
  // Find matching path in moduleLoaders
  const pathVariants = [
    `/locales/${locale}/${domain}.json`,
    // Allow fallback to language base (e.g., ar-EG -> ar) handled outside
  ];
  for (const p of pathVariants) {
    const loader = moduleLoaders[p];
    if (loader) {
      if (!localeStore[locale][domain]) {
        try {
          const data = await loader();
            localeStore[locale][domain] = data || {};
        } catch (e) {
          console.warn(`[i18n] Failed loading ${p}`, e);
        }
      }
      return;
    }
  }
}

async function ensureDomains(locale: Language, domains: string[]): Promise<void> {
  if (!domains.length) return;
  await Promise.all(domains.map(d => loadDomain(locale, d)));
}

// Simple interpolation of {{var}}
function interpolate(str: string, params?: Record<string, string | number>) {
  if (!params) return str;
  return Object.keys(params).reduce(
    (s, k) => s.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(params[k]!)),
    str
  );
}

function getFromDomain(domainObj: any, path: string[]): any {
  return path.reduce((acc, cur) => (acc && acc[cur] !== undefined ? acc[cur] : undefined), domainObj);
}

function buildFallbackChain(lang: Language): Language[] {
  if (lang === 'ar-EG-x') return ['ar-EG-x', 'ar-EG', 'ar', 'en'];
  if (lang === 'ar-EG') return ['ar-EG', 'ar', 'en'];
  if (lang === 'ar') return ['ar', 'en'];
  return ['en', 'ar'];
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const initialLang = (() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('crm-language') as Language | null;
      if (stored) return stored;
      // Browser detection
      const navLang = navigator.language || (navigator as any).userLanguage || 'en';
      if (navLang.startsWith('ar-EG')) return 'ar-EG';
      if (navLang.startsWith('ar')) return 'ar';
    }
    return 'ar-EG';
  })();

  const [language, setLanguageState] = useState<Language>(initialLang);
  const [ready, setReady] = useState(false);
  // bump used to force re-render after async background domain loads triggered by misses
  const [, forceRerender] = useState(0);
  const pendingDomainsRef = useRef<Set<string>>(new Set());

  const direction: Direction = language.startsWith('ar') ? 'rtl' : 'ltr';
  const isRTL = direction === 'rtl';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = direction;
      document.documentElement.lang = language;
      document.documentElement.classList.toggle('rtl', isRTL);
    }
  }, [direction, isRTL, language]);

  const missingKeysRef = useRef<Set<string>>(new Set());

  const t = (key: string, params?: Record<string, string | number>): string => {
    if (!key) return '';
    const [domain, ...rest] = key.split('.');
    if (!domain || rest.length === 0) return key; // enforce domain.key format
    const chain = buildFallbackChain(language);
    let domainLoadedSomewhere = false;
    for (const loc of chain) {
      const domainObj = localeStore[loc]?.[domain];
      if (!domainObj) continue;
      domainLoadedSomewhere = true;
      const value = getFromDomain(domainObj, rest);
      if (typeof value === 'string') return interpolate(value, params);
    }

    // If the domain is not yet loaded for the active language, trigger async load then rerender
    if (!domainLoadedSomewhere) {
      const chainToWarm = buildFallbackChain(language);
      // fire and forget; when finished we force a rerender so that keys resolve
      Promise.all(chainToWarm.map(l => loadDomain(l as Language, domain)))
        .then(() => {
          forceRerender(v => v + 1);
        })
        .catch(() => {});
    }
    const mk = `${language}:${key}`;
    if (!missingKeysRef.current.has(mk)) {
      missingKeysRef.current.add(mk);
      console.warn(`[i18n] Missing translation for ${mk}`);
    }
    return key; // fall back to key string
  };

  const prefetchLocale = async (lang: Language, domains: string[] = []) => {
    const chain = buildFallbackChain(lang);
    const uniqueDomains = domains.length ? domains : Array.from(pendingDomainsRef.current);
    await Promise.all(chain.map(l => ensureDomains(l as Language, uniqueDomains)));
  };

  const setLanguage = (lang: Language) => {
    if (lang === language) return;
    setReady(false);
    setLanguageState(lang);
    if (typeof window !== 'undefined') localStorage.setItem('crm-language', lang);
    // Trigger async warm of any known domains
    const domains = Array.from(pendingDomainsRef.current);
    prefetchLocale(lang, domains).finally(() => setReady(true));
  };

  // Track requested domains (from t) for smarter prefetch
  const trackDomain = (key: string) => {
    const domain = key.split('.')[0];
    if (domain) pendingDomainsRef.current.add(domain);
  };

  // Wrap t to record domain usage (only side-effect, actual translation logic above)
  const tTracked: TranslationContextType['t'] = (key, params) => {
    trackDomain(key);
    return t(key, params);
  };

  useEffect(() => {
    // Discover all potential domains for the initial language by scanning moduleLoaders
    // Pattern: /locales/<lang>/<domain>.json
    const discovered = new Set<string>();
    const prefix = `/locales/${language}/`;
    Object.keys(moduleLoaders).forEach(path => {
      if (path.startsWith(prefix)) {
        const file = path.slice(prefix.length); // e.g. marketing.json
        if (file.endsWith('.json')) {
          const domain = file.replace(/\.json$/, '');
            if (!domain.startsWith('_')) discovered.add(domain);
        }
      }
    });
    // Always ensure core domains exist even if empty
    ['common','nav','dashboard'].forEach(d => discovered.add(d));
    discovered.forEach(d => pendingDomainsRef.current.add(d));
    prefetchLocale(language, Array.from(discovered)).finally(() => setReady(true));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const ctx: TranslationContextType = useMemo(() => ({
    language,
    direction,
    setLanguage,
    t: tTracked,
    isRTL,
    ready
  }), [language, direction, isRTL, ready]);

  return (
    <TranslationContext.Provider value={ctx}>
      {/* Optionally render nothing until ready to avoid flash of keys */}
      {ready ? children : null}
    </TranslationContext.Provider>
  );
};

