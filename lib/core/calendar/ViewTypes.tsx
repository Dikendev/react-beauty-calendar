import { useMemo } from "react";
import type { BookingViewType } from "../../@types/booking";
import { BOOKING_VIEW_TYPE } from "../../constants";

import CalendarView from "./CalendarView";

interface HandleViewTypeProps {
    bookingViewType: BookingViewType;
}

const HandleViewType = ({ bookingViewType }: HandleViewTypeProps) => {
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
