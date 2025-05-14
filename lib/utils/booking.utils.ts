import type { Booking } from "../@types";

export const bookingUtils = {
    resizeBookingNorthId: (booking: Booking): Partial<Booking> => {
        if (!booking?.overflow) return booking;

        return {
            startAt: booking.startAt,
            id: booking.id,
        };
    },

    resizeBookingSouthId: (booking: Booking): Partial<Booking> => {
        if (!booking?.overflow) return booking;

        return {
            finishAt: booking.finishAt,
            id: booking.id,
        };
    },

    resetToFirstHourNextDay: (booking: Booking) => {
        const startAtUpdated = new Date(booking.startAt);
        startAtUpdated.setHours(0, 0, 0, 0);
        startAtUpdated.setDate(booking.finishAt.getDate());
        return startAtUpdated;
    },
};
