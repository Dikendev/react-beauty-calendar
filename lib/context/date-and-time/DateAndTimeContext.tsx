import { type PropsWithChildren, createContext } from "react";
import type { TimesBlock } from "../../core/slots/Slots";

interface SlotContext {
    handleTimeClicked: (timesBlock: TimesBlock) => void;
}

export const SlotDateAndTimeDataContext = createContext<SlotContext>({
    handleTimeClicked: () => {},
});

type SlotDateAndTimeDataProvider = PropsWithChildren<SlotContext>;

const SlotDateAndTimeDataProvider = ({
    children,
    handleTimeClicked,
}: SlotDateAndTimeDataProvider) => {
    return (
        <SlotDateAndTimeDataContext value={{ handleTimeClicked }}>
            {children}
        </SlotDateAndTimeDataContext>
    );
};

export default SlotDateAndTimeDataProvider;
