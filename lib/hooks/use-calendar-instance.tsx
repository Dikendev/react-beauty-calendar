import { useRef } from "react";
import type { BookingViewType } from "../@types/booking";
import type {
    CalendarInstanceRef,
    UseBookingInstanceProps,
} from "../@types/calendar-instance";
import ReferenceErrorCustom from "../classes/reference-error";

import Root from "../core/Root";

const useCalendarInstance = (
    props: UseBookingInstanceProps,
): CalendarInstanceRef => {
    console.log("creating a calendar instance");

    const calendarRef = useRef<CalendarInstanceRef>(null);

    const updateViewType = (bookingType: BookingViewType) => {
        if (calendarRef?.current) {
            calendarRef.current.updateViewType(bookingType);
        }
    };

    const updateWeekAndViewType = (date?: Date) => {
        if (!calendarRef?.current) {
            throw new ReferenceErrorCustom();
        }
        return calendarRef.current.updateWeekAndViewType(date);
    };

    const updateTodayDayAndViewType = (date: Date) => {
        if (!calendarRef?.current) {
            throw new ReferenceErrorCustom();
        }
        return calendarRef.current.updateTodayDayAndViewType(date);
    };

    const getCalendar = () => {
        return <Root ref={calendarRef} {...props} />;
    };

    return {
        getCalendar,
        updateViewType,
        updateWeekAndViewType,
        updateTodayDayAndViewType,
    };
};

export default useCalendarInstance;
