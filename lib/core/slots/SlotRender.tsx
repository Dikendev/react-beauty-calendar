import { memo } from "react";
import type { Booking, BookingDateAndTime } from "../../@types/booking";
import { DateUtils } from "../../utils/date-utils";
import EmptySlot, { type BlocksTimeStructure } from "./EmptySlot";

interface SlotRenderProps {
    firstDay: boolean;
    booking: Booking[];
    dayHour: BookingDateAndTime;
    disabledCss: string;
    firstBlockTimeData: BlocksTimeStructure;
    secondBlockTimeData: BlocksTimeStructure;
    thirdBlockTimeData: BlocksTimeStructure;
    fourthBlockTimeData: BlocksTimeStructure;
}
const SlotRender = memo(
    ({
        firstDay,
        booking,
        dayHour,
        disabledCss,
        firstBlockTimeData,
        secondBlockTimeData,
        thirdBlockTimeData,
        fourthBlockTimeData,
    }: SlotRenderProps) => {
        const { day, hour } = dayHour;

        const bookings = booking.filter((bookingEvent) => {
            const bookingStartTime = DateUtils.dateAndHourDateToString(
                bookingEvent.startAt,
            );

            const bookingDay = new Date(bookingEvent.startAt).getDate();
            const slotDay = new Date(day).getDate();

            const slotHour = hour.split(":")[0];
            const bookingHour = bookingStartTime.split(":")[0];

            const isSameHour = bookingHour === slotHour;
            const isSameDay = bookingDay === slotDay;
            return isSameHour && isSameDay;
        });

        if (!bookings.length) {
            return (
                <EmptySlot
                    first={firstBlockTimeData}
                    second={secondBlockTimeData}
                    third={thirdBlockTimeData}
                    fourth={fourthBlockTimeData}
                    disabledCss={disabledCss}
                    firstDay={firstDay}
                />
            );
        }

        return (
            <EmptySlot
                dayHour={dayHour}
                bookings={bookings}
                first={firstBlockTimeData}
                second={secondBlockTimeData}
                third={thirdBlockTimeData}
                fourth={fourthBlockTimeData}
                disabledCss={disabledCss}
                firstDay={firstDay}
            />
        );
    },
);

export default SlotRender;
