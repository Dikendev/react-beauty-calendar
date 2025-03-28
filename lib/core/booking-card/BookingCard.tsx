import type { Booking, BookingDateAndTime } from "../../@types/booking";
import { DateUtils } from "../../utils/date-utils";

import { useCallback, useEffect, useState } from "react";
import useDebounceCallback from "../../hooks/useDebounce";
import { cn } from "../../lib/utils";

interface BookingCardProps {
    booking: Booking;
    slotData: BookingDateAndTime;
}

const WINDOW_SIZE_LIMIT = 700;

const BookingCard = ({ booking, slotData }: BookingCardProps) => {
    const { day, hour } = slotData;

    const isBelowMaxTimeLimit = (normalizedBookingDate: string): boolean => {
        return normalizedBookingDate <= "11:30";
    };

    const reducedContent = useCallback(() => {
        if (typeof window === "undefined") return false;
        return window.innerWidth >= WINDOW_SIZE_LIMIT;
    }, []);

    const [showOnlyStartTime, setShowOnlyStartTime] = useState<boolean>(false);

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

    const handleResize = () => {
        const diffInSeconds = DateUtils.timeDiffInSeconds(
            booking.finishAt,
            booking.startAt,
        );

        const targetMinutes = 15;

        if (diffInSeconds === targetMinutes) {
            setShowOnlyStartTime(reducedContent());
        } else {
            setShowOnlyStartTime(true);
        }
    };

    const debounce = useDebounceCallback(handleResize, 10);

    useEffect(() => {
        debounce();
        window.addEventListener("resize", debounce);
        return () => window.removeEventListener("resize", debounce);
    }, [debounce]);

    return (
        <div
            className="relative w-full h-full"
            key={`${day}-${hour}`}
            style={cardTodayCustomStyle(booking, new Date(day.split(":")[1]))}
        >
            <div
                className={cn(
                    "flex flex-col h-full text-white pl-0 md:pl-2 lg:pl-2 justify-start items-start",
                )}
            >
                {/* {booking.client.profile.name && (
                    <p className="text-[0.8rem] h-[0.8rem]">
                        {booking.client.profile.name}
                    </p>
                )} */}
                <p
                    className="text-[0.8rem] h-[0.8rem]"
                    style={{ overflowWrap: "anywhere" }}
                >
                    {`${DateUtils.dateAndHourDateToString(booking.startAt)} ${
                        showOnlyStartTime
                            ? `- ${DateUtils.dateAndHourDateToString(
                                  booking.finishAt,
                              )}`
                            : ""
                    }`}
                </p>
                <span className="flex flex-row items-center justify-center" />
            </div>
        </div>
    );
};

export default BookingCard;
