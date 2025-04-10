import { useEffect, useMemo, useState } from "react";

import { useGlobalStore } from "../../../hooks";

import { cn } from "../../../lib/utils";
import { DateUtils } from "../../../utils/date-utils";

import { Separator } from "../../../components/ui/Separator";
import { BOOKING_VIEW_TYPE } from "../../../constants";
import type { BlocksTimeStructure } from "../EmptySlot";
import {
    TimeEquality,
    TimeIndicatorPosition,
} from "./position-based-on-seconds";

interface ActualTimerIndicatorProps {
    tailwindColor: string;
    isFirstDay: boolean;
    slotData: BlocksTimeStructure;
}

export const ActualTimerIndicator = ({
    tailwindColor,
    isFirstDay,
    slotData,
}: ActualTimerIndicatorProps) => {
    const { timesRendered, bookingViewType } = useGlobalStore();

    const [renderTimeIndicator, setTimeIndicator] = useState<boolean>(false);
    const [dateToRender, setDateToRender] = useState<string>("");

    const isToday = useMemo(() => {
        const today = new Date();
        const day = today.getDay();
        const slotDay = new Date(slotData.key).getDay();
        return slotDay === day;
    }, [slotData.key]);

    useEffect(() => {
        const slotDataTime = slotData.time;
        const timeEquality = new TimeEquality();

        const toggleTimeIndicator = (): void => {
            const dateNow = new Date();

            const nowFullTime = timeEquality.normalizeDateNow(dateNow);
            const actualTime = DateUtils.dateAndHourDateToString(dateNow);

            setDateToRender(actualTime);

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
    }, [slotData.time]);

    const positionBasedOnSeconds = useMemo((): number => {
        const timeIndicatorPosition = new TimeIndicatorPosition();

        return timeIndicatorPosition.positionBasedOnSeconds(
            slotData.time,
            dateToRender,
            timesRendered,
        );
    }, [slotData.time, dateToRender, timesRendered]);

    const separatorContainer = useMemo((): string => {
        if (isFirstDay)
            return bookingViewType === BOOKING_VIEW_TYPE.DAY
                ? "w-[101%]"
                : "w-[100vw]";

        return bookingViewType === BOOKING_VIEW_TYPE.DAY
            ? "w-[102%]"
            : "w-[104%]";
    }, [isFirstDay, bookingViewType]);

    if (!renderTimeIndicator) return;

    const todayStyle = "left-[-18px] w-[102%]";
    const notTodayStyle = "w-[104%] left-[-3px]";
    const firstDaySeparator = "left-[-18px]";

    return (
        <>
            {isToday ? (
                <div
                    style={{
                        top: `${positionBasedOnSeconds - 2}px`,
                    }}
                    className={cn(
                        "absolute right-0 z-100",
                        isFirstDay ? todayStyle : notTodayStyle,
                        separatorContainer,
                    )}
                >
                    <div className="relative">
                        <Separator
                            style={{ height: "4px" }}
                            className={tailwindColor}
                        />

                        {isFirstDay && (
                            <div className="absolute left-0 top-[-3px] cursor-pointer">
                                <Separator
                                    orientation="vertical"
                                    style={{ height: "11px" }}
                                    className={tailwindColor}
                                />
                            </div>
                        )}

                        <FirstDaySlot
                            isRendered={isFirstDay}
                            dateToRender={dateToRender}
                        />
                    </div>
                </div>
            ) : (
                <div
                    style={{
                        top: `${positionBasedOnSeconds - 1}px`,
                    }}
                    className={cn(
                        "absolute right-0 z-100",
                        isFirstDay ? firstDaySeparator : "left-[-9px]",
                        separatorContainer,
                    )}
                >
                    <Separator
                        style={{
                            height: "2px",
                        }}
                        className={tailwindColor}
                    />

                    <FirstDaySlot
                        isRendered={isFirstDay}
                        dateToRender={dateToRender}
                    />
                </div>
            )}
        </>
    );
};

interface FirstDaySlotProps {
    isRendered: boolean;
    dateToRender: string;
}

const FirstDaySlot = ({ isRendered, dateToRender }: FirstDaySlotProps) => {
    const constraintToRenderTime = isRendered && dateToRender;

    return (
        <>
            {constraintToRenderTime && (
                <div className="absolute left-[-42px] top-[-8px] z-50">
                    <span>
                        <strong>{dateToRender}</strong>
                    </span>
                </div>
            )}
        </>
    );
};

export default ActualTimerIndicator;
