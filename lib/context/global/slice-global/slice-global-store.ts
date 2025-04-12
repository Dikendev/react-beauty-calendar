import type { StateCreator } from "zustand";
import { BOOKING_VIEW_TYPE } from "../../../constants";
import { DateUtils } from "../../../utils/date-utils";
import type { BookingInfoState } from "../booking-info/booking-info";
import type {
    DayAndWeekState,
    NextAndPreviousWeek,
} from "../days-and-week/day-and-week-store";

type SliceGlobalStore = DayAndWeekState & BookingInfoState;

export interface SliceGlobalState {
    setWeekAndViewType: (date?: Date) => NextAndPreviousWeek;
    setTodayDayAndViewType: (date: Date) => Date;
}

const sliceGlobalStore: StateCreator<
    SliceGlobalStore,
    [],
    [],
    SliceGlobalState
> = (_, get) => ({
    setWeekAndViewType: (date?: Date): NextAndPreviousWeek => {
        const todayWeek = get().todayWeek(date);
        get().setBookingViewType(BOOKING_VIEW_TYPE.WEEK);
        return DateUtils.firstAndLastWeekDays(todayWeek);
    },
    setTodayDayAndViewType: (date: Date): Date => {
        const todayDay = get().setTodayDay(date);
        get().setBookingViewType(BOOKING_VIEW_TYPE.DAY);
        return todayDay;
    },
});

export default sliceGlobalStore;
