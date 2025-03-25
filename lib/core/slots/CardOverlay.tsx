import { DragOverlay } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

import type { Booking } from "../../@types";

import styles from "./Draggable.module.css";

import type { BookingDateAndTime } from "../../@types/booking";
import { cn } from "../../lib/utils";
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
            className={cn("w-full", styles.Draggable, styles.dragging)}
        >
            <div
                className={cn(
                    "text-white w-full absolute z-10 border rounded-sm overflow-hidden",
                )}
                style={{
                    height: heightStyle,
                }}
            >
                <BookingCard booking={bookingInit} slotData={slotData} />
            </div>
        </DragOverlay>
    );
};

export default CardOverlay;
