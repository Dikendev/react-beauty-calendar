import { useDroppable } from "@dnd-kit/core";
import { useEffect, useMemo, useRef } from "react";

import { DateUtils } from "../../utils/date-utils";

import type { BlocksTimeStructure } from "./EmptySlot";

import type { Booking, BookingDateAndTime } from "../../@types/booking";
import { BOOKING_VIEW_TYPE } from "../../constants";

import { useShallow } from "zustand/shallow";
import useDragStartAtStore from "../../context/drag/useDragStateAtStore";
import { useGlobalStore } from "../../hooks";
import { cn } from "../../lib/utils";
import SlotRender from "./SlotRender";

export type TimesBlock = "first" | "second" | "third" | "fourth";

interface SlotsProps {
    dayHour: BookingDateAndTime;
    lunchTimeBlock: {
        startAt: string;
        finishAt: string;
    };
    firstDay: boolean;
    bookingBulk: Booking[];
}

const Slots = ({
    dayHour,
    lunchTimeBlock,
    firstDay,
    bookingBulk,
}: SlotsProps) => {
    const disabledCss = useRef<string>("");

    const updateStartAt = useDragStartAtStore((store) => store.updateStartAt);

    const { bookingViewType } = useGlobalStore(
        useShallow((state) => ({
            bookingViewType: state.bookingViewType,
        })),
    );

    //TODO: create a issue to fix this, it is hard to understand and complex to maintain, need to improve this.
    const isTimeLunch = (hour: string) => {
        if (
            hour === lunchTimeBlock.startAt ||
            hour === lunchTimeBlock.finishAt
        ) {
            disabledCss.current = "slot_disabled";
            return true;
        }
        return false;
    };

    const secondBlockTime = useMemo(() => {
        return DateUtils.addMinuteToHour(dayHour.hour, 15);
    }, [dayHour.hour]); // example 08:15

    const thirdBlockTime = useMemo(() => {
        return DateUtils.addMinuteToHour(dayHour.hour, 30);
    }, [dayHour.hour]); // example 08:30

    const fourthBlockTime = useMemo(() => {
        return DateUtils.addMinuteToHour(dayHour.hour, 45);
    }, [dayHour.hour]); // example 08:40

    const { isOver: isOverFirst, setNodeRef: setNodeRefFirst } = useDroppable({
        id: `${DateUtils.newDateKey(dayHour.day, dayHour.hour)}`,
        data: { accepts: ["booking-slots"] },
        // disabled: isTimeLunch(dayHour.hour),
    });

    const { isOver: isOverSecond, setNodeRef: setNodeRefSecond } = useDroppable(
        {
            id: `${DateUtils.newDateKey(dayHour.day, secondBlockTime)}`,
            data: { accepts: ["booking-slots"] },
            // disabled: isTimeLunch(secondBlockTime),
        },
    );

    const { isOver: isOverThird, setNodeRef: setNodeRefThird } = useDroppable({
        id: `${DateUtils.newDateKey(dayHour.day, thirdBlockTime)}`,
        data: { accepts: ["booking-slots"] },
        // disabled: isTimeLunch(thirdBlockTime),
    });

    const { isOver: isOverFourth, setNodeRef: setNodeRefFourth } = useDroppable(
        {
            id: `${DateUtils.newDateKey(dayHour.day, fourthBlockTime)}`,
            data: { accepts: ["booking-slots"] },
            // disabled: isTimeLunch(fourthBlockTime),
        },
    );

    useEffect(() => {
        if (isOverFirst) {
            updateStartAt(`${DateUtils.newDateKey(dayHour.day, dayHour.hour)}`);
        }

        if (isOverSecond) {
            updateStartAt(
                `${DateUtils.newDateKey(dayHour.day, secondBlockTime)}`,
            );
        }

        if (isOverThird) {
            updateStartAt(
                `${DateUtils.newDateKey(dayHour.day, thirdBlockTime)}`,
            );
        }

        if (isOverFourth) {
            updateStartAt(
                `${DateUtils.newDateKey(dayHour.day, fourthBlockTime)}`,
            );
        }
    }, [isOverFirst, isOverSecond, isOverThird, isOverFourth]);

    const firstBlockTimeData: BlocksTimeStructure = useMemo(() => {
        return {
            ref: setNodeRefFirst,
            style: { backgroundColor: isOverFirst ? "#0066ff" : "" },
            key: DateUtils.newDateKey(dayHour.day, dayHour.hour),
            time: dayHour.hour,
        };
    }, [dayHour.day, isOverFirst, dayHour.hour, setNodeRefFirst]);

    const secondBlockTimeData: BlocksTimeStructure = useMemo(() => {
        return {
            ref: setNodeRefSecond,
            style: { backgroundColor: isOverSecond ? "#0066ff" : "" },
            key: DateUtils.newDateKey(dayHour.day, secondBlockTime),
            time: secondBlockTime,
        };
    }, [dayHour.day, isOverSecond, secondBlockTime, setNodeRefSecond]);

    const thirdBlockTimeData: BlocksTimeStructure = useMemo(() => {
        return {
            ref: setNodeRefThird,
            style: { backgroundColor: isOverThird ? "#0066ff" : "" },
            key: DateUtils.newDateKey(dayHour.day, thirdBlockTime),
            time: thirdBlockTime,
        };
    }, [dayHour.day, isOverThird, thirdBlockTime, setNodeRefThird]);

    const fourthBlockTimeData: BlocksTimeStructure = useMemo(() => {
        return {
            ref: setNodeRefFourth,
            style: { backgroundColor: isOverFourth ? "#0066ff" : "" },
            key: DateUtils.newDateKey(dayHour.day, fourthBlockTime),
            time: fourthBlockTime,
        };
    }, [dayHour.day, fourthBlockTime, isOverFourth, setNodeRefFourth]);

    return (
        <td
            key={`${dayHour.day}-${dayHour.hour}-slot`}
            className={cn(
                "slot",
                bookingViewType === BOOKING_VIEW_TYPE.WEEK && "slotWeek",
            )}
        >
            <SlotRender
                booking={bookingBulk}
                dayHour={dayHour}
                firstDay={firstDay}
                disabledCss={disabledCss.current}
                firstBlockTimeData={firstBlockTimeData}
                secondBlockTimeData={secondBlockTimeData}
                thirdBlockTimeData={thirdBlockTimeData}
                fourthBlockTimeData={fourthBlockTimeData}
            />
        </td>
    );
};

export default Slots;
