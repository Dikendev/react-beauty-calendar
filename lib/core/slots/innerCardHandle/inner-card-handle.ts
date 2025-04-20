import type { Booking } from "../../../@types";

function isWithinBookingRange(startAt: Date, booking: Booking): boolean {
    const isAfterStart = startAt > new Date(booking.startAt);
    const isBeforeEnd = startAt < new Date(booking.finishAt);
    return isAfterStart && isBeforeEnd;
}

const InnerCardsHandle = {
    calculateOverlappingBookings: (
        currentBooking: Booking,
        allBookings: Booking[],
    ): number => {
        const overlappingBookings = allBookings.filter((booking) => {
            const bookingDay = new Date(booking.startAt).getDate();
            const currentBookingDay = currentBooking.startAt.getDate();
            return (
                bookingDay === currentBookingDay &&
                booking.id !== currentBooking.id
            );
        });

        let overlapCount = 0;

        for (const booking of overlappingBookings) {
            if (isWithinBookingRange(currentBooking.startAt, booking)) {
                overlapCount++;
            }
        }

        return overlapCount;
    },
};

export { InnerCardsHandle };
