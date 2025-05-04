import { DragOverlay } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

import type { Booking } from "../../@types";
import type { BookingDateAndTime } from "../../@types/booking";

import BookingCard from "../booking-card/BookingCard";

interface CardOverlayProps {
    bookingInit: Booking;
    slotData: BookingDateAndTime;
    heightStyle: number;
}
const CardOverlay = ({
    bookingInit,
    slotData,
    heightStyle,
}: CardOverlayProps) => {
    return (
        <DragOverlay
            modifiers={[restrictToWindowEdges]}
            dropAnimation={{
                duration: 2000,
                easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
            }}
            className="Draggable dragging"
        >
            <BookingCard
                booking={bookingInit}
                slotData={slotData}
                heightStyle={heightStyle}
            />
        </DragOverlay>
    );
};

export default CardOverlay;
