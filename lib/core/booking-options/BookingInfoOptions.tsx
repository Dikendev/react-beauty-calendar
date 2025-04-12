import { type PropsWithChildren, useMemo, useState } from "react";

import { DndContext, useDndMonitor } from "@dnd-kit/core";

import type { Booking } from "../../@types/booking";

import { DateUtils, WEEK_DAYS_FULL_NAME } from "../../utils/date-utils";

import useDragStore from "../../context/drag/dragStore";

import {
    Popover,
    PopoverAnchor,
    PopoverTrigger,
} from "../../components/ui/Popover";

import type { Transform } from "@dnd-kit/utilities";
import { MONTH, type SIDE_OPTIONS } from "../../constants";
import BookingInfoContext from "./BookingInfoContent";

interface BookingInfoOptionsProps {
    side: Side;
    booking: Booking;
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
    isEditingOpen: boolean;
}

export type Side = (typeof SIDE_OPTIONS)[number];

export interface CardInfoOptions {
    text: string;
    onClick: () => void;
}

type BookingInfoOptionsWithChildren =
    PropsWithChildren<BookingInfoOptionsProps>;

const initialPosition = {
    xAxis: 0,
    yAxis: 0,
};

const BookingInfoOptions = ({
    isEditingOpen,
    side,
    booking,
    onOpenChange,
    children,
}: BookingInfoOptionsWithChildren) => {
    const [position, setPosition] = useState({ ...initialPosition });
    const updateIsDragging = useDragStore((state) => state.updateIsDragging);

    const dateToString = useMemo(() => {
        return `${DateUtils.dateAndHourDateToString(booking.startAt)} - ${DateUtils.dateAndHourDateToString(
            booking.finishAt,
        )}`;
    }, [booking.startAt, booking.finishAt]);

    const dateInformation = useMemo(() => {
        const date = new Date(booking.startAt);
        const day = date.getDate();
        const dayOfWeek = date.getDay();
        const month = MONTH[date.getMonth()];
        return (
            <span>{`${WEEK_DAYS_FULL_NAME[dayOfWeek]}, ${day} ${month}`}</span>
        );
    }, [booking.startAt]);

    const bookingColorSpan = () => {
        return {
            // backgroundColor: booking.procedure.color,
            backgroundColor: "",
        };
    };

    // const handleOnDeleteBooking = async () => {
    //     // event.stopPropagation();
    //     // event.preventDefault();
    //     // Call the user delete booking action callback
    // };

    const updatePosition = (transform: Transform | null): void => {
        if (!transform) {
            console.info("No transform info to show ");
        }

        setPosition({
            xAxis: position.xAxis + (transform?.x || 0),
            yAxis: position.yAxis + (transform?.y || 0),
        });
    };

    useDndMonitor({
        onDragStart(event) {
            const eventData = event.active.data.current as {
                id: string;
                type: string;
            };

            const eventActiveId = event.active.id;
            const isBookingInfo = eventData.type === "booking-info-options";

            if (eventActiveId && isBookingInfo) updateIsDragging(true);
        },
    });

    const _onOpenChange = (open: boolean) => {
        if (open === false) {
            // need to decide if i need to reset the position on close.
            setPosition({
                ...initialPosition,
            });
        }
        onOpenChange(open);
    };

    return (
        <Popover
            open={isEditingOpen}
            onOpenChange={_onOpenChange}
            defaultOpen={false}
        >
            <PopoverAnchor style={{ width: "100%" }}>
                <PopoverTrigger asChild>{children}</PopoverTrigger>
            </PopoverAnchor>

            <DndContext>
                <BookingInfoContext
                    side={side}
                    xAxis={position.xAxis}
                    yAxis={position.yAxis}
                    updatePosition={updatePosition}
                >
                    <div className="bookingCard_content">
                        {/* card content that passed as param in future */}
                        <span
                            style={bookingColorSpan()}
                            className="flex h-4 w-4 translate-y-0 rounded-sm"
                        />

                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                                {dateInformation} | {dateToString}
                            </p>
                        </div>
                    </div>
                </BookingInfoContext>
            </DndContext>
        </Popover>
    );
};

BookingInfoOptions.displayName = "BookingInfoOptions";
export default BookingInfoOptions;
