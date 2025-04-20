import { DateUtils } from "../../../utils/date-utils";

class TimeIndicatorPosition {
    positionBasedOnSeconds = (dateToRender: string): number => {
        const [, dateToRenderMinutes] = dateToRender.split(":");
        if (!dateToRender.length) return -3;
        const minutes = Number(dateToRenderMinutes);
        return this.normalizingMinutes(minutes);
    };

    normalizingMinutes = (minutes: number): number => {
        if (minutes >= 0 && minutes <= 15) return minutes * 2;
        if (minutes > 15 && minutes < 30) return (minutes - 15) * 2;
        if (minutes >= 30 && minutes <= 59) return minutes - 30;
        return -3;
    };

    isInitialMinute = (minutes: number): boolean => {
        return minutes >= 0 && minutes <= 8;
    };

    isSameHour = (dateToRenderHour: string, slotDataTime: string): boolean => {
        const slotDataHour = slotDataTime.split(":")[0];
        return slotDataHour === dateToRenderHour;
    };
}

class TimeEquality {
    is15MinLess = (slotDataTime: string) => {
        const actualTime = new Date();
        const [hour, minutes] = slotDataTime.split(":");
        const slotTimeNormalize = new Date(
            actualTime.getFullYear(),
            actualTime.getMonth(),
            actualTime.getDate(),
            Number(hour),
            Number(minutes),
            0,
        );

        const newActual = new Date(actualTime);
        const nowMinutes = DateUtils.roundMinutes(actualTime.getMinutes());
        newActual.setHours(actualTime.getHours(), nowMinutes, 0, 0);

        const minutesDiff = DateUtils.minuteDifference(
            slotTimeNormalize,
            newActual,
        );
        return minutesDiff > 30 || minutesDiff < -30;
    };

    normalizeDateNow = (dateNow: Date): string => {
        const nowHour = dateNow.getHours();
        const nowMinutes = DateUtils.roundMinutes(dateNow.getMinutes());

        const nowFullTime = `${nowHour.toString().padStart(2, "0")}:${nowMinutes
            .toString()
            .padStart(2, "0")}`;

        return nowFullTime;
    };
}

export { TimeIndicatorPosition, TimeEquality };
