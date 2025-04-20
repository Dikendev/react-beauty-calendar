import type { JSX, Ref } from "react";
import type { NextAndPreviousWeek } from "../context/global/days-and-week/day-and-week-store";
import type { ActionType } from "../core/header-calendar/Header";
import type { BlockTimeData } from "../core/slots/EmptySlot";
import type { Booking, BookingDateAndTime, BookingViewType } from "./booking";
import type { ViewModes } from "./calendar";

export interface CalendarInstanceRef extends CalendarRootRef {
    getCalendar: () => JSX.Element;
}

export interface CalendarRootRef {
    updateViewType: (bookingType: BookingViewType) => void;
    updateWeekAndViewType: (date?: Date) => NextAndPreviousWeek;
    updateTodayDayAndViewType: (date: Date) => Date;
    updateSelectedNode: (nodeKey: string) => void;
    updateFinishAt: (selectedHour: string) => void;
}

export type UseBookingInstanceProps = RootProps;

export interface RootProps extends RootEventsProps {
    bookings: Booking[];
    createBookingModal: JSX.Element;
    viewModes: ViewModes;
    ref?: Ref<CalendarRootRef>;
}

export interface OnSlotClick {
    slotData: BlockTimeData;
    finishTime: string;
}

export interface RootEventsProps {
    onChangeViewType: (bookingViewType: BookingViewType) => void;
    onTodayClick: (date: Date) => void;
    onHeaderDayClick?: (date: Date, bookingViewType: BookingViewType) => void;
    onCardDropCallback: (
        booking: Booking,
        overId: string,
        slotData: BookingDateAndTime,
        newBooking: Booking,
    ) => Promise<void>;
    onDayChange: (date: Date[], actionType: ActionType) => void;
    onModalClose: () => void;
    onSlotClick: (slot: OnSlotClick) => void;
}
