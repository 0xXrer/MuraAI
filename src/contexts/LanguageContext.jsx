import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LANGUAGES = {
  RU: 'ru',
  KZ: 'kk', // Kazakhstan language code is 'kk' in Google Translate
  EN: 'en'
};

export const LANGUAGE_LABELS = {
  [LANGUAGES.RU]: 'Русский',
  [LANGUAGES.KZ]: 'Қазақша',
  [LANGUAGES.EN]: 'English'
};

export function LanguageProvider({ children }) {
  // Получаем сохраненный язык из localStorage или используем русский по умолчанию
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const saved = localStorage.getItem('muraai_language');
    return saved || LANGUAGES.RU;
  });

  // Сохраняем выбранный язык в localStorage
  useEffect(() => {
    localStorage.setItem('muraai_language', currentLanguage);
  }, [currentLanguage]);

  const changeLanguage = (lang) => {
    if (Object.values(LANGUAGES).includes(lang)) {
      setCurrentLanguage(lang);
    }
  };

  const value = {
    currentLanguage,
    changeLanguage,
    isRussian: currentLanguage === LANGUAGES.RU,
    isKazakh: currentLanguage === LANGUAGES.KZ,
    isEnglish: currentLanguage === LANGUAGES.EN
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
