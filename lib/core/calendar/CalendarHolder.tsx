import { type CSSProperties, useCallback, useEffect } from "react";

import {
    DndContext,
    type DragEndEvent,
    type DragStartEvent,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { GridLoader } from "react-spinners";

import DaysWeek from "../header-calendar/DaysOfWeek";
import Header from "../header-calendar/Header";
import CalendarView from "./CalendarView";

import HandleViewType from "./ViewTypes";

import type {
    Booking,
    BookingBulkData,
    BookingDateAndTime,
} from "../../@types/booking";

import { MonthDescriptionProvider } from "../../context";
import useDragStartAtStore from "../../context/drag/useDragStateAtStore";
import buildEmptyTimeSlotKey from "../../context/emptySlotsStore/emptySlotKey";
import useEmptySlotStore from "../../context/emptySlotsStore/useEmptySlotStore";
import { initialMonthDescriptionState } from "../../context/month-description/month-description-store";

import { DAY_TIME_STARTER } from "../../constants";

import { useBookingModal, useGlobalStore } from "../../hooks";
import { dateUtils } from "../../utils/date.utils";

import { mockUser } from "../../mock/booking-mock";

interface CalendarHolderProps {
    isLoading: boolean;
}

const activationConstraint = {
    distance: 5,
};

const CalendarHolder = ({ isLoading }: CalendarHolderProps) => {
    const { bookings } = useBookingModal();

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint }),
        useSensor(TouchSensor, { activationConstraint }),
    );

    const {
        setBookingBulkData,
        optimisticCardUpdate,
        bookingViewType,
        daysOfWeek,
    } = useGlobalStore();
    const { onCardDropCallback } = useBookingModal();

    const { emptySlotNodes } = useEmptySlotStore();

    const { updateBooking, updateSlotData } = useDragStartAtStore(
        (state) => state,
    );

    const onDragStart = useCallback(
        (event: DragStartEvent) => {
            const { active } = event;

            if (active.data.current) {
                updateBooking(active.data.current.booking);
                updateSlotData(active.data.current.slotData);
            }

            if (active.id === "booking_info") return;
        },
        [updateBooking, updateSlotData],
    );

    const deleteOverFlowRender = useCallback(
        (booking: Booking, finishAt: Date) => {
            const keyToFind = buildEmptyTimeSlotKey({
                key: finishAt.toDateString(),
                time: DAY_TIME_STARTER,
            });

            const slotNode = emptySlotNodes.get(keyToFind);

            if (!slotNode) {
                console.warn("SlotNode not found:", keyToFind);
                return;
            }

            slotNode.removeFromAdditionalBooking(booking);
        },
        [emptySlotNodes],
    );

    const clearOverflowCards = (booking: Booking) => {
        const daysDifference = dateUtils.calculateDaysDifference(
            booking.finishAt,
            booking.startAt,
        );

        const futureDateList = dateUtils.buildFutureDateList(
            booking,
            daysDifference,
        );

        for (const cards of futureDateList) {
            deleteOverFlowRender(booking, cards);
        }
    };

    const handleOnDrop = async (
        booking: Booking,
        overId: string,
        slotData: BookingDateAndTime,
    ) => {
        try {
            const { startAt, finishAt } = dateUtils.bookingTimeRange(
                booking,
                overId,
            );

            optimisticCardUpdate(booking, startAt, finishAt, slotData);
            await onCardDropCallback(booking, overId, slotData, {
                id: booking.id,
                startAt,
                finishAt,
            });

            clearOverflowCards(booking);
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
                    const findRealBooking = bookings.find(
                        (b) => b.id === activeCurrent.booking.id,
                    );

                    if (!findRealBooking) return;

                    handleOnDrop(
                        findRealBooking,
                        String(over.id),
                        activeCurrent.slotData,
                    );

                    updateSlotData(null);
                    updateBooking(null);
                }
            }
        }
    };

    const override: CSSProperties = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate('-50%',  '-50%')",
        zIndex: 100,
    };

    useEffect(() => {
        const bookData: BookingBulkData = {
            user: mockUser,
            booking: bookings,
        };
        setBookingBulkData(bookData);
    }, [bookings, setBookingBulkData]);

    return (
        <div className="calendarHolder">
            <MonthDescriptionProvider {...initialMonthDescriptionState}>
                <div className="calendarHolder_parent">
                    <Header />
                    <div className="calendarHolder_parent_content">
                        <DaysWeek
                            daysOfWeek={daysOfWeek}
                            bookingViewType={bookingViewType}
                        />
                        <HandleViewType>
                            <DndContext
                                onDragEnd={handleDragEnd}
                                onDragStart={onDragStart}
                                sensors={sensors}
                                // modifiers={[snapCenterToCursor]}
                            >
                                <CalendarView />
                            </DndContext>
                        </HandleViewType>
                    </div>
                </div>
            </MonthDescriptionProvider>

            <GridLoader
                color={"#000000aa"}
                loading={isLoading}
                cssOverride={override}
                size={15}
                aria-label="Loading Spinner"
                data-testid="GridLoader"
            />
        </div>
    );
};

export default CalendarHolder;
