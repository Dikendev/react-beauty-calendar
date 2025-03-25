import type { StateCreator } from "zustand";
import type { HourWithActionsRef } from "../../../core/calendar/HourWithActions";
import { DateUtils } from "../../../utils/date-utils";
import { type Times, generateTimes } from "../../../utils/hours";

const START_TIME = "08:00";
const END_TIME = "23:30";
const INTERVAL = 60;

export interface NextAndPreviousWeek {
    firstDayOfWeek: Date;
    lastDayOfWeek: Date;
}

export interface DayAndWeekProps extends NextAndPreviousWeek {
    hours: Times;
    selectedDay: string | null;
    daysOfWeek: Date[];
    timesRendered: Map<string, HourWithActionsRef>;
}

export interface DayAndWeekState extends DayAndWeekProps {
    setTodayDay: (date: Date) => Date;
    setDays: (days: number) => Date[];
    todayWeek: (date?: Date) => NextAndPreviousWeek;
    getWeek: () => NextAndPreviousWeek;
    nextWeek: () => NextAndPreviousWeek;
    previousWeek: () => NextAndPreviousWeek;
    addTimesRendered: (element: HourWithActionsRef, hourKey: string) => void;
}

const initValuesWeek = DateUtils.generateWeekDays();

const dayAndWeekStore: StateCreator<DayAndWeekState> = (set, get) => ({
    hours: generateTimes(START_TIME, END_TIME, INTERVAL),
    selectedDay: null,
    daysOfWeek: initValuesWeek.week,
    firstDayOfWeek: initValuesWeek.firstDayOfWeek,
    lastDayOfWeek: initValuesWeek.lastDayOfWeek,
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

    todayWeek: (date?: Date): NextAndPreviousWeek => {
        let first: Date = new Date();
        let last: Date = new Date();

        set((prev) => {
            const validDate = validateDate(prev.selectedDay, date);

            const {
                week: daysOfWeek,
                firstDayOfWeek,
                lastDayOfWeek,
            } = DateUtils.generateWeekDays(validDate);

            first = firstDayOfWeek;
            last = lastDayOfWeek;

            return {
                ...prev,
                daysOfWeek,
                firstDayOfWeek,
                lastDayOfWeek,
            };
        });

        return {
            firstDayOfWeek: first,
            lastDayOfWeek: last,
        };
    },

    nextWeek: (): NextAndPreviousWeek => {
        const adding = DateUtils.addDay(get().lastDayOfWeek, 1);
        const {
            firstDayOfWeek,
            lastDayOfWeek,
            week: daysOfWeek,
        } = DateUtils.generateWeekDays(adding);

        set((prev) => ({
            ...prev,
            daysOfWeek,
            firstDayOfWeek,
            lastDayOfWeek,
        }));

        return { firstDayOfWeek, lastDayOfWeek };
    },

    previousWeek: (): NextAndPreviousWeek => {
        const minus = DateUtils.addDay(get().firstDayOfWeek, -1);
        const {
            firstDayOfWeek,
            lastDayOfWeek,
            week: daysOfWeek,
        } = DateUtils.generateWeekDays(minus);

        set((prev) => ({
            ...prev,
            daysOfWeek,
            firstDayOfWeek,
            lastDayOfWeek,
        }));

        return { firstDayOfWeek, lastDayOfWeek };
    },

    setDays: (days: number): Date[] => {
        const actualDay = get().daysOfWeek[0];

        if (!actualDay) return [];

        const day = DateUtils.generateDays(actualDay, days);

        set((prev) => ({
            ...prev,
            daysOfWeek: day,
            firstDayOfWeek: day[0],
            lastDayOfWeek: day[0],
        }));

        return day;
    },

    getWeek: (): NextAndPreviousWeek => {
        const firstDayOfWeek = get().firstDayOfWeek;
        const lastDayOfWeek = get().lastDayOfWeek;

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

const validateDate = (prevSelectedDay: string | null, date?: Date) => {
    if (!date) {
        return prevSelectedDay ? new Date(prevSelectedDay) : new Date();
    }
    return date;
};

export type DayAndWeekStore = ReturnType<typeof dayAndWeekStore>;
export default dayAndWeekStore;
