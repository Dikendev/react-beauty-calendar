import { useEffect, useState } from "react";

import { useGlobalStore, useMonthDescription } from "../../hooks";
import useBookingModal from "../../hooks/useBookingModel";

import { DateUtils } from "../../utils/date-utils";

import { BOOKING_VIEW_TYPE } from "../../constants";
import useEmptySlotStore from "../../context/emptySlotsStore.ts/useEmptySlotStore";

import HeaderDayActions from "./HeaderDayActions";
import HeaderTodayAction from "./HeaderTodayAction";
import HeaderViewType from "./HeaderViewType";

export type ActionType = "next" | "previous";

interface ShortcutButtons {
    label: string;
    codeCommands: string;
    onClick: () => void;
}

export type ShortcutButtonsList = ShortcutButtons[];

const WINDOW_SIZE_LIMIT = 566;

const Header = () => {
    const {
        todayWeek,
        bookingViewType,
        setTodayDay,
        nextWeek,
        previousWeek,
        setDays,
    } = useGlobalStore();

    const { resetSelectedNode, resetNodes } = useEmptySlotStore(
        (state) => state,
    );

    const { onTodayClick } = useBookingModal();
    const { fullYear, monthMessage } = useMonthDescription((state) => state);
    const { onDayChange } = useBookingModal();

    const [mobileLayout, setMobileLayout] = useState<boolean>(false);

    const handleTodayClick = () => {
        const todayDate = new Date();
        onTodayClick(todayDate);

        switch (bookingViewType) {
            case BOOKING_VIEW_TYPE.TABLE:
            case BOOKING_VIEW_TYPE.DAY: {
                setTodayDay(todayDate);
                break;
            }
            default: {
                todayWeek();
                break;
            }
        }
    };

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

    const handleWeekChange = (actionType: ActionType) => {
        resetNodes();
        resetSelectedNode();

        switch (bookingViewType) {
            case BOOKING_VIEW_TYPE.TABLE:
            case BOOKING_VIEW_TYPE.DAY: {
                const dayInfo = setDayInfo(actionType);
                onDayChange(dayInfo, actionType);
                break;
            }
            case BOOKING_VIEW_TYPE.WEEK: {
                const week = weekAction(actionType);
                const { firstDayOfWeek, lastDayOfWeek } =
                    DateUtils.firstAndLastWeekDays(week);

                onDayChange([firstDayOfWeek, lastDayOfWeek], actionType);
                break;
            }
        }
    };

    useEffect(() => {
        todayWeek();
    }, [todayWeek]);

    useEffect(() => {
        const mobileLayout = () => {
            if (typeof window === "undefined") return false;

            window.innerWidth <= WINDOW_SIZE_LIMIT
                ? setMobileLayout(true)
                : setMobileLayout(false);
        };

        mobileLayout();
        window.addEventListener("resize", mobileLayout);
        return () => window.removeEventListener("resize", mobileLayout);
    }, []);

    const actions = (
        <div className="header_actions">
            <HeaderDayActions handleWeekChange={handleWeekChange} />
            <HeaderTodayAction onClick={handleTodayClick} />
        </div>
    );

    return (
        <>
            {mobileLayout ? (
                <div className="headerCalendar_mobile">
                    <div className="headerCalendar_mobile_month">
                        <span className="headerCalendar_mobile_month_span">
                            {monthMessage} {fullYear}
                        </span>
                    </div>

                    <div className="headerCalendar_mobile_actions">
                        {actions}
                        <HeaderViewType />
                    </div>
                </div>
            ) : (
                <div className="headerCalendar">
                    <div className="headerCalendar_actions">{actions}</div>

                    <div className="headerCalendar_month">
                        <span className="headerCalendar_month_span">
                            {monthMessage} {fullYear}
                        </span>
                    </div>

                    <HeaderViewType />
                </div>
            )}
        </>
    );
};

export default Header;
