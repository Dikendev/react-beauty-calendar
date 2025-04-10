import type { StateCreator } from "zustand";

import type { User } from "../../../@types";
import type {
    Booking,
    BookingBulkData,
    BookingDateAndTime,
    BookingViewType,
} from "../../../@types/booking";

export interface BookingInfoProps {
    users: User[];
    bookingViewType: BookingViewType;
    bookingBulkData: BookingBulkData;
}

export interface BookingInfoState extends BookingInfoProps {
    updateUsers: (users: User[]) => void;
    setBookingViewType: (bookingType: BookingViewType) => void;
    setBookingBulkData: (bookingBulkData: BookingBulkData) => void;
    updatingBookingBulkData: (booking: Booking, slotDay: number) => void;
    resetBookingResponse: () => void;
    optimisticCardUpdate: (
        booking: Booking,
        newStartAt: Date,
        newFinishDate: Date,
        slotData: BookingDateAndTime,
    ) => void;
}

const bookingInfoStore: StateCreator<BookingInfoState> = (
    set,
    get,
): BookingInfoState => ({
    users: [],
    bookingViewType: "week",
    bookingBulkData: {
        user: {
            id: "",
            profile: {
                id: "",
                name: "",
            },
        },
        booking: [],
    },

    updateUsers: (users: User[]): void =>
        set((prev) => ({
            ...prev,
            users,
        })),

    setBookingBulkData: (bookingBulkData: BookingBulkData): void =>
        set((prev) => ({
            ...prev,
            bookingBulkData: { ...bookingBulkData },
        })),

    updatingBookingBulkData: (booking: Booking, slotDay: number): void => {
        set((prev) => {
            const bookingExist = prev.bookingBulkData.booking.map(
                (prevBooking) => {
                    const bookingStartDay = new Date(
                        prevBooking.startAt,
                    ).getDate();

                    if (
                        bookingStartDay === slotDay &&
                        booking.id === prevBooking.id
                    )
                        return booking;
                    return prevBooking;
                },
            );

            return {
                ...prev,
                bookingBulkData: {
                    ...prev.bookingBulkData,
                    booking: bookingExist,
                },
            };
        });
    },

    resetBookingResponse: (): void =>
        set((prev) => ({
            ...prev,
            bookingResponse: null,
        })),

    setBookingViewType: (bookingViewType: BookingViewType): void =>
        set((prev) => ({
            ...prev,
            bookingViewType: bookingViewType,
        })),

    optimisticCardUpdate: (
        booking: Booking,
        newStartAt: Date,
        newFinishDate: Date,
        slotData: BookingDateAndTime,
    ): void => {
        const updatedBooking = {
            ...booking,
            startAt: newStartAt,
            finishAt: newFinishDate,
        };

        const slotDay = new Date(slotData.day).getDate();
        get().updatingBookingBulkData(updatedBooking, slotDay);
    },
});

export default bookingInfoStore;
