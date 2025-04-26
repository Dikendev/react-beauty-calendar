import { createStore } from "zustand";

export type SystemColor = "#1700af" | "#b50000" | "#000000";

export const initialConfigState: ConfigStoreProps = {
    systemColor: "#000000",
    isTimeInfoVisible: true,
};

export interface ConfigStoreProps {
    systemColor?: SystemColor;
    isTimeInfoVisible?: boolean;
}

export interface ConfigStoreState extends ConfigStoreProps {
    updateSystemColor: (systemColor: SystemColor) => void;
    changeTimeInfoVisibility: (status: boolean) => void;
}

const configStore = (initialProps?: Partial<ConfigStoreState>) => {
    return createStore<ConfigStoreState>((set) => ({
        ...initialConfigState,
        ...initialProps,

        updateSystemColor: (systemColor) => {
            set((prev) => ({
                ...prev,
                systemColor,
            }));
        },

        changeTimeInfoVisibility: (status) => {
            set((prev) => ({
                ...prev,
                isTimeInfoVisible: status,
            }));
        },
    }));
};

export type ConfigStore = ReturnType<typeof configStore>;

export { configStore };
