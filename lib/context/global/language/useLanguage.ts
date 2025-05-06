import type { TFunction } from "i18next";
import { useContext } from "react";
import { I18nContext, useTranslation } from "react-i18next";

export const useLanguage = (): [string, TFunction] => {
    const [t] = useTranslation();

    const {
        i18n: { language },
    } = useContext(I18nContext);

    return [language, t];
};
