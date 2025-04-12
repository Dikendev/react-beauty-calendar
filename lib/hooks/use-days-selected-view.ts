import { BOOKING_VIEW_TYPE } from "../constants/booking-view-type.constant";
import useGlobalStore from "./use-global-store";

const useDaysSelectedView = () => {
    const { setBookingViewType, todayWeek, setTodayDay, daysOfWeek, getWeek } =
        useGlobalStore();

    const onViewTypeChange = (option: string): void => {
        switch (option) {
            case BOOKING_VIEW_TYPE.DAY: {
                setBookingViewType(BOOKING_VIEW_TYPE.DAY);
                setTodayDay(daysOfWeek[0]);
                break;
            }
            case BOOKING_VIEW_TYPE.WEEK: {
                setBookingViewType(BOOKING_VIEW_TYPE.WEEK);
                todayWeek(getWeek().firstDayOfWeek);
                break;
            }
            case BOOKING_VIEW_TYPE.TABLE: {
                setBookingViewType(BOOKING_VIEW_TYPE.TABLE);
                setTodayDay(getWeek().firstDayOfWeek);
                break;
            }
        }
    };

    return { onViewTypeChange };
};

export default useDaysSelectedView;
