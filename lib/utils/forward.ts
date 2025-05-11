export type CardContentRef = HTMLDivElement;

export interface BookingCardRef {
    changeCurrentCardResize: () => void;
}

export interface TimeInfoRef {
    show: () => void;
    hide: () => void;
    changeIsOpen: (isOpen: boolean) => void;
}
