import type { Booking, BookingDateAndTime } from "../../@types";
import { DateUtils } from "../../utils/date-utils";
import Card from "./Card";

interface CardBlockContentProps {
    bookings?: Booking[];
    blockTimeString: string;
    slotData?: BookingDateAndTime;
}

const CardBlockContent = ({
    bookings,
    blockTimeString,
    slotData,
}: CardBlockContentProps) => {
    if (!bookings || (!slotData?.day && !slotData?.hour)) return null;

    const bookingToRender = bookings.filter((booking) => {
        const actualSlotTimeString = DateUtils.dateAndHourDateToString(
            new Date(booking.startAt),
        );
        return actualSlotTimeString.split(":")[1] === blockTimeString;
    });

    if (!bookingToRender || !bookingToRender?.length) return;

    if (bookingToRender.length === 1) {
        return <Card booking={bookingToRender[0]} slotData={slotData} />;
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
                />
            ))}
        </>
    );
};

export default CardBlockContent;
