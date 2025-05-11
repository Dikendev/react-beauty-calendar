import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import type { Ref } from "react";
import type { Booking, BookingDateAndTime } from "../@types";
import type { BlocksTimeStructure } from "../core/slots/EmptySlot";
import type { BookingCardRef, CardContentRef } from "./forward";
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
    heightStyle: number;
    layerCount?: number;
    half?: boolean;
    hoveringAdditionalCardId?: string;

    events?: { onClick?: () => void };
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
