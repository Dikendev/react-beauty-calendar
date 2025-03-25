import { createStore } from "zustand";
import type { Booking } from "../../@types";
import type { BookingDateAndTime } from "../../@types/booking";
import type { CardRef } from "../../core/slots/Card";

export type DraggingBooking = {
    overId: string;
    booking: Booking;
    slotData: BookingDateAndTime;
};

export const initialBookingFormState: BookingProps = {
    selectedDate: new Date(),
    isBookingLoading: false,
    bookingModalState: false,
    selectedHour: "",
    cardsRef: new Map(),
};

export interface BookingProps {
    selectedDate: Date;
    selectedHour: string;
    bookingModalState: boolean;
    isBookingLoading: boolean;
    cardsRef: Map<string, CardRef>;
}

export interface BookingState extends BookingProps {
    setSelectedDate: (date: Date) => void;
    setSelectedHour: (hour: string) => void;
    openNewBookingModal: (day?: Date, hour?: string) => void;
    setIsBookingLoading: () => void;
    setCardRef: (key: string, cardRef: CardRef) => void;
    changeNewBookingStateModal: () => void;
    clearDraggingBookings: () => void;
}

export type BookingStore = ReturnType<typeof bookingStore>;

const bookingStore = (initialProps?: Partial<BookingState>) => {
    return createStore<BookingState>((set) => ({
        ...initialBookingFormState,
        ...initialProps,

        clearDraggingBookings: () =>
            set((prev) => ({
                ...prev,
                draggingBooking: null,
            })),

        changeNewBookingStateModal: () => set({ bookingModalState: true }),

        openNewBookingModal: (date?: Date, hour?: string) => {
            if (date) set({ selectedDate: date });
            if (hour) set({ selectedHour: hour });
        },

        setIsBookingLoading: () => set({ isBookingLoading: true }),

        setSelectedDate: (date) =>
            set((prev) => ({
                ...prev,
                selectedDate: date,
            })),

        setSelectedHour: (hour: string) =>
            set((prev) => ({
                ...prev,
                selectedHour: hour,
            })),

        setCardRef: (key: string, cardRef: CardRef): void =>
            set((prev) => {
                return {
                    ...prev,
                    cardsRef: prev.cardsRef.set(key, cardRef),
                };
            }),
    }));
};

export { bookingStore };
