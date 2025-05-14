import { useMemo } from "react";
import type { BookingDateAndTime, Bookings } from "../../@types";
import { dateUtils } from "../../utils/date.utils";
import Card from "./Card";

interface CardBlockContentProps {
    bookings?: Bookings;
    blockTimeString?: string;
    slotData?: BookingDateAndTime;
    hoveringAdditionalCardId?: string;
}

const CardBlockContent = ({
    bookings,
    blockTimeString,
    slotData,
    hoveringAdditionalCardId,
}: CardBlockContentProps) => {
    if (!bookings || (!slotData?.day && !slotData?.hour) || !blockTimeString)
        return null;

    const bookingToRender = useMemo(() => {
        return bookings.filter((booking) => {
            const actualSlotTimeString = dateUtils.dateAndHourDateToString(
                new Date(booking.startAt),
            );
            return actualSlotTimeString.split(":")[1] === blockTimeString;
        });
    }, [bookings, blockTimeString]);

    if (!bookingToRender || !bookingToRender?.length) return;

    if (bookingToRender.length === 1) {
        return (
            <Card
                booking={bookingToRender[0]}
                slotData={slotData}
                hoveringAdditionalCardId={hoveringAdditionalCardId}
            />
        );
    }

    return (
        <>
            {bookingToRender.map((booking, index) => (
                <Card
                    key={booking.id}
                    booking={booking}
                    half
                    slotData={slotData}
                    lastCard={bookingToRender.length - 1 === index}
                    cardsQuantity={bookingToRender.length}
                    cardIndex={index}
                    hoveringAdditionalCardId={hoveringAdditionalCardId}
                />
            ))}
        </>
    );
};

export default CardBlockContent;
