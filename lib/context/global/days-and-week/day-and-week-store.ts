import type { StateCreator } from "zustand";
import type { HourWithActionsRef } from "../../../core/calendar/HourWithActions";
import { DateUtils } from "../../../utils/date-utils";
import { type Times, generateTimes } from "../../../utils/hours";

// Make a default to the calendar, but the user can change the start and the end time by props.
export const START_TIME = 1;
export const END_24_HOUR_FORMAT = 24;

export type DaysOfWeek = Date[];

export interface NextAndPreviousWeek {
    firstDayOfWeek: Date;
    lastDayOfWeek: Date;
}
export interface DayAndWeekProps {
    hours: Times;
    daysOfWeek: DaysOfWeek;
    timesRendered: Map<string, HourWithActionsRef>;
}

export interface DayAndWeekState extends DayAndWeekProps {
    setTodayDay: (date: Date) => Date;
    setDays: (days: number) => Date[];
    todayWeek: (date?: Date) => DaysOfWeek;
    getWeek: () => NextAndPreviousWeek;
    nextWeek: () => DaysOfWeek;
    previousWeek: () => DaysOfWeek;
    addTimesRendered: (element: HourWithActionsRef, hourKey: string) => void;
}

const initValuesWeek = DateUtils.generateWeekDays();

const dayAndWeekStore: StateCreator<DayAndWeekState> = (set, get) => ({
    hours: generateTimes(START_TIME, END_24_HOUR_FORMAT),
    daysOfWeek: initValuesWeek.week,
    timesRendered: new Map(),

    setTodayDay: (date: Date): Date => {
        const todaysDayDate = DateUtils.generateDays(date, 0);

        set((prev) => ({
            ...prev,
            daysOfWeek: todaysDayDate,
            lastDayOfWeek: todaysDayDate[0] || new Date(),
        }));

        return todaysDayDate[0];
    },

    todayWeek: (date?: Date): DaysOfWeek => {
        let week: Date[] = [];

        set((prev) => {
            const { week: daysOfWeek } = DateUtils.generateWeekDays(date);
            week = daysOfWeek;

            return {
                ...prev,
                daysOfWeek,
            };
        });

        return week;
    },

    nextWeek: (): DaysOfWeek => {
        const adding = DateUtils.addDay(get().getWeek().lastDayOfWeek, 1);
        let week: Date[] = [];

        const { week: daysOfWeek } = DateUtils.generateWeekDays(adding);
        week = daysOfWeek;

        set((prev) => ({
            ...prev,
            daysOfWeek,
        }));

        return week;
    },

    previousWeek: (): DaysOfWeek => {
        const minus = DateUtils.addDay(get().getWeek().firstDayOfWeek, -1);
        let week: Date[] = [];

        const { week: daysOfWeek } = DateUtils.generateWeekDays(minus);
        week = daysOfWeek;

        set((prev) => ({
            ...prev,
            daysOfWeek,
        }));

        return week;
    },

    setDays: (days: number): DaysOfWeek => {
        const actualDay = get().daysOfWeek[0];

        if (!actualDay) return [];

        const day = DateUtils.generateDays(actualDay, days);

        set((prev) => ({
            ...prev,
            daysOfWeek: day,
        }));

        return day;
    },

    getWeek: (): NextAndPreviousWeek => {
        const firstDayOfWeek = get().daysOfWeek[0];
        const lastDayOfWeek = get().daysOfWeek[get().daysOfWeek.length - 1];

        return {
            firstDayOfWeek,
            lastDayOfWeek,
        };
    },

    addTimesRendered: (element: HourWithActionsRef, hourKey: string): void => {
        set((prev) => {
            const timeRenderedPrev = prev.timesRendered;

            if (!timeRenderedPrev.get(hourKey)) {
                timeRenderedPrev.set(hourKey, element);
                return {
                    ...prev,
                    timeRenderedPrev,
                };
            }

            return {
                ...prev,
            };
        });
    },
});

export type DayAndWeekStore = ReturnType<typeof dayAndWeekStore>;
export default dayAndWeekStore;
