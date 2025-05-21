import type { CSSProperties } from "react";
import type { Booking } from "../@types";

export type CardContentRef = HTMLDivElement;

export interface BookingCardRef {
    changeCurrentCardResize: () => void;
}

export interface TimeInfoRef {
    show: () => void;
    hide: () => void;
    changeIsOpen: (isOpen: boolean) => void;
}

export interface BlockTimeRef {
    ref: (element: HTMLElement | null) => void;
    style: CSSProperties;
}

export interface SlotTriggerForwardRef {
    showEvent: (slotNode: string) => void;
    closeEvent: () => void;
    onOpenCloseChange: (status: boolean) => void;
    addAdditionalBooking: (
        booking: Booking,
        allEmptySlotNodesId: string[],
        full?: boolean,
    ) => void;
    removeFromAdditionalBooking: (booking: Booking) => void;
    hoveringAdditionalCard: (hoveringCardId: string) => void;
    clearHoveringCard: () => void;
}

export interface BookingCardContentRef {
    updateBooking: (booking: Booking) => void;
}
