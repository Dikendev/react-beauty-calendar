import type { JSX, Ref } from "react";
import type { CalendarInstanceRef } from "../../src/App";
import type { ActionType } from "../core/header-calendar/Header";
import type { BlockTimeData } from "../core/slots/EmptySlot";
import type { Booking, BookingDateAndTime, BookingViewType } from "./booking";
import type { ViewModes } from "./calendar";

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
