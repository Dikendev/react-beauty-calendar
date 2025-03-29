import { useEffect, useState } from "react";

import {
    ChevronLeftIcon,
    ChevronRightIcon,
    SquareMousePointer,
} from "lucide-react";

import { useGlobalStore, useMonthDescription } from "../../hooks";
import { DateUtils } from "../../utils/date-utils";

import { Button } from "../../components/ui/Button";
import { BOOKING_VIEW_TYPE, MONTH } from "../../constants";
import useEmptySlotStore from "../../context/emptySlotsStore.ts/useEmptySlotStore";
import type { MonthDescriptionProps } from "../../context/month-description/month-description-store";
import useBookingModal from "../../hooks/use-booking-model";
import HeaderViewType from "./HeaderViewType";

export type ActionType = "next" | "previous";

interface ShortcutButtons {
    label: string;
    codeCommands: string;
    onClick: () => void;
}

export type ShortcutButtonsList = ShortcutButtons[];
const WINDOW_SIZE_LIMIT = 450;

const Header = () => {
    const { todayWeek } = useGlobalStore();

    const { fullYear, monthMessage, updateMonthMessage } = useMonthDescription(
        (state) => state,
    );

    const [mobileLayout, setMobileLayout] = useState<boolean>(false);

    const updateDateInfo = (targetDate: Date): void => {
        updateMonthMessage({
            month: targetDate.getMonth(),
            fullYear: targetDate.getFullYear(),
            monthMessage: MONTH[targetDate.getMonth()],
        });
    };

    useEffect(() => {
        const { lastDayOfWeek, firstDayOfWeek } = todayWeek();
        const firstDayOfWeekMonth = firstDayOfWeek.getMonth();

        const initialMessage =
            firstDayOfWeekMonth !== lastDayOfWeek.getMonth()
                ? DateUtils.shortMonthDescription(firstDayOfWeek, lastDayOfWeek)
                : MONTH[firstDayOfWeekMonth];

        updateMonthMessage({ monthMessage: initialMessage });
    }, [todayWeek, updateMonthMessage]);

    useEffect(() => {
        const mobileLayout = () => {
            if (typeof window === "undefined") return false;

            if (window.innerWidth <= WINDOW_SIZE_LIMIT) {
                setMobileLayout(true);
            } else {
                setMobileLayout(false);
            }
        };

        mobileLayout();
        window.addEventListener("resize", mobileLayout);
        return () => window.removeEventListener("resize", mobileLayout);
    }, []);

    const actions = (
        <>
            <HeaderDayActions
                updateMonthMessage={updateMonthMessage}
                updateDateInfo={updateDateInfo}
            />
            <HeaderTodayAction
                updateMonthMessage={updateMonthMessage}
                updateDateInfo={updateDateInfo}
                mobileLayout={mobileLayout}
            />
        </>
    );

    return (
        <>
            {mobileLayout ? (
                <div className="w-full flex flex-col justify-between pt-[0.5rem] bg-white">
                    <div className="content-center z-50">
                        <span className="text-gray-800 font-bold">
                            {monthMessage} {fullYear}
                        </span>
                    </div>

                    <div className="gap-2 z-50 flex flex-row justify-between items-center">
                        {actions}
                        <HeaderViewType />
                    </div>
                </div>
            ) : (
                <div className="w-full flex justify-between pt-[0.5rem] px-3 bg-white">
                    <div className="gap-2 z-50 flex flex-row items-center">
                        {actions}
                    </div>

                    <div className="content-center z-50">
                        <span className=" text-gray-800 font-bold">
                            {monthMessage} {fullYear}
                        </span>
                    </div>

                    <HeaderViewType />
                </div>
            )}
        </>
    );
};

interface HeaderDayActionsProps {
    updateMonthMessage: (
        monthDescriptionProps: Partial<MonthDescriptionProps>,
    ) => void;
    updateDateInfo: (targetDate: Date) => void;
}

