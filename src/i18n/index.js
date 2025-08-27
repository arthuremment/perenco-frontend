import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./en.json";
import fr from "./fr.json";

i18n
  .use(LanguageDetector) // détecte la langue du navigateur
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    fallbackLng: "fr", // langue par défaut
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;