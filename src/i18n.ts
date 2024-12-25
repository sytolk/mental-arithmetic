import { initReactI18next } from "react-i18next";
import i18n from "i18next";

import en from "./locales/en-US/ns.extension.json";
import bg from "./locales/bg-BG/ns.extension.json";
import de_DE from "./locales/de-DE/ns.extension.json";
import fr from "./locales/fr-FR/ns.extension.json";

export const resources = {
  en: { translation: en },
  bg: { translation: bg },
  de: { translation: de_DE },
  fr: { translation: fr },
};

export const supportedLngs = ["en", "bg", "de", "fr"];

export const defaultNS = "translation";

//@ts-ignore
const lng = window.locale;

i18n
  // load translation using http -> see /assets/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/assets/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  // want your translations to be loaded from a professional CDN? => https://github.com/locize/react-tutorial#step-2---use-the-locize-cdn
  //.use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  //.use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    returnNull: false,
    fallbackLng: "en",
    debug: true,
    supportedLngs,
    ns: ["translation"],
    defaultNS,
    // load: 'languageOnly',
    nonExplicitSupportedLngs: true,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources,
    ...(lng && { lng: lng }),
    //request: loadLocales,
  });

export default i18n;
