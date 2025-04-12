import {
    type CSSProperties,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import Slots from "../slots/Slots";

import { Table, TableCell } from "../../components/ui/Table";
import { BOOKING_VIEW_TYPE } from "../../constants";
import useEmptySlotStore from "../../context/emptySlotsStore.ts/useEmptySlotStore";
import { useGlobalStore, useNewEventStore } from "../../hooks";
import { cn } from "../../lib/utils";
import HourWithActions, { type HourWithActionsRef } from "./HourWithActions";

const CalendarView = () => {
    const {
        hours,
        daysOfWeek,
        bookingViewType,
        bookingBulkData,
        addTimesRendered,
    } = useGlobalStore();

    const { selectedNode, emptySlotNodes } = useEmptySlotStore();
    const { finishAt, updateFinishAtWithOffset } = useNewEventStore(
        (state) => state,
    );

    const [lunchTimeBlock] = useState({
        startAt: "12:00",
        finishAt: "12:30",
    });

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

    const selectedTimeHour = (): string => {
        return selectedNode.split(";")[1];
    };

    useEffect(() => {
        if (selectedNode) {
            const emptySlotNode = emptySlotNodes.get(selectedNode);
            emptySlotNode?.showEvent(selectedTimeHour());
        }
    }, [selectedNode, emptySlotNodes]);

    useEffect(() => {
        if (selectedTimeHour() === finishAt) {
            updateFinishAtWithOffset(selectedTimeHour());
        }
    }, [selectedNode, finishAt]);

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
                                            bookingViewType={bookingViewType}
                                        />
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        );
    }, [
        dayCss,
        hours,
        lunchTimeBlock,
        noBorderFirstColumn,
        bookingBulkData,
        addTimeRenderedStore,
        bookingViewType,
        daysOfWeek,
    ]);

    return tableContent;
};

export default CalendarView;
