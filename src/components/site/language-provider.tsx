import { useEffect, useMemo, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LanguageContext, type Language } from '../../lib/language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const requestedLanguage = new URLSearchParams(location.search).get('lang');
  const language: Language = requestedLanguage === 'en' ? 'en' : 'ru';

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(() => ({
    language,
    t: (russian: string, english: string) => language === 'en' ? english : russian,
    localizePath: (path: string) => {
      const url = new URL(path, window.location.origin);
      url.searchParams.set('lang', language);
      return path.startsWith('http') ? url.href : `${url.pathname}${url.search}${url.hash}`;
    },
    setLanguage: (nextLanguage: Language) => {
      const search = new URLSearchParams(location.search);
      search.set('lang', nextLanguage);
      navigate({ pathname: location.pathname, search: search.toString(), hash: location.hash });
    },
  }), [language, location.pathname, location.search, location.hash, navigate]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
