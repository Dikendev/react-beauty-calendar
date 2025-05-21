import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import type { CSSProperties, ReactNode, Ref } from "react";
import type { Booking, BookingDateAndTime, Bookings } from "../@types";
import type { TimesBlock } from "../core/slots/Slots";
import type {
    BlockTimeRef,
    BookingCardContentRef,
    BookingCardRef,
    CardContentRef,
    SlotTriggerForwardRef,
} from "./forward";
import type { ResizableParam } from "./types";

export interface CardContentProps {
    bookingInit: Booking;
    bookingViewType: string;
    slotData: BookingDateAndTime;
    heightStyle: number;
    topHeightIncrement?: number;
    customClasses?: string;
    open?: boolean;
    lastCard?: boolean;
    half?: boolean;
    cardsQuantity?: number;
    cardIndex?: number;
    resizableParam?: ResizableParam;
    events?: { onUnmount?: () => void; onClick?: () => void };
    hoveringAdditionalCardId?: string;

    listeners?: SyntheticListenerMap | undefined;
    attributes?: DraggableAttributes;

    cardContentRef?: Ref<BookingCardRef>;
    ref?: Ref<CardContentRef>;
}

export interface BookingCardProps {
    booking: Booking;
    slotData: BookingDateAndTime;
    customClasses?: string;
    layerCount?: number;
    half?: boolean;
    hoveringAdditionalCardId?: string;
    ref?: Ref<BookingCardRef>;
}

interface TimeInfoEvents {
    onClick: (finishAt?: string) => void;
    renderPreviewCard: () => void;
    openOptions: () => void;
    resetPrevView: () => void;
}

export interface TimeInfoProps {
    isDragging: boolean;
    slotData: BlocksTimeStructure;
    events: TimeInfoEvents;
}

export interface BlockTimeData {
    key: string;
    time: string;
}

export type BlocksTimeStructure = BlockTimeRef & BlockTimeData;

export interface EmptySlotProps {
    bookings?: Booking[];
    dayHour?: BookingDateAndTime;
    first: BlocksTimeStructure;
    second: BlocksTimeStructure;
    third: BlocksTimeStructure;
    fourth: BlocksTimeStructure;
    disabledCss: string;
    firstDay: boolean;
}

export interface SlotEvents {
    onMouseEnterEvent: () => string;
}

export interface SlotTriggerProps {
    slotData: BlocksTimeStructure;
    blockTimeString?: string;
    dayHour?: BookingDateAndTime;
    slotPosition: TimesBlock;
    disabledCss: string;
    events: SlotEvents;
    bookings?: Bookings;
    children?: ReactNode;
    ref: Ref<SlotTriggerForwardRef>;
}

export interface CardOverlayProps {
    bookingInit?: Booking;
    slotData?: BookingDateAndTime;
}

export interface BookingCarContextProps {
    booking?: Booking;
    style?: CSSProperties;
    slotData?: BookingDateAndTime;
    events?: { onClick?: () => void };
    ref?: Ref<BookingCardContentRef>;
}
