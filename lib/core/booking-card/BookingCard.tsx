import {
    type CSSProperties,
    type PropsWithChildren,
    useCallback,
    useImperativeHandle,
    useMemo,
    useState,
} from "react";

import { cn } from "../../lib/utils";

import { useDndMonitor, useDraggable } from "@dnd-kit/core";
import { useShallow } from "zustand/shallow";
import { BOOKING_VIEW_TYPE } from "../../constants";

import useDragStore from "../../context/drag/dragStore";

import { useGlobalStore } from "../../hooks";
import type { BookingCardProps } from "../../utils/props";

// const WIDTH_DECREMENT_STEP = 4;
// const MAX_WIDTH_PERCENTAGE = 100;

const BookingCard = ({
    booking,
    slotData,
    // layerCount,
    // half,
    customClasses,
    hoveringAdditionalCardId = "",
    children,
    ref,
}: PropsWithChildren<BookingCardProps>) => {
    const [isResizingCard, setIsResizingCard] = useState<boolean>(false);

    const bookingViewType = useGlobalStore(
        useShallow((state) => state.bookingViewType),
    );

    const { updateIsDragging, isDragging } = useDragStore((state) => state);

    const {
        attributes,
        listeners,
        setNodeRef,
        isDragging: isResizing,
        transform,
    } = useDraggable({
        id: booking.id,
        data: {
            type: "booking-slots",
            booking: booking,
            slotData,
        },
        disabled:
            booking.disabledResize === "full" ||
            booking.disabledResize === "half" ||
            booking.startAt.getDate() !== booking.finishAt.getDate(),
    });

    const style = transform
        ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
          }
        : undefined;

    useDndMonitor({
        onDragStart: () => startDraggingState(),
        onDragAbort: () => handlePendingEnd(),
        onDragCancel: () => handlePendingEnd(),
        onDragEnd: () => handlePendingEnd(),
    });

    const startDraggingState = useCallback(() => {
        updateIsDragging(true);
    }, []);

    const handlePendingEnd = useCallback(() => {
        updateIsDragging(false);
    }, []);

    const cardContextStyle: CSSProperties = useMemo(() => {
        return {
            cursor: isDragging ? "ns-resize" : "pointer",
            width: bookingViewType === BOOKING_VIEW_TYPE.DAY ? "99%" : "100%",
        };
    }, [isDragging, bookingViewType]);

    const isHovering = (id: string, targetId: string): boolean => {
        if (!hoveringAdditionalCardId?.length) return false;
        return id === targetId;
    };

    useImperativeHandle(ref, () => ({
        changeCurrentCardResize: () => setIsResizingCard((prev) => !prev),
    }));

    if (!isResizing) {
        return (
            <div
                key={booking.id}
                ref={setNodeRef}
                className={cn(
                    "cardContent_render",
                    (isResizingCard ||
                        isHovering(hoveringAdditionalCardId, booking.id)) &&
                        "cardContent_render_dragging",
                    customClasses,
                )}
                style={{
                    ...style,
                    ...cardContextStyle,
                }}
                {...listeners}
                {...attributes}
            >
                {children}
            </div>
        );
    }
};

export default BookingCard;
