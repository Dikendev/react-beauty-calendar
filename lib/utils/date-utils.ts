import { differenceInMinutes, subMinutes } from "date-fns";
import dayjs from "dayjs";
import { MONTH } from "../constants";

export const WEEK_DAYS = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
] as const;

type WeekDays = (typeof WEEK_DAYS)[number];

export const WEEK_DAYS_FULL_NAME = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
] as const;

export type DatesData = {
    week: Date[];
    firstDayOfWeek: Date;
    lastDayOfWeek: Date;
};

export const DateUtils = {
    findIndexToStart(date: Date = new Date()): number {
        const actualDay = WEEK_DAYS[date.getDay()];
        return this.findActualDayIndex(actualDay);
    },

    findActualDayIndex(today: WeekDays): number {
        const todayIndex = WEEK_DAYS.indexOf(today);
        return todayIndex;
    },

    generateWeekDays(newDate?: Date): DatesData {
        const indexToStart = this.findIndexToStart(newDate);

        const weekDaysArray = new Array(7).fill(0);

        let firstDayOfWeek = new Date();
        let lastDayOfWeek = new Date();

        const result = weekDaysArray.map((_, index) => {
            const today = newDate ? newDate : new Date();

            const diffIndex = index - indexToStart;
            const currentDate = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() + diffIndex,
            );

            if (index === 0) {
                firstDayOfWeek = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    currentDate.getDate(),
                );
            }

            if (index === weekDaysArray.length - 1) {
                lastDayOfWeek = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    currentDate.getDate(),
                );
            }

            return currentDate;
        });

        return {
            week: result,
            firstDayOfWeek,
            lastDayOfWeek,
        };
    },

    generateDays(date: Date, daysForwardOrBack: number): Date[] {
        const weekDaysMap: Date[] = [];

        const dateFormatted = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() + daysForwardOrBack,
        );

        weekDaysMap.push(dateFormatted);
        return weekDaysMap;
    },

    addDay(currentDate: Date, numberOfDays: number): Date {
        return new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() + numberOfDays,
        );
    },

    formatDate(time: string): string {
        const timeArray = time.split(" ");
        const filtered = timeArray.slice(2, 3);
        return filtered.join(",").replace(",", " | ");
    },

    dateTimeAsString(date: Date): string {
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
    },

    minuteDifference(date1: Date, date2: Date): number {
        return differenceInMinutes(date1, date2);
    },

    dateAndHourDateToString(date: Date): string {
        const asDate = new Date(date);

        return `${asDate.getHours().toString().padStart(2, "0")}:${asDate
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;
    },

    shortMonthDescription(...month: Date[]): string {
        return `${MONTH[month[0].getMonth()].slice(0, 3)} - ${MONTH[
            month[1].getMonth()
        ].slice(0, 3)}`;
    },

    timeDiffInSeconds(startAt: Date, finishAt: Date): number {
        const startAtDate = dayjs(startAt);
        const finishAtDate = dayjs(finishAt);
        return startAtDate.diff(finishAtDate) / 60000;
    },

    subtractMinutes(startAt: Date, amount: number): Date {
        return subMinutes(startAt, amount);
    },

    addMinuteToHour(hour: string, minutes: number): string {
        const hourSplit = hour.split(":")[0];
        return `${hourSplit}:${minutes}`;
    },

    dateToString(date: Date): string {
        return new Date(date).toTimeString();
    },

    dateToStringSelected(date: Date): string {
        return new Date(date).toDateString();
    },

    roundMinutes(minutes: number): number {
        if (minutes >= 15 && minutes < 30) return 15;
        if (minutes >= 30 && minutes < 45) return 30;
        if (minutes >= 45 && minutes < 60) return 45;
        return 0;
    },

    hourMinutesStringToDate(hourMinutes: string): Date {
        const asDate = new Date();
        const [hour, minutes] = hourMinutes.split(":");
        asDate.setHours(Number(hour), Number(minutes));
        return asDate;
    },

    addMinutesToDate(targetDate: Date, minutes: number): Date {
        const target = new Date(targetDate);
        target.setHours(
            target.getHours(),
            target.getMinutes() + minutes,
            target.getMinutes(),
        );
        return target;
    },

    newDateKey(date: string, hour: string): string {
        const newDate = new Date(date);
        newDate.setHours(Number(hour.split(":")[0]));
        newDate.setMinutes(Number(hour.split(":")[1]));
        return newDate.toISOString();
    },

    addMinutesToHour(startAt: string, interval: number): string {
        const newFinishDate = DateUtils.hourMinutesStringToDate(startAt);
        const addingMinutes = DateUtils.addMinutesToDate(
            newFinishDate,
            interval,
        );
        return DateUtils.dateAndHourDateToString(addingMinutes);
    },

    // timeString example: "12:00"
    convertStringTimeToDateFormat(timeString: string): Date {
        const asDateFormat = new Date();
        const [hour, minutes] = timeString.split(":");
        asDateFormat.setHours(Number(hour), Number(minutes), 0, 0);
        return asDateFormat;
    },

    isTodayDate(date: Date): boolean {
        const today = new Date();
        const isSameDate = date.getDate() === today.getDate();
        const isSameMonth = date.getMonth() === today.getMonth();
        const isSameYear = date.getFullYear() === today.getFullYear();
        return isSameDate && isSameMonth && isSameYear;
    },
};
