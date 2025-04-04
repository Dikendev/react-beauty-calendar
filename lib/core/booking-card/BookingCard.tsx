import type { Booking, BookingDateAndTime } from "../../@types/booking";
import { DateUtils } from "../../utils/date-utils";

import {
    type DragPendingEvent,
    useDndMonitor,
    useDraggable,
} from "@dnd-kit/core";
import { type CSSProperties, useCallback, useState } from "react";
import { BOOKING_VIEW_TYPE } from "../../constants";
import { useGlobalStore } from "../../hooks";
import { cn } from "../../lib/utils";
import CardOverlay from "../slots/CardOverlay";

interface BookingCardProps {
    booking: Booking;
    slotData: BookingDateAndTime;
    customClasses?: string | undefined;
    heightStyleTransformer?: string;
    onClick?: (() => void) | undefined;
}

const BookingCard = ({
    booking,
    slotData,
    onClick,
    heightStyleTransformer,
    customClasses,
}: BookingCardProps) => {
    const { day, hour } = slotData;
    const { bookingViewType } = useGlobalStore();

    const [isPending, setIsPending] = useState(false);
    const [pendingDelayMs, setPendingDelay] = useState(0);

    const { attributes, listeners, setNodeRef, isDragging, transform } =
        useDraggable({
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
        onDragPending: (event) => handlePending(event),
        onDragAbort: () => handlePendingEnd(),
        onDragCancel: () => handlePendingEnd(),
        onDragEnd: () => handlePendingEnd(),
    });

    const handlePending = useCallback((event: DragPendingEvent) => {
        if (event.id === booking.id) {
            setIsPending(true);
            const { constraint } = event;

            if ("delay" in constraint) {
                setPendingDelay(constraint.delay);
            }
        }
    }, []);

    const handlePendingEnd = useCallback(() => {
        setIsPending(false);
    }, []);

    const pendingStyle: React.CSSProperties = isPending
        ? { animationDuration: `${pendingDelayMs}ms` }
        : {};

    const isBelowMaxTimeLimit = (normalizedBookingDate: string): boolean => {
        return normalizedBookingDate <= "11:30";
    };

    const handleStyleCardContent: CSSProperties =
        bookingViewType === BOOKING_VIEW_TYPE.DAY
            ? { width: "99%" }
            : { width: "100%" };

    const cardContextStyle: CSSProperties = {
        height: heightStyleTransformer,
        position: "relative",
        zIndex: 50,
        ...pendingStyle,
        ...style,
        ...handleStyleCardContent,
    };

    const cardTodayCustomStyle = (booking: Booking, day: Date) => {
        const normalizedBookingDate = DateUtils.dateAndHourDateToString(
            new Date(booking.finishAt),
        );

        if (
            DateUtils.isTodayDate(day) &&
            isBelowMaxTimeLimit(normalizedBookingDate)
        ) {
            return {
                backgroundColor: "#000000c0",
            };
        }

        return { backgroundColor: "#000456c0" };
    };

    return (
        <>
            {!isDragging && (
                <div
                    key={booking.id}
                    ref={setNodeRef}
                    className={cn(
                        "cardContent_render",
                        customClasses,
                        isPending && "Draggable pendingDelay",
                    )}
                    style={{ ...style, ...cardContextStyle }}
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
                        onPointerUp={onClick}
                    >
                        <div
                            className={cn(
                                "flex flex-col h-full text-white pl-2 lg:pl-2 justify-start items-start",
                            )}
                        >
                            <p className="text-[0.8rem] h-[0.8rem]">
                                {`${DateUtils.dateAndHourDateToString(booking.startAt)} - ${DateUtils.dateAndHourDateToString(
                                    booking.finishAt,
                                )}`}
                            </p>
                            <span className="flex flex-row items-center justify-center" />
                        </div>
                    </div>
                </div>
            )}
            {isDragging && (
                <CardOverlay
                    bookingInit={booking}
                    slotData={slotData}
                    heightStyle={String(heightStyleTransformer)}
                />
            )}
        </>
    );
};

export default BookingCard;
