// Translation utilities for debugging and maintenance

export const resetTranslationCache = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('crm-language');
    console.log('Translation cache cleared');
  }
};

export const setLanguageAndReload = (language: 'ar' | 'en') => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('crm-language', language);
    window.location.reload();
  }
};

export const debugTranslations = () => {
  const language = localStorage.getItem('crm-language');
  const htmlDir = document.documentElement.dir;
  const htmlLang = document.documentElement.lang;
  
  console.log('Translation Debug Info:', {
    storedLanguage: language,
    htmlDirection: htmlDir,
    htmlLanguage: htmlLang,
    userAgent: navigator.userAgent,
    currentUrl: window.location.href
  });
};

// Test all translation keys
export const testTranslationKeys = (t: (key: string) => string) => {
  const testKeys = [
    'nav.dashboard',
    'nav.callCenter', 
    'nav.sales',
    'common.save',
    'common.active',
    'dashboard.title',
    'dashboard.stats.totalCallsToday'
  ];
  
  console.log('Translation Key Tests:');
  testKeys.forEach(key => {
    const result = t(key);
    console.log(`${key}: ${result}`);
    if (result === key) {
      console.warn(`⚠️  Translation missing for key: ${key}`);
    }
  });
};
