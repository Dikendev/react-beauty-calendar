import {
    type CSSProperties,
    type Ref,
    useCallback,
    useEffect,
    useImperativeHandle,
    useState,
} from "react";

import type { Booking, BookingDateAndTime } from "../../@types/booking";
import { cn } from "../../lib/utils";
import { DateUtils } from "../../utils/date-utils";

import { useDndMonitor, useDraggable } from "@dnd-kit/core";
import { useShallow } from "zustand/shallow";
import { BOOKING_VIEW_TYPE } from "../../constants";
import useDragStore from "../../context/drag/dragStore";
import useDragStartAtStore from "../../context/drag/useDragStateAtStore";
import { useGlobalStore } from "../../hooks";
import CardOverlay from "../slots/CardOverlay";

export interface BookingCardRef {
    changeCurrentCardResize: () => void;
}

interface BookingCardProps {
    booking: Booking;
    slotData: BookingDateAndTime;
    customClasses?: string;
    heightStyleTransformer?: string;
    layerCount?: number;
    half?: boolean;
    onClick?: () => void;
    ref?: Ref<BookingCardRef>;
}

// const WIDTH_DECREMENT_STEP = 4;
// const MAX_WIDTH_PERCENTAGE = 100;

const BookingCard = ({
    booking,
    slotData,
    // layerCount,
    // half,
    onClick,
    heightStyleTransformer,
    customClasses,
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

    const handleStyleCardContent: CSSProperties =
        bookingViewType === BOOKING_VIEW_TYPE.DAY
            ? { width: "99%" }
            : { width: "100%" };

    const cardContextStyle: CSSProperties = {
        height: heightStyleTransformer,
        position: "relative",
        zIndex: 100,
        cursor: isDragging ? "ns-resize" : "pointer",
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

    // const calculateCardWidth = useMemo(() => {
    //     if (!layerCount) return `${MAX_WIDTH_PERCENTAGE}%`;
    //     const widthReduction = layerCount * WIDTH_DECREMENT_STEP;

    //     return `${MAX_WIDTH_PERCENTAGE - widthReduction}%`;
    // }, [layerCount]);
    const getTimeDiff = (startTime: Date, endTime: Date) => {
        const diffInMs =
            Number(new Date(endTime)) - Number(new Date(startTime));
        const diffInMinutes = Math.floor(diffInMs / 1000 / 60);

        const hours = Math.floor(diffInMinutes / 60);
        const minutes = diffInMinutes % 60;
        return `${hours}:${minutes.toString().padStart(2, "0")}`;
    };

    const newFinishAt = (newStartAt: string, timeString: string) => {
        const newDay = new Date(newStartAt);

        const splitTimeString = timeString.split(":");
        const hour = Number(splitTimeString[0]);
        const minutes = Number(splitTimeString[1]);

        newDay.setHours(newDay.getHours() + hour);
        newDay.setMinutes(newDay.getMinutes() + minutes);
        return newDay;
    };

    const bookingTimeRange = (booking: Booking, overId: string): Booking => {
        const newStartAt = new Date(overId);
        const timeDiff = getTimeDiff(booking.startAt, booking.finishAt);
        const newFinishDate = newFinishAt(overId, timeDiff);

        return {
            id: booking.id,
            startAt: newStartAt,
            finishAt: newFinishDate,
        };
    };

    const [prevBooking, setPrevBooking] = useState<Booking>(booking);

    useEffect(() => {
        if (dragStartAt.length) {
            const result = bookingTimeRange(booking, dragStartAt);
            setPrevBooking({
                ...result,
            });
        }
    }, [dragStartAt]);

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
                    isResizingCard && "cardContent_render_dragging",
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
        );
    }

    return (
        <CardOverlay
            bookingInit={prevBooking}
            slotData={slotData}
            heightStyle={String(heightStyleTransformer)}
        />
    );
};

export default BookingCard;
