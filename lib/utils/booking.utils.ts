import type { Booking } from "../@types";

const sanitizeOverflowId = (id: string): string => {
    return id.replace("overflow-", "");
};

export const bookingUtils = {
    normalizeBookingNorthId: (booking: Booking): Partial<Booking> => {
        if (!booking.id.includes("overflow-")) return booking;

        return {
            startAt: booking.startAt,
            id: sanitizeOverflowId(booking.id),
        };
    },

    normalizeBookingSouthId: (booking: Booking): Partial<Booking> => {
        if (!booking.id.includes("overflow-")) return booking;

        return {
            finishAt: booking.finishAt,
            id: sanitizeOverflowId(booking.id),
        };
    },
    resetToFirstHourNextDay: (booking: Booking) => {
        const startAtUpdated = new Date(booking.startAt);
        startAtUpdated.setHours(0, 0, 0, 0);
        startAtUpdated.setDate(booking.finishAt.getDate());
        return startAtUpdated;
    },
};
