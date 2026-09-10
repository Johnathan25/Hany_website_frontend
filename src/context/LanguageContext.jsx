import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('ar');

  useEffect(() => {
    // تحديث اتجاه ولغة الصفحة في الـ HTML تلقائياً عند تغيير اللغة
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLang = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, isAr: lang === 'ar' }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook آمن مع قيم افتراضية
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    // fallback في حال نسيان الـ Provider في أي مكان
    return {
      lang: 'ar',
      setLang: () => {},
      toggleLang: () => {},
      isAr: true,
    };
  }
  return context;
};