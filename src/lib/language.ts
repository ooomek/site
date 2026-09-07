import { createContext, useContext } from 'react';

export type Language = 'ru' | 'en';
export type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (russian: string, english: string) => string;
  localizePath: (path: string) => string;
};

export const LanguageContext = createContext<LanguageContextValue | null>(null);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('LanguageProvider is required');
  return context;
}
