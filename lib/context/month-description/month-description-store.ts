import { createStore } from "zustand";
import { MONTH } from "../../constants";

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
    updateHeaderDateLabel: (targetDate: Date) => void;
}

const monthDescriptionStore = (
    initialProps?: Partial<MonthDescriptionState>,
) => {
    return createStore<MonthDescriptionState>((set, get) => ({
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

        updateHeaderDateLabel: (targetDate: Date): void => {
            get().updateMonthMessage({
                month: targetDate.getMonth(),
                fullYear: targetDate.getFullYear(),
                monthMessage: MONTH[targetDate.getMonth()],
            });
        },
    }));
};

export type MonthDescriptionStore = ReturnType<typeof monthDescriptionStore>;

export { monthDescriptionStore };
