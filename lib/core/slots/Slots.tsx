import { useDroppable } from "@dnd-kit/core";
import { useMemo, useRef } from "react";

import { DateUtils } from "../../utils/date-utils";

import EmptySlot, { type BlocksTimeStructure } from "./EmptySlot";

import type {
    Booking,
    BookingDateAndTime,
    BookingViewType,
} from "../../@types/booking";
import { BOOKING_VIEW_TYPE } from "../../constants";
import useDragStore from "../../context/drag/dragStore";

import { cn } from "../../lib/utils";

export type TimesBlock = "first" | "second" | "third" | "fourth";

interface SlotsProps {
    dayHour: BookingDateAndTime;
    lunchTimeBlock: {
        startAt: string;
        finishAt: string;
    };
    firstDay: boolean;
    bookingViewType: BookingViewType;
    bookingBulk: Booking[];
}

const Slots = ({
    dayHour,
    lunchTimeBlock,
    firstDay,
    bookingBulk,
    bookingViewType,
}: SlotsProps) => {
    const isDragging = useDragStore((state) => state.isDragging);

    const disabledCss = useRef<string>("");

    const isTimeLunch = (hour: string) => {
        if (
            hour === lunchTimeBlock.startAt ||
            hour === lunchTimeBlock.finishAt
        ) {
            disabledCss.current = "bg-gray-200 border-none";
            return true;
        }
        return false;
    };

    const secondBlockTime = DateUtils.addMinuteToHour(dayHour.hour, 15); // example 08:15
    const thirdBlockTime = DateUtils.addMinuteToHour(dayHour.hour, 30); // example 08:30
    const fourthBlockTime = DateUtils.addMinuteToHour(dayHour.hour, 45); // example 08:40

    const { isOver: isOverFirst, setNodeRef: setNodeRefFirst } = useDroppable({
        id: `${DateUtils.newDateKey(dayHour.day, dayHour.hour)}`,
        data: { accepts: ["booking-slots"] },
        disabled: isTimeLunch(dayHour.hour) || isDragging,
    });

    const { isOver: isOverSecond, setNodeRef: setNodeRefSecond } = useDroppable(
        {
            id: `${DateUtils.newDateKey(dayHour.day, secondBlockTime)}`,
            data: { accepts: ["booking-slots"] },
            disabled: isTimeLunch(secondBlockTime) || isDragging,
        },
    );

    const { isOver: isOverThird, setNodeRef: setNodeRefThird } = useDroppable({
        id: `${DateUtils.newDateKey(dayHour.day, thirdBlockTime)}`,
        data: { accepts: ["booking-slots"] },
        disabled: isTimeLunch(thirdBlockTime) || isDragging,
    });

    const { isOver: isOverFourth, setNodeRef: setNodeRefFourth } = useDroppable(
        {
            id: `${DateUtils.newDateKey(dayHour.day, fourthBlockTime)}`,
            data: { accepts: ["booking-slots"] },
            disabled: isTimeLunch(fourthBlockTime) || isDragging,
        },
    );

    const firstBlockTimeData: BlocksTimeStructure = useMemo(() => {
        return {
            ref: setNodeRefFirst,
            style: { backgroundColor: isOverFirst ? "#0066ff" : "" },
            key: DateUtils.newDateKey(dayHour.day, dayHour.hour),
            time: dayHour.hour,
        };
    }, [dayHour.day, dayHour.hour, isOverFirst, setNodeRefFirst]);

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
    }, [dayHour.day, isOverThird, setNodeRefThird, thirdBlockTime]);

    const fourthBlockTimeData: BlocksTimeStructure = useMemo(() => {
        return {
            ref: setNodeRefFourth,
            style: { backgroundColor: isOverFourth ? "#0066ff" : "" },
            key: DateUtils.newDateKey(dayHour.day, fourthBlockTime),
            time: fourthBlockTime,
        };
    }, [dayHour.day, fourthBlockTime, isOverFourth, setNodeRefFourth]);

    const slotRender = useMemo(() => {
        const { day, hour } = dayHour;

        const bookings = bookingBulk.filter((bookingEvent) => {
            const startTime = DateUtils.dateAndHourDateToString(
                bookingEvent.startAt,
            );

            const bookingDay = new Date(bookingEvent.startAt).getDate();
            const slotDay = new Date(day).getDate();

            const slotHour = hour.split(":")[0];
            const bookingHour = startTime.split(":")[0];

            const sameHour = bookingHour === slotHour;
            const isSameDay = bookingDay === slotDay;
            return sameHour && isSameDay;
        });

        if (!bookings.length) {
            return (
                <EmptySlot
                    first={firstBlockTimeData}
                    second={secondBlockTimeData}
                    third={thirdBlockTimeData}
                    fourth={fourthBlockTimeData}
                    disabledCss={disabledCss.current}
                    firstDay={firstDay}
                />
            );
        }

        return (
            <EmptySlot
                dayHour={dayHour}
                bookings={bookings}
                first={firstBlockTimeData}
                second={secondBlockTimeData}
                third={thirdBlockTimeData}
                fourth={fourthBlockTimeData}
                disabledCss={disabledCss.current}
                firstDay={firstDay}
            />
        );
    }, [
        bookingBulk,
        dayHour,
        firstDay,
        firstBlockTimeData,
        fourthBlockTimeData,
        secondBlockTimeData,
        thirdBlockTimeData,
    ]);

    return (
        <td
            key={`${dayHour.day}-${dayHour.hour}-slot`}
            className={cn(
                "bg-white border border-gray-300 w-[80rem] p-0 relative z-[0px]",
                bookingViewType === BOOKING_VIEW_TYPE.WEEK && "max-w-[10rem]",
            )}
        >
            {slotRender}
        </td>
    );
};

export default Slots;
