import { useEffect, useImperativeHandle, useRef, useState } from "react";
import type { RootProps } from "../@types/calendar-instance";
import { BookingModalProvider, BookingProvider } from "../context";
import { initialBookingFormState } from "../context/booking/booking-store";
import useEmptySlotStore from "../context/emptySlotsStore.ts/useEmptySlotStore";
import { NewEventProvider } from "../context/new-event/new-event-context";
import {
    type NewEventFormRef,
    initialFormState,
} from "../context/new-event/new-event-store";
import { useGlobalStore } from "../hooks";

import CalendarHolder from "./calendar/CalendarHolder";

import "./../App.css";

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
    const [loading, setLoading] = useState<boolean>(false);
    const newEventProviderRef = useRef<NewEventFormRef>(null);

    const {
        setBookingViewType,
        setWeekAndViewType,
        setTodayDayAndViewType,
        bookingViewType,
        setTodayDay,
        todayWeek,
    } = useGlobalStore();

    const { setSelectedNode } = useEmptySlotStore((store) => store);

    const updateFinishAt = (hour24Format: string) => {
        console.log("hour24Format", hour24Format);
        newEventProviderRef?.current?.updateFinishAt(hour24Format);
    };

    const goToDay = (date: Date): void => {
        setTodayDay(new Date(date));
    };

    const goToWeek = (date: Date): void => {
        todayWeek(new Date(date));
    };

    useImperativeHandle(ref, () => ({
        updateViewType: (bookingType) => setBookingViewType(bookingType),
        updateWeekAndViewType: (date) => setWeekAndViewType(date),
        updateTodayDayAndViewType: (date) => setTodayDayAndViewType(date),
        updateSelectedNode: (nodeKey: string) => {
            setTimeout(() => {
                setSelectedNode(nodeKey);
            }, 10);
        },
        updateFinishAt: (hour24Format: string) => updateFinishAt(hour24Format),
        changeLoading: (status: boolean) => setLoading(status),
        goToDay: (date) => goToDay(date),
        goToWeek: (date) => goToWeek(date),
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
                <NewEventProvider
                    ref={newEventProviderRef}
                    {...initialFormState}
                >
                    <CalendarHolder isLoading={loading} />
                </NewEventProvider>
            </BookingModalProvider>
        </BookingProvider>
    );
};

export default Root;
