import {
    type CSSProperties,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import Slots from "../slots/Slots";

import { TableCell, TableRow } from "../../components/ui/Table";
import { BOOKING_VIEW_TYPE } from "../../constants";
import useEmptySlotStore from "../../context/emptySlotsStore.ts/useEmptySlotStore";
import { useGlobalStore } from "../../hooks";
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

    useEffect(() => {
        if (selectedNode) {
            const emptySlotNode = emptySlotNodes.get(selectedNode);
            if (emptySlotNode) emptySlotNode.showEvent();
        }
    }, [selectedNode, emptySlotNodes]);

    const tableContent = useMemo(() => {
        const fistTimeSlot = (slotIndex: number) => slotIndex === 0;
        const isFistDay = (dayOfWeekIndex: number) => dayOfWeekIndex === 0;

        return (
            <>
                {hours.map((hour, slotIndex) => (
                    <tr key={`${hour}-content`}>
                        <TableCell
                            style={{
                                ...noBorderFirstColumn,
                                ...dayCss,
                                padding: 0,
                                position: "relative",
                            }}
                            key={`${hour}-hour`}
                            className="border border-gray-300 py-2 px-4 text-center w-3 min-w-16"
                        >
                            <div className="absolute top-[-3px] bg-white">
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
                                    firstTimeSlot={fistTimeSlot(slotIndex)}
                                    lunchTimeBlock={lunchTimeBlock}
                                    firstDay={isFistDay(dayOfWeekIndex)}
                                    bookingBulk={bookingBulkData.booking}
                                    bookingViewType={bookingViewType}
                                />
                            );
                        })}
                    </tr>
                ))}
            </>
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
