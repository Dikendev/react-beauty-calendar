import { useEffect, useMemo } from "react";
import type { BookingViewType } from "../../@types/booking";
import { BOOKING_VIEW_TYPE } from "../../constants";

import useEmptySlotStore from "../../context/emptySlotsStore.ts/useEmptySlotStore";
import CalendarView from "./CalendarView";

interface HandleViewTypeProps {
    bookingViewType: BookingViewType;
}

const HandleViewType = ({ bookingViewType }: HandleViewTypeProps) => {
    const { resetSelectedNode, resetNodes } = useEmptySlotStore(
        (state) => state,
    );

    useEffect(() => {
        if (
            bookingViewType === BOOKING_VIEW_TYPE.DAY ||
            bookingViewType === BOOKING_VIEW_TYPE.WEEK
        ) {
            resetSelectedNode();
            resetNodes();
        }
    }, [bookingViewType, resetNodes, resetSelectedNode]);

    const render = useMemo(() => {
        switch (bookingViewType) {
            case BOOKING_VIEW_TYPE.DAY:
            case BOOKING_VIEW_TYPE.WEEK: {
                return <CalendarView />;
            }
            default:
                return null;
        }
    }, [bookingViewType]);

    return render;
};

export default HandleViewType;
