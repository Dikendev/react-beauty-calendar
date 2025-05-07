import { use } from "react";
import { useStore } from "zustand";
import MonthDescriptionContext from "../context/month-description/month-description-context";
import type { MonthDescriptionState } from "../context/month-description/month-description-store";

const useMonthDescription = <T>(
    selector: (state: MonthDescriptionState) => T,
): T => {
    const state = use(MonthDescriptionContext);

    if (!state) {
        throw new Error(
            "Missing useMonthDescription must be within a MonthDescriptionProvider",
        );
    }
    return useStore(state, selector);
};

export default useMonthDescription;
