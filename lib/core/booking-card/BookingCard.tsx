import {
    type CSSProperties,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useState,
} from "react";

import type { Booking } from "../../@types/booking";
import { cn } from "../../lib/utils";
import { dateUtils } from "../../utils/date.utils";

import { useDndMonitor, useDraggable } from "@dnd-kit/core";
import { useShallow } from "zustand/shallow";
import { BOOKING_VIEW_TYPE } from "../../constants";

import useDragStore from "../../context/drag/dragStore";
import useDragStartAtStore from "../../context/drag/useDragStateAtStore";

import { useGlobalStore } from "../../hooks";
import type { BookingCardProps } from "../../utils/props";

import CardOverlay from "../slots/CardOverlay";

// const WIDTH_DECREMENT_STEP = 4;
// const MAX_WIDTH_PERCENTAGE = 100;

const BookingCard = ({
    booking,
    slotData,
    // layerCount,
    // half,
    events,
    heightStyle,
    customClasses,
    hoveringAdditionalCardId = "",
    ref,
}: BookingCardProps) => {
    const { day, hour } = slotData;
    const [isResizingCard, setIsResizingCard] = useState<boolean>(false);

    const bookingViewType = useGlobalStore(
        useShallow((state) => state.bookingViewType),
    );

    const { updateIsDragging, isDragging } = useDragStore((state) => state);

    const dragStartAt = useDragStartAtStore((state) => state.startAt);

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
    });

    const style = transform
        ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
          }
        : undefined;

    useDndMonitor({
        onDragStart: () => updateIsDragging(true),
        onDragAbort: () => handlePendingEnd(),
        onDragCancel: () => handlePendingEnd(),
        onDragEnd: () => handlePendingEnd(),
    });

    const handlePendingEnd = useCallback(() => {
        updateIsDragging(false);
    }, []);

    const isBelowMaxTimeLimit = (normalizedBookingDate: string): boolean => {
        return normalizedBookingDate <= "11:30";
    };

    const cardContextStyle: CSSProperties = useMemo(() => {
        return {
            cursor: isDragging ? "ns-resize" : "pointer",
            width: bookingViewType === BOOKING_VIEW_TYPE.DAY ? "99%" : "100%",
        };
    }, [isDragging, bookingViewType]);

    const cardTodayCustomStyle = (booking: Booking, day: Date) => {
        const normalizedBookingDate = dateUtils.dateAndHourDateToString(
            new Date(booking.finishAt),
        );

        if (
            dateUtils.isTodayDate(day) &&
            isBelowMaxTimeLimit(normalizedBookingDate)
        ) {
            return {
                backgroundColor: "#000000c0",
            };
        }

        return { backgroundColor: "#000456c0" };
    };

    const [prevBooking, setPrevBooking] = useState<Booking>(booking);

    useEffect(() => {
        if (dragStartAt.length) {
            const result = dateUtils.bookingTimeRange(booking, dragStartAt);
            setPrevBooking({
                ...result,
            });
        }
    }, [dragStartAt]);

    useImperativeHandle(ref, () => ({
        changeCurrentCardResize: () => setIsResizingCard((prev) => !prev),
    }));

    const isHovering = (id: string, targetId: string): boolean => {
        if (!hoveringAdditionalCardId?.length) return false;
        return id === targetId;
    };

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
                    // width: calculateCardWidth,
                }}
                {...listeners}
                {...attributes}
            >
                <div
                    className="relative w-full h-full"
                    key={`${day}-${hour}`}
                    style={cardTodayCustomStyle(
                        booking,
                        new Date(day.split(":")[1]),
                    )}
                    onPointerUp={events?.onClick}
                >
                    <div
                        className={cn(
                            "flex flex-col h-full text-white pl-2 lg:pl-2 justify-start items-start",
                        )}
                    >
                        <p style={{ height: "1.8rem", alignContent: "center" }}>
                            {`${dateUtils.dateAndHourDateToString(booking.startAt)} - ${dateUtils.dateAndHourDateToString(
                                booking.finishAt,
                            )}`}
                        </p>
                        <span className="flex flex-row items-center justify-center" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <CardOverlay
            bookingInit={prevBooking}
            slotData={slotData}
            heightStyle={heightStyle}
        />
    );
};

export default BookingCard;
