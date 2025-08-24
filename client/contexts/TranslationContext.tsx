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
          console.log(`[i18n] Loading domain ${domain} for locale ${locale}`);
          const data = await loader();
          localeStore[locale][domain] = data || {};
          console.log(`[i18n] Successfully loaded ${p}`);
        } catch (e) {
          console.warn(`[i18n] Failed loading ${p}`, e);
          // Set empty object to prevent repeated attempts
          localeStore[locale][domain] = {};
        }
      }
      return;
    }
  }
  // If no loader found, set empty object to prevent repeated attempts
  if (!localeStore[locale][domain]) {
    localeStore[locale][domain] = {};
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
      try {
        const stored = localStorage.getItem('crm-language') as Language | null;
        if (stored && ['en', 'ar', 'ar-EG', 'ar-EG-x'].includes(stored)) return stored;
        // Browser detection
        const navLang = navigator.language || (navigator as any).userLanguage || 'en';
        if (navLang.startsWith('ar-EG')) return 'ar-EG';
        if (navLang.startsWith('ar')) return 'ar';
      } catch (e) {
        console.warn('[i18n] Failed to read localStorage:', e);
      }
    }
    return 'en'; // Default to English for stability
  })();

  const [language, setLanguageState] = useState<Language>(initialLang);
  const [ready, setReady] = useState(false); // Start as false, set to true after initial load
  const [isInitialized, setIsInitialized] = useState(false);
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
    if (!domainLoadedSomewhere && ready) {
      const chainToWarm = buildFallbackChain(language);
      // fire and forget; when finished we force a rerender so that keys resolve
      Promise.all(chainToWarm.map(l => loadDomain(l as Language, domain)))
        .then(() => {
          console.log(`[i18n] Domain ${domain} loaded, forcing rerender`);
          forceRerender(v => v + 1);
        })
        .catch((err) => {
          console.warn(`[i18n] Failed to load domain ${domain}:`, err);
        });
    }
    
    const mk = `${language}:${key}`;
    if (!missingKeysRef.current.has(mk)) {
      missingKeysRef.current.add(mk);
      if (ready) { // Only warn when we're supposed to be ready
        console.warn(`[i18n] Missing translation for ${mk}`);
      }
    }
    return key; // fall back to key string
  };

  const prefetchLocale = async (lang: Language, domains: string[] = []) => {
    try {
      console.log(`[i18n] Prefetching locale ${lang} with domains:`, domains);
      const chain = buildFallbackChain(lang);
      const uniqueDomains = domains.length ? domains : Array.from(pendingDomainsRef.current);
      await Promise.all(chain.map(l => ensureDomains(l as Language, uniqueDomains)));
      console.log(`[i18n] Successfully prefetched locale ${lang}`);
    } catch (err) {
      console.warn(`[i18n] Prefetch failed for ${lang}:`, err);
    }
  };

  const setLanguage = (lang: Language) => {
    if (lang === language) return;
    console.log(`[i18n] Changing language from ${language} to ${lang}`);
    
    // Set ready to false during language change to prevent crashes
    setReady(false);
    setLanguageState(lang);
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('crm-language', lang);
      } catch (e) {
        console.warn('[i18n] Failed to save language to localStorage:', e);
      }
    }
    
    // Trigger async warm of any known domains
    const domains = Array.from(pendingDomainsRef.current);
    prefetchLocale(lang, domains).then(() => {
      console.log(`[i18n] Language change to ${lang} complete, setting ready to true`);
      setReady(true);
    }).catch((err) => {
      console.warn(`[i18n] Failed to prefetch after language change:`, err);
      // Still set ready to true to prevent infinite loading
      setReady(true);
    });
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
    if (isInitialized) return;
    
    console.log(`[i18n] Initializing translation system for language: ${language}`);
    
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
    
    console.log(`[i18n] Discovered domains:`, Array.from(discovered));
    
    prefetchLocale(language, Array.from(discovered)).then(() => {
      console.log(`[i18n] Initial prefetch complete for ${language}`);
      setReady(true);
      setIsInitialized(true);
    }).catch((err) => {
      console.warn(`[i18n] Initial prefetch failed:`, err);
      // Still set ready to prevent infinite loading
      setReady(true);
      setIsInitialized(true);
    });
  }, [language]); // Include language in deps to reinitialize on language change

  // Reset initialization when language changes
  useEffect(() => {
    if (isInitialized) {
      setIsInitialized(false);
    }
  }, [language]);

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
      {children}
    </TranslationContext.Provider>
  );
};

