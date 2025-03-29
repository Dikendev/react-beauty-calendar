import { useCallback, useMemo } from "react";
import { useGlobalStore, useMonthDescription } from "../../hooks";

import { BOOKING_VIEW_TYPE, MONTH } from "../../constants";
import { DateUtils, WEEK_DAYS } from "../../utils/date-utils";

import type { BookingViewType } from "../../@types/booking";
import type { MonthDescriptionProps } from "../../context/month-description/month-description-store";
import { cn } from "../../lib/utils";

import styles from "./daysOfWeek.module.css";

interface DaysWeekProps {
    daysOfWeek: Date[];
    bookingViewType: BookingViewType;
}

const DaysWeek = ({ daysOfWeek, bookingViewType }: DaysWeekProps) => {
    const { setTodayDay, setBookingViewType } = useGlobalStore();
    const { updateMonthMessage } = useMonthDescription((state) => state);

    const dayStyle =
        bookingViewType === BOOKING_VIEW_TYPE.DAY
            ? "text-start"
            : "text-center";

    const tableStyle =
        bookingViewType === BOOKING_VIEW_TYPE.TABLE && "justify-self-start";

    const handleClickDay = useCallback(
        (day: Date) => {
            const daySelected = setTodayDay(day);

            if (!daySelected) return;

            const monthData: MonthDescriptionProps = {
                month: daySelected.getMonth(),
                fullYear: daySelected.getFullYear(),
                monthMessage: MONTH[daySelected.getMonth()],
            };

            updateMonthMessage(monthData);
            setBookingViewType(BOOKING_VIEW_TYPE.DAY);
        },
        [setTodayDay, updateMonthMessage, setBookingViewType],
    );

    const daysOfWeekRender = useMemo(() => {
        const ifIsToday = (day: Date): boolean => {
            return new Date(day).toDateString() === new Date().toDateString();
        };

        return daysOfWeek.map((day) => {
            const dayOfWeek = WEEK_DAYS[new Date(day).getDay()];

            return (
                <th
                    key={dayOfWeek}
                    className={cn(
                        "min-w-[12rem] w-[100vw]",
                        bookingViewType !== BOOKING_VIEW_TYPE.DAY &&
                            "max-w-[2rem]",
                    )}
                >
                    <div
                        className={cn(
                            "flex flex-col gap-[3px] text-gray-500 ",
                            dayStyle,
                            tableStyle,
                        )}
                    >
                        <span
                            className={cn(ifIsToday(day) && "text-purple-500")}
                        >
                            {dayOfWeek}
                        </span>
                        <div className="w-full">
                            <button
                                type="button"
                                className={cn(
                                    "hover:cursor-pointer",
                                    ifIsToday(day)
                                        ? "bg-purple-500 text-white rounded-full p-1"
                                        : "hover:bg-gray-100 hover:border hover:border-gray-300 p-2 border-none rounded-full",
                                )}
                                onClick={() => handleClickDay(day)}
                            >
                                {DateUtils.formatDate(day.toDateString())}
                            </button>
                        </div>
                    </div>
                </th>
            );
        });
    }, [daysOfWeek, dayStyle, handleClickDay, tableStyle, bookingViewType]);

    const emptyFirstHeaderColumnSlot = (
        <th key="emptyBlocks" className={cn(styles.calendarHeader, tableStyle)}>
            <div className="max-w-[4rem] min-w-[4rem] h-16 w-16" />
        </th>
    );

    return (
        <table className="min-w-full w-full bg-white no-border-sides">
            <tbody>
                <tr>
                    {emptyFirstHeaderColumnSlot}
                    {daysOfWeekRender}
                </tr>
            </tbody>
        </table>
    );
};

export default DaysWeek;
