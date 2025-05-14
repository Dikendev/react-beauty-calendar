import { memo, useMemo } from "react";
import type { Booking, BookingDateAndTime } from "../../@types/booking";
import { dateUtils } from "../../utils/date.utils";
import type { BlocksTimeStructure } from "../../utils/props";
import EmptySlot from "./EmptySlot";

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

        const bookings = useMemo(() => {
            return booking.filter((bookingEvent) => {
                const bookingStartTime = dateUtils.dateAndHourDateToString(
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
        }, [booking, dayHour]);

        if (!bookings.length) {
            return (
                <EmptySlot
                    dayHour={dayHour}
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
