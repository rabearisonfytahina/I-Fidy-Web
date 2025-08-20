// context/LanguageProvider.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// Atsofohy eto ny rakitra fandikana
import frTranslations from '../locales/fr.json';
import mgTranslations from '../locales/mg.json';

// Mamorona ny LanguageContext
const LanguageContext = createContext();

// Hook manokana hampiasana ny contexte-n'ny fiteny
export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('mg'); // Fiteny default
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    // Entana ny fandikana mifototra amin'ny fiteny ankehitriny
    const loadTranslations = () => {
      switch (language) {
        case 'fr':
          setTranslations(frTranslations);
          break;
        case 'mg':
          setTranslations(mgTranslations);
          break;
        default:
          setTranslations(mgTranslations); // Miverina amin'ny Malagasy
      }
    };

    loadTranslations();
  }, [language]); // Miverina mandeha rehefa miova ny fiteny

  // Fampandehanana hahazoana lahatsoratra nadika
  const t = (key) => {
    return translations[key] || key; // Avereno ny "key" raha tsy hita ny fandikana
  };

  // Fampandehanana hanovana ny fiteny
  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('appLanguage', newLanguage); // Tazony ny safidy fiteny
  };

  // Hamarino raha misy fiteny voatahiry ao amin'ny localStorage rehefa mandeha voalohany
  useEffect(() => {
    const savedLanguage = localStorage.getItem('appLanguage');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, t, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};