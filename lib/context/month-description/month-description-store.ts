import { createStore } from "zustand";

export const initialMonthDescriptionState = {
    month: new Date().getMonth(),
    fullYear: new Date().getFullYear(),
    monthMessage: "",
};

export interface MonthDescriptionProps {
    month: number;
    fullYear: number;
    monthMessage: string;
}

export interface MonthDescriptionState extends MonthDescriptionProps {
    updateMonthMessage: (
        monthDescriptionProps: Partial<MonthDescriptionProps>,
    ) => void;
}

const monthDescriptionStore = (
    initialProps?: Partial<MonthDescriptionState>,
) => {
    return createStore<MonthDescriptionState>((set) => ({
        ...initialProps,
        ...initialMonthDescriptionState,

        updateMonthMessage: (
            monthDescriptionProps: Partial<MonthDescriptionProps>,
        ) => {
            set((prev) => ({
                ...prev,
                ...monthDescriptionProps,
            }));
        },
    }));
};

export type MonthDescriptionStore = ReturnType<typeof monthDescriptionStore>;

export { monthDescriptionStore };
