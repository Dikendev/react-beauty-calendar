import { useEffect, useImperativeHandle } from "react";
import type { RootProps } from "../@types/calendar-instance";
import { initialBookingFormState } from "../context/booking/booking-store";
import CalendarHolder from "./calendar/CalendarHolder";

import { BookingModalProvider, BookingProvider } from "../context";
import { NewEventProvider } from "../context/new-event/new-event-context";
import { initialFormState } from "../context/new-event/new-event-store";

import "./../App.css";
import { useGlobalStore } from "../hooks";

const Root = ({
    viewModes,
    createBookingModal,
    onChangeViewType,
    onCardDropCallback,
    onDayChange,
    onHeaderDayClick,
    onTodayClick,
    onSlotClick,
    onModalClose,
    bookings,
    ref,
}: RootProps) => {
    const {
        setBookingViewType,
        setWeekAndViewType,
        setTodayDayAndViewType,
        bookingViewType,
    } = useGlobalStore();

    useImperativeHandle(ref, () => ({
        updateViewType: (bookingType) => {
            setBookingViewType(bookingType);
        },
        updateWeekAndViewType: (date) => {
            return setWeekAndViewType(date);
        },
        updateTodayDayAndViewType: (date) => {
            return setTodayDayAndViewType(date);
        },
    }));

    useEffect(() => {
        onChangeViewType(bookingViewType);
    }, [bookingViewType]);

    return (
        <BookingProvider {...initialBookingFormState}>
            <BookingModalProvider
                createBookingModal={createBookingModal}
                viewModes={viewModes}
                onHeaderDayClick={onHeaderDayClick}
                onTodayClick={onTodayClick}
                onCardDropCallback={onCardDropCallback}
                onDayChange={onDayChange}
                onSlotClick={onSlotClick}
                onModalClose={onModalClose}
                bookings={bookings}
            >
                <NewEventProvider {...initialFormState}>
                    <CalendarHolder />
                </NewEventProvider>
            </BookingModalProvider>
        </BookingProvider>
    );
};

export default Root;