const HeaderDayActions = ({
    updateMonthMessage,
    updateDateInfo,
}: HeaderDayActionsProps) => {
    const { nextWeek, previousWeek, bookingViewType, setDays } =
        useGlobalStore();

    const resetSelectedNode = useEmptySlotStore(
        (state) => state.resetSelectedNode,
    );

    const resetNodes = useEmptySlotStore((state) => state.resetNodes);

    const { onDayChange } = useBookingModal();

    const nextDay = (): Date[] => {
        return setDays(1);
    };

    const previousDay = (): Date[] => {
        return setDays(-1);
    };

    const weekAction = (actionType: ActionType) => {
        return actionType === "next" ? nextWeek() : previousWeek();
    };

    const setDayInfo = (actionType: ActionType) => {
        return actionType === "next" ? nextDay() : previousDay();
    };

    const updateMonthMessages = (...targetDate: Date[]) => {
        const monthDescription = DateUtils.shortMonthDescription(
            targetDate[0],
            targetDate[1],
        );
        updateMonthMessage({ monthMessage: monthDescription });
    };

    const updatingDateInfoAfterActions = (day: Date[]): void => {
        if (day.length) updateDateInfo(day[0]);
    };

    const manageDateAndViewMessages = (
        firstDayOfWeek: Date,
        lastDayOfWeek: Date,
    ) => {
        const monthInitial = firstDayOfWeek.getMonth();
        const monthFinal = lastDayOfWeek.getMonth();

        updateDateInfo(lastDayOfWeek);

        if (monthInitial !== monthFinal) {
            return updateMonthMessages(firstDayOfWeek, lastDayOfWeek);
        }
    };

    const handleWeekChange = (actionType: ActionType) => {
        resetNodes();
        resetSelectedNode();

        switch (bookingViewType) {
            case BOOKING_VIEW_TYPE.TABLE:
            case BOOKING_VIEW_TYPE.DAY: {
                const dayInfo = setDayInfo(actionType);

                onDayChange(dayInfo, actionType);
                updatingDateInfoAfterActions(dayInfo);
                break;
            }
            case BOOKING_VIEW_TYPE.WEEK: {
                const { firstDayOfWeek, lastDayOfWeek } =
                    weekAction(actionType);

                onDayChange([firstDayOfWeek, lastDayOfWeek], actionType);

                manageDateAndViewMessages(firstDayOfWeek, lastDayOfWeek);
                break;
            }
        }
    };

    return (
        <div className="flex flex-row justify-center">
            <Button
                className="bg-white hover:bg-gray-100 border-none rounded-full py-3 px-3 flex focus:bg-gray-200 focus:outline-0 "
                variant="ghost"
                size="lg"
                onClick={() => handleWeekChange("previous")}
            >
                <ChevronLeftIcon className="h-4 w-4 text-gray-500" />
            </Button>
            <Button
                className="bg-white hover:bg-gray-100 border-none rounded-full py-3 px-3 flex text-gray-500 target:border-none focus:bg-gray-200 focus:outline-0"
                variant="ghost"
                size="lg"
                onClick={() => handleWeekChange("next")}
            >
                <ChevronRightIcon className="h-4 w-4 text-gray-500" />
            </Button>
        </div>
    );
};

interface HeaderTodayActionProps {
    updateMonthMessage: (
        monthDescriptionProps: Partial<MonthDescriptionProps>,
    ) => void;
    updateDateInfo: (targetDate: Date) => void;
    mobileLayout: boolean;
}

const HeaderTodayAction = ({
    updateMonthMessage,
    updateDateInfo,
    mobileLayout,
}: HeaderTodayActionProps) => {
    const { todayWeek, bookingViewType, setTodayDay } = useGlobalStore();
    const { onTodayClick } = useBookingModal();

    const todayDay = () => {
        const todayDate = new Date();
        onTodayClick(todayDate);

        switch (bookingViewType) {
            case BOOKING_VIEW_TYPE.TABLE:
            case BOOKING_VIEW_TYPE.DAY: {
                setTodayDay(todayDate);
                updateDateInfo(todayDate);
                break;
            }
            default: {
                const { lastDayOfWeek, firstDayOfWeek } = todayWeek();
                const firstDayOfWeekMonth = firstDayOfWeek.getMonth();
                const initialMessage =
                    firstDayOfWeekMonth !== lastDayOfWeek.getMonth()
                        ? DateUtils.shortMonthDescription(
                              firstDayOfWeek,
                              lastDayOfWeek,
                          )
                        : MONTH[firstDayOfWeekMonth];

                updateMonthMessage({
                    monthMessage: initialMessage,
                });
                break;
            }
        }
    };

    return (
        <Button variant={mobileLayout ? "ghost" : "outline"} onClick={todayDay}>
            <SquareMousePointer />
            {!mobileLayout && "Today"}
        </Button>
    );
};

export default Header;
