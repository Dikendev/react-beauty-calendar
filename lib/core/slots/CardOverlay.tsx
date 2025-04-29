import { DragOverlay } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

import type { Booking } from "../../@types";

import { useEffect, useState } from "react";
import type { BookingDateAndTime } from "../../@types/booking";
import { useNewEventStore } from "../../hooks";
import { DateUtils } from "../../utils/date-utils";
import BookingCard from "../booking-card/BookingCard";

interface CardOverlayProps {
    bookingInit: Booking;
    slotData: BookingDateAndTime;
    heightStyle: string;
}
const CardOverlay = ({
    bookingInit,
    slotData,
    heightStyle,
}: CardOverlayProps) => {
    const [initialBookingPrev, setInitialPrevBooking] =
        useState<Booking>(bookingInit);

    const prevBookingData = useNewEventStore((store) => store).slotStartAt;

    const update = (slotStartAt: string) => {
        const newStartAt = new Date(slotStartAt);

        const timeDiff = DateUtils.getTimeDiff(
            initialBookingPrev.startAt,
            initialBookingPrev.finishAt,
        );

        const newFinishDate = DateUtils.getNewFinishAt(slotStartAt, timeDiff);

        setInitialPrevBooking((prev) => ({
            ...prev,
            startAt: newStartAt,
            finishAt: newFinishDate,
        }));
    };

    useEffect(() => {
        if (prevBookingData) {
            update(prevBookingData);
        }
    }, [prevBookingData]);

    return (
        <DragOverlay
            modifiers={[restrictToWindowEdges]}
            dropAnimation={{
                duration: 2000,
                easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
            }}
            className="Draggable dragging"
        >
            <div
                className="cardOverlay_content"
                style={{
                    height: heightStyle,
                }}
            >
                <BookingCard
                    booking={initialBookingPrev}
                    slotData={slotData}
                    heightStyleTransformer={heightStyle}
                />
            </div>
        </DragOverlay>
    );
};

export default CardOverlay;
