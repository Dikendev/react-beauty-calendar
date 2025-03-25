import { useImperativeHandle } from "react";
import type { RootProps } from "../@types/calendar-instance";
import { initialBookingFormState } from "../context/booking/booking-store";
import CalendarHolder from "./calendar/CalendarHolder";

import { BookingModalProvider, BookingProvider } from "../context";
import { NewEventProvider } from "../context/new-event/new-event-context";
import { initialFormState } from "../context/new-event/new-event-store";
import "../App.css";

export interface CalendarInstanceRef {
    getStatus: () => boolean;
}

const Root = ({
    viewModes,
    createBookingModal,
    onChangeViewType,
    onCardDropCallback,
    onDayChange,
    onTodayClick,
    onSlotClick,
    onModalClose,
    bookings,
    ref,
}: RootProps) => {
    useImperativeHandle(ref, () => ({
        getStatus: () => true,
    }));

    return (
        <BookingProvider {...initialBookingFormState}>
            <BookingModalProvider
                createBookingModal={createBookingModal}
                viewModes={viewModes}
                onChangeViewType={onChangeViewType}
                onTodayClick={onTodayClick}
                onCardDropCallback={onCardDropCallback}
                onDayChange={onDayChange}
                onSlotClick={onSlotClick}
                onModalClose={onModalClose}
                bookings={bookings}
            >
                <NewEventProvider {...initialFormState}>
                    <CalendarHolder />
                    {/* <Outlet /> */}
                </NewEventProvider>
            </BookingModalProvider>
        </BookingProvider>
    );
};

export default Root;
