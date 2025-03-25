import type { Booking, BookingDateAndTime } from "../../@types/booking";
import { DateUtils } from "../../utils/date-utils";

import { cn } from "../../lib/utils";

interface BookingCardProps {
    booking: Booking;
    slotData: BookingDateAndTime;
}

const BookingCard = ({ booking, slotData }: BookingCardProps) => {
    const { day, hour } = slotData;

    const isBelowMaxTimeLimit = (normalizedBookingDate: string): boolean => {
        return normalizedBookingDate <= "11:30";
    };

    const cardTodayCustomStyle = (booking: Booking, day: Date) => {
        const normalizedBookingDate = DateUtils.dateAndHourDateToString(
            new Date(booking.finishAt),
        );

        if (
            DateUtils.isTodayDate(day) &&
            isBelowMaxTimeLimit(normalizedBookingDate)
        ) {
            return {
                backgroundColor: "#000000c0",
            };
        }

        return { backgroundColor: "#000456c0" };
    };

    return (
        <div
            className="relative w-full h-full"
            key={`${day}-${hour}`}
            style={cardTodayCustomStyle(booking, new Date(day.split(":")[1]))}
        >
            <div
                className={cn(
                    "flex flex-col h-full text-white pl-2 justify-start items-start",
                )}
            >
                {/* {booking.client.profile.name && (
                    <p className="text-[0.8rem] h-[0.8rem]">
                        {booking.client.profile.name}
                    </p>
                )} */}
                <p className="text-[0.8rem] h-[0.8rem]">
                    {`${DateUtils.dateAndHourDateToString(booking.startAt)} - ${DateUtils.dateAndHourDateToString(
                        booking.finishAt,
                    )}`}
                </p>
                <span className="flex flex-row items-center justify-center" />
            </div>
        </div>
    );
};

export default BookingCard;
