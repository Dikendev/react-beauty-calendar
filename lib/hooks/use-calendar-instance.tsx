import { useRef } from "react";
import type { JSX } from "react";
import type { CalendarInstanceRef } from "../../src/App";
import type { UseBookingInstanceProps } from "../@types/calendar-instance";
import Root from "../core/Root";

interface BookingInstance {
    getCalendar: () => JSX.Element;
}

const useCalendarInstance = (
    props: UseBookingInstanceProps,
): BookingInstance => {
    console.log("creating a calendar instance");

    const calendarRef = useRef<CalendarInstanceRef>(null);

    const getCalendar = () => {
        return <Root ref={calendarRef} {...props} />;
    };

    return {
        getCalendar,
    };
};

export default useCalendarInstance;
