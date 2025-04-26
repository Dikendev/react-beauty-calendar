import { type PropsWithChildren, useRef } from "react";
import ConfigContext from "./config-context";
import {
    type ConfigStore,
    type ConfigStoreProps,
    configStore,
} from "./config-store";

type ConfigProviderProps = PropsWithChildren<ConfigStoreProps>;

const ConfigProvider = ({ children, ...props }: ConfigProviderProps) => {
    const configStoreRef = useRef<ConfigStore | null>(null);

    if (!configStoreRef.current) {
        configStoreRef.current = configStore(props);
    }

    return (
        <ConfigContext value={configStoreRef.current}>{children}</ConfigContext>
    );
};

export { ConfigProvider };
