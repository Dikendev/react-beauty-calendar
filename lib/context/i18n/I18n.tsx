import { type JSX, type PropsWithChildren, useEffect, useState } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";

import en_US from "../../locales/en_US.json";
import pt_BR from "../../locales/pt_BR.json";

const I18n = ({ children }: PropsWithChildren): JSX.Element | null => {
    const [bootstrapping, setBootstrapping] = useState(true);
    const { i18n } = useTranslation();

    useEffect(() => {
        i18n.addResourceBundle("en_US", "translation", en_US, true, true);
        i18n.addResourceBundle("pt_BR", "translation", pt_BR, true, true);

        setBootstrapping(false);
    }, [i18n]);

    if (bootstrapping) {
        return null;
    }

    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default I18n;
