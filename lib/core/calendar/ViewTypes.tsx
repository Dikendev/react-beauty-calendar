import { type PropsWithChildren, useEffect } from "react";
import { BOOKING_VIEW_TYPE } from "../../constants";

import useEmptySlotStore from "../../context/emptySlotsStore/useEmptySlotStore";
import { useGlobalStore } from "../../hooks";

type HandleViewTypePropsWithChildren = PropsWithChildren;

const HandleViewType = ({ children }: HandleViewTypePropsWithChildren) => {
    const { resetSelectedNode, resetNodes } = useEmptySlotStore(
        (state) => state,
    );

    const bookingViewType = useGlobalStore((state) => state.bookingViewType);

    useEffect(() => {
        if (
            bookingViewType === BOOKING_VIEW_TYPE.DAY ||
            bookingViewType === BOOKING_VIEW_TYPE.WEEK
        ) {
            resetSelectedNode();
            resetNodes();
        }
    }, [bookingViewType, resetNodes, resetSelectedNode]);

    switch (bookingViewType) {
        case BOOKING_VIEW_TYPE.DAY:
        case BOOKING_VIEW_TYPE.WEEK: {
            return children;
        }
        default:
            return null;
    }
};

export default HandleViewType;
