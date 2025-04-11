import { useEffect, useImperativeHandle } from "react";
import type { RootProps } from "../@types/calendar-instance";
import { initialBookingFormState } from "../context/booking/booking-store";
import CalendarHolder from "./calendar/CalendarHolder";

import { BookingModalProvider, BookingProvider } from "../context";
import { NewEventProvider } from "../context/new-event/new-event-context";
import { initialFormState } from "../context/new-event/new-event-store";

import "./../App.css";
import useEmptySlotStore from "../context/emptySlotsStore.ts/useEmptySlotStore";
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

    const { setSelectedNode } = useEmptySlotStore((store) => store);

    useImperativeHandle(ref, () => ({
        updateViewType: (bookingType) => setBookingViewType(bookingType),
        updateWeekAndViewType: (date) => setWeekAndViewType(date),
        updateTodayDayAndViewType: (date) => setTodayDayAndViewType(date),
        updateSelectedNode: (nodeKey: string) => setSelectedNode(nodeKey),
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
