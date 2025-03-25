import { BOOKING_VIEW_TYPE } from "../constants/booking-view-type.constant";
import MONTH from "../constants/month.constant";
import { DateUtils } from "../utils/date-utils";
import useGlobalStore from "./use-global-store";
import useMonthDescription from "./use-month-description";

const useDaysSelectedView = () => {
    const {
        setBookingViewType,
        todayWeek,
        setTodayDay,
        daysOfWeek,
        getWeek,
        selectedDay,
    } = useGlobalStore();

    const { updateMonthMessage } = useMonthDescription((state) => state);

    const onViewTypeChange = (option: string): void => {
        switch (option) {
            case BOOKING_VIEW_TYPE.DAY: {
                setBookingViewType(BOOKING_VIEW_TYPE.DAY);

                if (daysOfWeek.length === 1) {
                    const day = daysOfWeek[0];

                    if (day) {
                        setTodayDay(new Date(day));
                        updateDateInfo(new Date(day));
                        break;
                    }
                }

                if (selectedDay) {
                    // preciso arrumar essa funçao está errada
                    setTodayDay(new Date(selectedDay));
                    updateDateInfo(new Date(selectedDay));
                    break;
                }

                setTodayDay(new Date());
                updateDateInfo(new Date());
                break;
            }
            case BOOKING_VIEW_TYPE.WEEK: {
                setBookingViewType(BOOKING_VIEW_TYPE.WEEK);
                const day = daysOfWeek[0];

                todayWeek(day);

                const { lastDayOfWeek, firstDayOfWeek } = getWeek();

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
            case BOOKING_VIEW_TYPE.TABLE: {
                setBookingViewType(BOOKING_VIEW_TYPE.TABLE);
                if (daysOfWeek.length === 1) {
                    const day = daysOfWeek[0];

                    if (day) {
                        setTodayDay(new Date(day));
                        updateDateInfo(new Date(day));
                        break;
                    }
                }

                if (selectedDay) {
                    setTodayDay(new Date(selectedDay));
                    updateDateInfo(new Date(selectedDay));
                    break;
                }

                setTodayDay(new Date());
                updateDateInfo(new Date());
                break;
            }
        }
    };

    const updateDateInfo = (targetDate: Date): void => {
        updateMonthMessage({
            month: targetDate.getMonth(),
            fullYear: targetDate.getFullYear(),
            monthMessage: MONTH[targetDate.getMonth()],
        });
    };

    return { onViewTypeChange };
};

export default useDaysSelectedView;
