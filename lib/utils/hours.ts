import { eachHourOfInterval } from "date-fns";
import { DateUtils } from "./date-utils";

export type Times = string[];

const generateTimes = (start: number, end: number): Times => {
    const result = eachHourOfInterval({
        start: new Date(2014, 9, 6, start),
        end: new Date(2014, 9, 6, end),
    });

    const sort = result.sort((a, b) => {
        const horaA = new Date(a).getHours();
        const horaB = new Date(b).getHours();
        return horaA - horaB;
    });

    return Object.values(sort).map(
        (date) => `${String(date.getHours()).padStart(2, "0")}:00`,
    );
};

interface WorkingTimesSlots {
    time: string;
    available: boolean;
}

const generateWorkingTimes = (
    start: string,
    end: string,
    interval: number,
): WorkingTimesSlots[] => {
    const timesWithOriginal: WorkingTimesSlots[] = [];

    const startTime = new Date(`1970/01/01 ${start}`);
    const endTime = new Date(`1970/01/01 ${end}`);

    while (startTime <= endTime) {
        const formattedTime = DateUtils.dateTimeAsString(startTime);

        timesWithOriginal.push({
            time: formattedTime,
            available: true,
        });

        startTime.setMinutes(startTime.getMinutes() + interval);
    }

    return timesWithOriginal;
};

export { generateTimes, generateWorkingTimes };
