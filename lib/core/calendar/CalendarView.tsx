import {
    type CSSProperties,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useShallow } from "zustand/shallow";

import { Table, TableCell } from "../../components/ui/Table";
import BookingCardContent from "../booking-card/BookingCardContent";
import CardOverlay from "../slots/CardOverlay";
import Slots from "../slots/Slots";
import HourWithActions from "./HourWithActions";
import type { HourWithActionsRef } from "./HourWithActions";

import { cn } from "../../lib/utils";
import { dateUtils } from "../../utils";
import type { BookingCardContentRef } from "../../utils/forward";

import { BOOKING_VIEW_TYPE } from "../../constants";

import useDragStartAtStore from "../../context/drag/useDragStateAtStore";
import useEmptySlotStore from "../../context/emptySlotsStore/useEmptySlotStore";
import { useGlobalStore, useNewEventStore } from "../../hooks";

const CalendarView = () => {
    const {
        hours,
        daysOfWeek,
        bookingViewType,
        bookingBulkData,
        addTimesRendered,
    } = useGlobalStore(
        useShallow((state) => {
            return {
                addTimesRendered: state.addTimesRendered,
                bookingBulkData: state.bookingBulkData,
                bookingViewType: state.bookingViewType,
                daysOfWeek: state.daysOfWeek,
                hours: state.hours,
            };
        }),
    );

    const { selectedNode, emptySlotNodes } = useEmptySlotStore();

    const { finishAt, updateFinishAtWithOffset } = useNewEventStore(
        (state) => state,
    );

    const { booking, slotData, startAt } = useDragStartAtStore(
        (state) => state,
    );

    const [lunchTimeBlock] = useState({
        startAt: "12:00",
        finishAt: "12:30",
    });

    const currentBookingCardRef = useRef<BookingCardContentRef>(null);

    const addTimeRenderedStore = useCallback(
        (node: HourWithActionsRef | null, hourKey: string) => {
            if (node) addTimesRendered(node, hourKey);
        },
        [addTimesRendered],
    );

    const dayCss: CSSProperties = useMemo(() => {
        return bookingViewType === BOOKING_VIEW_TYPE.DAY
            ? {
                  maxWidth: "5rem",
                  padding: 0,
                  minWidth: "4rem",
              }
            : {};
    }, [bookingViewType]);

    const noBorderFirstColumn: CSSProperties = useMemo(
        () => ({
            borderLeft: "none",
            backgroundColor: "white",
        }),
        [],
    );

    const selectedTimeHour = useMemo(() => {
        return selectedNode.split(";")[1];
    }, [selectedNode]);

    const bookingOverlayCard = useMemo(() => {
        if (booking && slotData) {
            return (
                <BookingCardContent
                    ref={currentBookingCardRef}
                    style={{ borderRadius: "0.25rem" }}
                    booking={booking}
                    slotData={slotData}
                />
            );
        }
    }, [booking, slotData]);

    useEffect(() => {
        if (selectedNode) {
            const emptySlotNode = emptySlotNodes.get(selectedNode);
            emptySlotNode?.showEvent(selectedTimeHour);
        }
    }, [selectedNode, emptySlotNodes]);

    useEffect(() => {
        if (selectedTimeHour === finishAt) {
            updateFinishAtWithOffset(selectedTimeHour);
        }
    }, [selectedNode, finishAt]);

    useEffect(() => {
        if (booking && startAt && currentBookingCardRef?.current) {
            const result = dateUtils.bookingTimeRange(booking, startAt);
            currentBookingCardRef.current.updateBooking(result);
        }
    }, [booking, startAt]);

    const tableContent = useMemo(() => {
        const isFistDay = (dayOfWeekIndex: number) => dayOfWeekIndex === 0;

        return (
            <div
                className={cn(
                    "calendarCore",
                    bookingViewType === BOOKING_VIEW_TYPE.WEEK &&
                        "calendarCore_max",
                )}
            >
                <Table>
                    <tbody>
                        {hours.map((hour) => (
                            <tr key={`${hour}-content`}>
                                <TableCell
                                    style={{
                                        ...noBorderFirstColumn,
                                        ...dayCss,
                                        padding: 0,
                                        position: "relative",
                                    }}
                                    key={`${hour}-hour`}
                                    className="calendarCore_cell"
                                >
                                    <div className="calendarCore_actions">
                                        <HourWithActions
                                            ref={(node) =>
                                                addTimeRenderedStore(node, hour)
                                            }
                                            hour={hour}
                                        />
                                    </div>
                                </TableCell>

                                {daysOfWeek.map((day, dayOfWeekIndex) => {
                                    return (
                                        <Slots
                                            key={`${day}-${hour}-slot-content`}
                                            dayHour={{
                                                day: String(day),
                                                hour,
                                            }}
                                            lunchTimeBlock={lunchTimeBlock}
                                            firstDay={isFistDay(dayOfWeekIndex)}
                                            bookingBulk={
                                                bookingBulkData.booking
                                            }
                                        />
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <CardOverlay>{bookingOverlayCard}</CardOverlay>
            </div>
        );
    }, [
        dayCss,
        hours,
        noBorderFirstColumn,
        bookingBulkData.booking,
        addTimeRenderedStore,
        bookingViewType,
        daysOfWeek,
        daysOfWeek.length,
        bookingOverlayCard,
    ]);

    return tableContent;
};

export default CalendarView;
