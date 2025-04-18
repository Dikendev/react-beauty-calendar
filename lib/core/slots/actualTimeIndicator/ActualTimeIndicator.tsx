import { useEffect, useMemo, useState } from "react";

import { useGlobalStore } from "../../../hooks";

import { cn } from "../../../lib/utils";
import { DateUtils } from "../../../utils/date-utils";

import { Separator } from "../../../components/ui/Separator";
import { BOOKING_VIEW_TYPE } from "../../../constants";
import type { BlocksTimeStructure } from "../EmptySlot";

import FirstDaySlot from "./FirstDaySlot";
import {
    TimeEquality,
    TimeIndicatorPosition,
} from "./position-based-on-seconds";

interface ActualTimerIndicatorProps {
    color?: string;
    isFirstDay: boolean;
    slotData: BlocksTimeStructure;
}

export const ActualTimerIndicator = ({
    color = "#000",
    isFirstDay,
    slotData,
}: ActualTimerIndicatorProps) => {
    const { timesRendered, bookingViewType } = useGlobalStore();

    const [dateToRender, setDateToRender] = useState<string>("");
    const [showTime, setShowTime] = useState<boolean>(false);
    const [renderTimeIndicator, setTimeIndicator] = useState<boolean>(false);

    const isToday = useMemo(() => {
        const now = new Date();
        const slotKey = new Date(slotData.key);

        return (
            slotKey.getDay() === now.getDay() &&
            slotKey.getDate() === now.getDate()
        );
    }, [slotData.key]);

    const updateDateToRender = (dateToRender: string) => {
        setDateToRender(dateToRender);
    };

    const showTimeInfo = (): void => {
        setShowTime(true);
    };

    const hideTimeInfo = (): void => {
        setShowTime(false);
    };

    const positionBasedOnSeconds = useMemo((): number => {
        const timeIndicatorPosition = new TimeIndicatorPosition();

        return timeIndicatorPosition.positionBasedOnSeconds(
            slotData.time,
            dateToRender,
            timesRendered,
        );
    }, [slotData.time, dateToRender, timesRendered]);

    const separatorContainer = useMemo((): string => {
        if (isFirstDay) {
            return bookingViewType === BOOKING_VIEW_TYPE.DAY ? "101%" : "100vw";
        }

        return bookingViewType === BOOKING_VIEW_TYPE.DAY ? "102%" : "104%";
    }, [isFirstDay, bookingViewType]);

    const conditionalStyle = useMemo(() => {
        if (isToday) {
            return {
                top: `${positionBasedOnSeconds - 2}px`,
                left: isFirstDay ? "-18px" : "-3px",
                width: isFirstDay ? "102%" : "104%",
            };
        }

        return {
            top: `${positionBasedOnSeconds - 1}px`,
            left: isFirstDay ? "-18px" : "-9px",
            width: separatorContainer,
        };
    }, [isToday, isFirstDay, separatorContainer, positionBasedOnSeconds]);

    useEffect(() => {
        const slotDataTime = slotData.time;
        const timeEquality = new TimeEquality();

        const toggleTimeIndicator = (): void => {
            const dateNow = new Date();

            const nowFullTime = timeEquality.normalizeDateNow(dateNow);
            const actualTime = DateUtils.dateAndHourDateToString(dateNow);

            if (dateToRender !== actualTime) updateDateToRender(actualTime);

            if (nowFullTime === slotDataTime) {
                setTimeIndicator(true);
            } else {
                setTimeIndicator(false);
            }
        };

        let intervalId: NodeJS.Timeout;

        if (!timeEquality.is15MinLess(slotDataTime)) {
            intervalId = setInterval(() => toggleTimeIndicator(), 1000);
        }

        return () => {
            return clearInterval(intervalId);
        };
    }, [slotData.time, dateToRender]);

    if (!renderTimeIndicator) return;

    return (
        <div
            style={{ ...conditionalStyle }}
            className={cn("timeIndicator_today", isToday && separatorContainer)}
            onMouseEnter={showTimeInfo}
            onMouseOut={hideTimeInfo}
            onBlur={() => {}}
        >
            <Separator
                style={{
                    height: isToday ? "4px" : "2px",
                    backgroundColor: color,
                }}
            />

            {isToday && isFirstDay && (
                <div className="today_first_day">
                    <Separator
                        orientation="vertical"
                        style={{
                            height: "11px",
                            backgroundColor: color,
                        }}
                    />
                </div>
            )}
            {showTime && (
                <FirstDaySlot
                    isFirstDay={isFirstDay}
                    dateToRender={dateToRender}
                />
            )}
        </div>
    );
};

export default ActualTimerIndicator;
