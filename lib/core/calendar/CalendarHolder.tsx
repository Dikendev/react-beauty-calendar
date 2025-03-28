import { useCallback, useEffect, useMemo } from "react";

import {
    DndContext,
    type DragEndEvent,
    type DragStartEvent,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";

import DaysWeek from "../header-calendar/DaysOfWeek";
import Header from "../header-calendar/Header";
import HandleViewType from "./ViewTypes";

import type {
    Booking,
    BookingBulkData,
    BookingDateAndTime,
} from "../../@types/booking";

import useDragStore from "../../context/drag/dragStore";

import { MonthDescriptionProvider } from "../../context";
import { initialMonthDescriptionState } from "../../context/month-description/month-description-store";
import { useGlobalStore } from "../../hooks";
import useBookingModal from "../../hooks/use-booking-model";

import { mockUser } from "../../mock/booking-mock";

const CalendarHolder = () => {
    const { isDelayActive } = useDragStore((state) => state);
    const { bookings } = useBookingModal();

    const activationConstraint = useMemo(() => {
        return {
            delay: isDelayActive ? 500 : 0,
            tolerance: 100,
        };
    }, [isDelayActive]);

    const { setBookingBulkData, optimisticCardUpdate } = useGlobalStore();
    const { onCardDropCallback } = useBookingModal();

    useEffect(() => {
        const bookData: BookingBulkData = {
            user: mockUser,
            booking: bookings,
        };
        setBookingBulkData(bookData);
    }, [bookings, setBookingBulkData]);

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint }),
        useSensor(TouchSensor, { activationConstraint }),
    );

    const { bookingViewType, daysOfWeek } = useGlobalStore();

    const onDragStart = useCallback((event: DragStartEvent) => {
        const { active } = event;
        if (active.id === "unique-id") return;
    }, []);

    const getTimeDiff = (startTime: Date, endTime: Date) => {
        const diffInMs =
            Number(new Date(endTime)) - Number(new Date(startTime));
        const diffInMinutes = Math.floor(diffInMs / 1000 / 60);

        const hours = Math.floor(diffInMinutes / 60);
        const minutes = diffInMinutes % 60;
        return `${hours}:${minutes.toString().padStart(2, "0")}`;
    };

    const newFinishAt = (newStartAt: string, timeString: string) => {
        const newDay = new Date(newStartAt);

        const splitTimeString = timeString.split(":");
        const hour = Number(splitTimeString[0]);
        const minutes = Number(splitTimeString[1]);

        newDay.setHours(newDay.getHours() + hour);
        newDay.setMinutes(newDay.getMinutes() + minutes);
        return newDay;
    };

    const bookingTimeRange = (booking: Booking, overId: string) => {
        const newStartAt = new Date(overId);
        const timeDiff = getTimeDiff(booking.startAt, booking.finishAt);
        const newFinishDate = newFinishAt(overId, timeDiff);

        return {
            newStartAt,
            newFinishDate,
        };
    };

    const handleOnDrop = async (
        booking: Booking,
        overId: string,
        slotData: BookingDateAndTime,
    ) => {
        try {
            const { newStartAt, newFinishDate } = bookingTimeRange(
                booking,
                overId,
            );
            optimisticCardUpdate(booking, newStartAt, newFinishDate, slotData);
            await onCardDropCallback(booking, overId, slotData);
        } catch (error) {
            // TODO: implement the rollback if the update return error.
            console.warn(error);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { over, active } = event;

        if (over && active) {
            const overCurrent = over.data.current;
            const activeCurrent = active.data.current;

            if (
                activeCurrent &&
                overCurrent &&
                overCurrent.accepts.includes(activeCurrent.type)
            ) {
                if (activeCurrent.booking.id && over.id) {
                    handleOnDrop(
                        activeCurrent.booking,
                        String(over.id),
                        activeCurrent.slotData,
                    );
                }
            }
        }
    };

    return (
        <div className=" z-[100]">
            <MonthDescriptionProvider {...initialMonthDescriptionState}>
                <div className="sticky top-0 w-full h-full z-[100]">
                    <Header />
                    <div className="z-[100]">
                        <DaysWeek
                            daysOfWeek={daysOfWeek}
                            bookingViewType={bookingViewType}
                        />
                    </div>
                </div>
                <DndContext
                    onDragEnd={handleDragEnd}
                    onDragStart={onDragStart}
                    sensors={sensors}
                >
                    <HandleViewType bookingViewType={bookingViewType} />
                </DndContext>
            </MonthDescriptionProvider>
        </div>
    );
};

export default CalendarHolder;
