import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import de from "./de.json";

const savedLang = localStorage.getItem("lang");
const browserLang = navigator.language.startsWith("de") ? "de" : "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    de: { translation: de },
  },
  lng: savedLang || browserLang,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
