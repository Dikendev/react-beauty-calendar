import { type CSSProperties, useCallback, useMemo } from "react";
import { useGlobalStore, useMonthDescription } from "../../hooks";

import { BOOKING_VIEW_TYPE, MONTH } from "../../constants";
import { DateUtils, WEEK_DAYS } from "../../utils/date-utils";

import type { BookingViewType } from "../../@types/booking";
import type { MonthDescriptionProps } from "../../context/month-description/month-description-store";
import { cn } from "../../lib/utils";

interface DaysWeekProps {
    daysOfWeek: Date[];
    bookingViewType: BookingViewType;
}

const DaysWeek = ({ daysOfWeek, bookingViewType }: DaysWeekProps) => {
    const { setTodayDay, setBookingViewType } = useGlobalStore();
    const { updateMonthMessage } = useMonthDescription((state) => state);

    const dayStyle: CSSProperties =
        bookingViewType === BOOKING_VIEW_TYPE.DAY
            ? { textAlign: "start" }
            : { textAlign: "center" };

    const tableStyle: CSSProperties =
        bookingViewType === BOOKING_VIEW_TYPE.TABLE
            ? { justifySelf: "start" }
            : {};

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
                        "daysOfWeek",
                        bookingViewType !== BOOKING_VIEW_TYPE.DAY &&
                            "daysOfWeek_day",
                    )}
                >
                    <div
                        style={{ ...dayStyle, ...tableStyle }}
                        className="daysOfWeek_parent"
                    >
                        <span
                            className={cn(
                                ifIsToday(day) && "daysOfWeek_day_today_title",
                            )}
                        >
                            {dayOfWeek}
                        </span>
                        <div style={{ width: "100%" }}>
                            <button
                                type="button"
                                className={cn(
                                    "daysOfWeek_day",
                                    ifIsToday(day)
                                        ? "daysOfWeek_day_today"
                                        : "daysOfWeek_day_rest",
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
    }, [daysOfWeek, handleClickDay, bookingViewType]);

    const emptyFirstHeaderColumnSlot = (
        <th key="emptyBlocks" style={tableStyle} className={"calendarHeader"}>
            <div className="daysOfWeek_emptySlot" />
        </th>
    );

    return (
        <table className="daysOfWeek_emptySlot_table">
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
