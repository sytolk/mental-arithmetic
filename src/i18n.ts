import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import enUs from "./locales/en-US/ns.extension.json";

let defaultLanguage = enUs;

function loadLocales(options: any, url: string, payload: any, callback: any) {
  import("./locales/" + url + "/ns.extension.json")
    .then((locale) => {
      callback(undefined, { status: "200", data: locale });
      return true;
    })
    .catch(() => {
      console.log("Error loading " + url + " locale.");
      callback(undefined, { status: "200", data: defaultLanguage });
    });
}

const options = {
  fallbackLng: "enUs",
  // load: 'all', // ['en', 'de'], // we only provide en, de -> no region specific locals like en-US, de-DE
  // ns: ['core'],
  // defaultNS: 'core',
  attributes: ["t", "i18n"],
  backend: {
    loadPath: "{{lng}}",
    parse: (data: any) => data, // comment to have working i18n switch
    request: loadLocales, // comment to have working i18n switch
  },
};

i18n.use(HttpApi).use(LanguageDetector);
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init(options, (err, t) => {
    if (err) {
      return console.log("something went wrong loading", err);
    }
  });
}

export default i18n;
