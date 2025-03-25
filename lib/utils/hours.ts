import { DateUtils } from "./date-utils";

export type Times = string[];

const generateTimes = (start: string, end: string, interval: number): Times => {
    const times: string[] = [];
    const startTime = new Date(`1970/01/01 ${start}`);
    const endTime = new Date(`1970/01/01 ${end}`);

    while (startTime < endTime) {
        const formattedTime = DateUtils.dateTimeAsString(startTime);
        startTime.setMinutes(startTime.getMinutes() + interval);
        times.push(formattedTime);
    }

    return times;
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
