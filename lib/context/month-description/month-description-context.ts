import { createContext } from "react";
import type { MonthDescriptionStore } from "./month-description-store";

const MonthDescriptionContext = createContext<MonthDescriptionStore | null>(
    null,
);

export default MonthDescriptionContext;
