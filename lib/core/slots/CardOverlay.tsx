import { DragOverlay } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

import type { Booking } from "../../@types";

import type { BookingDateAndTime } from "../../@types/booking";
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
                    booking={bookingInit}
                    slotData={slotData}
                    heightStyleTransformer={heightStyle}
                />
            </div>
        </DragOverlay>
    );
};

export default CardOverlay;
