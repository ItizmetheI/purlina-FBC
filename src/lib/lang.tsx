import { createContext, useContext, useEffect, useState } from 'react';
import { remeasureDive } from '../utils/dive';

type Lang = 'tr' | 'en';

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: 'en',
  setLang: () => {},
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem('purlina-lang');
    if (saved === 'tr' || saved === 'en') return saved;
    return navigator.language?.toLowerCase().startsWith('tr') ? 'tr' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('purlina-lang', lang);
    document.documentElement.lang = lang;
    // layout height changes with language — re-measure act boundaries
    const t = setTimeout(remeasureDive, 100);
    return () => clearTimeout(t);
  }, [lang]);

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const { lang, setLang } = useContext(LangContext);
  // t('türkçe', 'english') — pick the active language's copy
  const t = <T,>(tr: T, en: T): T => (lang === 'tr' ? tr : en);
  return { lang, setLang, t };
}
