import { type PropsWithChildren, useRef } from "react";
import MonthDescriptionContext from "./month-description-context";
import {
    type MonthDescriptionProps,
    type MonthDescriptionStore,
    monthDescriptionStore,
} from "./month-description-store";

type MonthDescriptionProviderProps = PropsWithChildren<MonthDescriptionProps>;

const MonthDescriptionProvider = ({
    children,
    ...props
}: MonthDescriptionProviderProps) => {
    const monthDescriptionStoreRef = useRef<MonthDescriptionStore | null>(null);

    if (!monthDescriptionStoreRef.current) {
        monthDescriptionStoreRef.current = monthDescriptionStore(props);
    }

    return (
        <MonthDescriptionContext value={monthDescriptionStoreRef.current}>
            {children}
        </MonthDescriptionContext>
    );
};

export default MonthDescriptionProvider;
