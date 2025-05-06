import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en_US from "./../lib/locales/en_US.json";
import pt_BR from "./../lib/locales/pt_BR.json";

i18n.use(initReactI18next);
i18n.init({
    // for all options read: https://www.i18next.com/overview/configuration-options
    fallbackLng: "pt_BR",
    lng: "pt_BR",
    debug: false,
    resources: {
        en_US,
        pt_BR,
    },
    interpolation: {
        escapeValue: false,
    },
    react: {
        bindI18n: "languageChanged",
    },
});

export default i18n;
