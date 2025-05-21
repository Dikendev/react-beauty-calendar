import { useEffect, useImperativeHandle, useState } from "react";
import type { Booking } from "../../@types";
import { dateUtils } from "../../utils";
import type { BookingCarContextProps } from "../../utils/props";

const BookingCardContent = ({
    booking,
    slotData,
    events,
    style,
    ref,
}: BookingCarContextProps) => {
    if (!booking || !slotData || !slotData) return;

    const { day, hour } = slotData;

    const [currentBooking, setCurrentBooking] = useState<Booking>(booking);

    const isBelowMaxTimeLimit = (normalizedBookingDate: string): boolean => {
        return normalizedBookingDate <= "11:30";
    };

    const cardTodayCustomStyle = (booking: Booking, day: Date) => {
        const normalizedBookingDate = dateUtils.dateAndHourDateToString(
            new Date(booking.finishAt),
        );

        if (
            dateUtils.isTodayDate(day) &&
            isBelowMaxTimeLimit(normalizedBookingDate)
        ) {
            return { backgroundColor: "#000000c0" };
        }

        return { backgroundColor: "#000456c0" };
    };

    useEffect(() => {
        booking && setCurrentBooking(booking);
    }, [booking]);

    useImperativeHandle(ref, () => ({
        updateBooking: (booking: Booking) => setCurrentBooking(booking),
    }));

    return (
        <div
            className="booking_card_content_container"
            key={`${day}-${hour}`}
            style={{
                ...cardTodayCustomStyle(
                    currentBooking,
                    new Date(day.split(":")[1]),
                ),
                ...style,
            }}
            onPointerUp={events?.onClick}
        >
            <div className="booking_card_content">
                <p className="booking_info">
                    {`${dateUtils.dateAndHourDateToString(currentBooking.startAt)} - ${dateUtils.dateAndHourDateToString(
                        currentBooking.finishAt,
                    )}`}
                </p>
            </div>
        </div>
    );
};

export default BookingCardContent;
