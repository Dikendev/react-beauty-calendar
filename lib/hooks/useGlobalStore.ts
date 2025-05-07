import { create } from "zustand";
import bookingInfoStore, {
    type BookingInfoState,
} from "../context/global/booking-info/booking-info";
import dayAndWeekStore, {
    type DayAndWeekState,
} from "../context/global/days-and-week/day-and-week-store";
import sliceGlobalStore, {
    type SliceGlobalState,
} from "../context/global/slice-global/slice-global-store";

const useGlobalStore = create<
    DayAndWeekState & BookingInfoState & SliceGlobalState
>()((...a) => ({
    ...dayAndWeekStore(...a),
    ...bookingInfoStore(...a),
    ...sliceGlobalStore(...a),
}));

export default useGlobalStore;
