"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en/translation.json";
import vi from "./vi/translation.json";
import ja from "./ja/translation.json";
import de from "./de/translation.json";

const savedLang =
  typeof window !== "undefined"
    ? localStorage.getItem("lang") || "en"
    : "en";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      vi: { translation: vi },
      ja: { translation: ja },
      de: { translation: de },
    },
    lng: savedLang, 
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
