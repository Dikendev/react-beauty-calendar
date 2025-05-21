import { create } from "zustand";
import type { Booking, BookingDateAndTime } from "../../@types";

export interface DragProps {
    startAt: string;
    booking: Booking | null;
    slotData: BookingDateAndTime | null;
}

export interface DragState extends DragProps {
    updateStartAt: (startAt: string) => void;
    updateBooking: (booking: Booking | null) => void;
    updateSlotData: (slotData: BookingDateAndTime | null) => void;
}

const useDragStartAtStore = create<DragState>((set) => ({
    startAt: "",
    booking: null,
    slotData: null,
    updateStartAt: (startAt: string) =>
        set((prev) => ({
            ...prev,
            startAt,
        })),
    updateBooking: (booking: Booking | null) => {
        set((prev) => {
            if (booking?.startAt !== prev.booking?.startAt) {
                return {
                    ...prev,
                    booking,
                };
            }
            return prev;
        });
    },
    updateSlotData: (slotData: BookingDateAndTime | null) => {
        set((prev) => ({
            ...prev,
            slotData,
        }));
    },
}));

export default useDragStartAtStore;
