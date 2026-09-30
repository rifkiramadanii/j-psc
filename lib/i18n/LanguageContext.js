'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext({
  language: 'id',
  setLanguage: () => {},
  toggleLanguage: () => {},
});

const STORAGE_KEY = 'jpsc-language';

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('id');
  const [hydrated, setHydrated] = useState(false);

  // Read persisted preference after mount (avoids SSR/client text mismatch flash)
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'id') {
        setLanguageState(stored);
      }
    } catch (e) {
      // localStorage unavailable — fall back to default silently
    }
    setHydrated(true);
  }, []);

  // Keep the <html lang="..."> attribute in sync for accessibility/SEO
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  function setLanguage(lang) {
    setLanguageState(lang);
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      // ignore
    }
  }

  function toggleLanguage() {
    setLanguage(language === 'id' ? 'en' : 'id');
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, hydrated }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
