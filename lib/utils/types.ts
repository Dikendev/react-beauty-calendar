import type { JSX, Ref, SyntheticEvent } from "react";
import type { Booking, ViewModes } from "../@types";

import type { ResizeCallbackData, ResizeHandle } from "react-resizable";
import type { BookingDateAndTime, BookingViewType } from "../@types/booking";
import type { CalendarInstanceRef } from "../@types/calendar-instance";
import type { ActionType } from "../core/header-calendar/Header";
import type { BlockTimeData } from "../core/slots/EmptySlot";

export type UseBookingInstanceProps = RootProps;

export interface RootProps extends RootEventsProps {
    bookings: Booking[];
    createBookingModal: JSX.Element;
    viewModes: ViewModes;
    ref?: Ref<CalendarInstanceRef>;
}

export interface RootEventsProps {
    onChangeViewType: (bookingViewType: BookingViewType) => void;
    onTodayClick: (date: Date) => void;
    onCardDropCallback: (
        booking: Booking,
        overId: string,
        slotData: BookingDateAndTime,
    ) => Promise<void>;
    onDayChange: (date: Date[], actionType: ActionType) => void;
    onModalClose: () => void;
    onSlotClick: (slotData: BlockTimeData) => void;
}

interface ResizableState {
    height: number;
    width: number;
}

export interface ResizableParam {
    state: ResizableState;
    customClass?: string;
    onResize: (
        event: SyntheticEvent<Element, Event>,
        args_1: ResizeCallbackData,
    ) => void;
    onResizeStart?: (e: React.SyntheticEvent, data: ResizeCallbackData) => void;
    onResizeStop?: (e: React.SyntheticEvent, data: ResizeCallbackData) => void;
    resizeHandle?: ResizeHandle[];
}
