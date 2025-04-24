import { useRef } from "react";
import type { BookingViewType } from "../@types/booking";
import type {
    CalendarInstanceRef,
    UseBookingInstanceProps,
} from "../@types/calendar-instance";

import ReferenceErrorCustom from "../classes/reference-error";

import type { NextAndPreviousWeek } from "../context/global/days-and-week/day-and-week-store";
import Root from "../core/Root";

const useCalendarInstance = (
    props: UseBookingInstanceProps,
): CalendarInstanceRef => {
    const calendarRef = useRef<CalendarInstanceRef>(null);

    const ensureCalendarRefExists = () => {
        if (!calendarRef?.current) {
            throw new ReferenceErrorCustom();
        }
    };

    const updateViewType = (bookingType: BookingViewType) => {
        ensureCalendarRefExists();
        calendarRef.current?.updateViewType(bookingType);
    };

    const updateWeekAndViewType = (
        date: Date,
    ): NextAndPreviousWeek | undefined => {
        ensureCalendarRefExists();
        return calendarRef.current?.updateWeekAndViewType(date);
    };

    const updateTodayDayAndViewType = (date: Date): Date | undefined => {
        ensureCalendarRefExists();
        return calendarRef.current?.updateTodayDayAndViewType(date);
    };

    const updateSelectedNode = (nodeKey: string): void => {
        ensureCalendarRefExists();
        calendarRef.current?.updateSelectedNode(nodeKey);
    };

    const updateFinishAt = (hour24Format: string): void => {
        ensureCalendarRefExists();
        calendarRef.current?.updateFinishAt(hour24Format);
    };

    const changeLoading = (status: boolean): void => {
        ensureCalendarRefExists();
        calendarRef.current?.changeLoading(status);
    };

    const goToDay = (date: Date): void => {
        ensureCalendarRefExists();
        calendarRef.current?.goToDay(date);
    };

    const goToWeek = (date: Date): void => {
        ensureCalendarRefExists();
        calendarRef.current?.goToWeek(date);
    };

    const getCalendar = () => {
        return <Root ref={calendarRef} {...props} />;
    };

    return {
        getCalendar,
        updateViewType,
        updateWeekAndViewType,
        updateTodayDayAndViewType,
        updateSelectedNode,
        updateFinishAt,
        changeLoading,
        goToDay,
        goToWeek,
    };
};

export default useCalendarInstance;
