'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Lang } from '@/lib/i18n';

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    // Read from localStorage on mount
    const saved = localStorage.getItem('toolbox-pro-lang') as Lang | null;
    if (saved === 'hi' || saved === 'en') {
      setLangState(saved);
    } else {
      // Auto-detect from browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('hi')) {
        setLangState('hi');
      }
    }
  }, []);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem('toolbox-pro-lang', newLang);
    // Update html lang attribute for SEO
    document.documentElement.lang = newLang;
  };

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'hi' : 'en';
    setLang(newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export default LanguageContext;
