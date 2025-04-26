import { use } from "react";
import { useStore } from "zustand";
import ConfigContext from "../context/global/config/config-context";
import type { ConfigStoreState } from "../context/global/config/config-store";

const useGlobalConfig = <T>(selector: (state: ConfigStoreState) => T): T => {
    const state = use(ConfigContext);

    if (!state) {
        throw new Error("useConfig must be used within a ConfigContext");
    }

    return useStore(state, selector);
};

export default useGlobalConfig;
