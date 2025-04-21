import { useEffect, useState } from "react";
import type {
    Booking,
    BookingDateAndTime,
    BookingViewType,
} from "../lib/@types/booking";
import type { OnSlotClick } from "../lib/@types/calendar-instance";
import type { ActionType } from "../lib/core/header-calendar/Header";
import TabsContentCore from "../lib/core/slots/TabsContent";
import { useCalendarInstance } from "../lib/main";
import { mockBooking, nextWeekBookingMock } from "../lib/mock/booking-mock";

const App = () => {
    const [bookings, setBookings] = useState<Booking[]>(mockBooking);

    const onChangeViewType = (bookingViewType: BookingViewType) => {
        console.log("on change view Type", bookingViewType);
    };

    const onSlotClick = (slot: OnSlotClick) => {
        console.log("onSlotClick", slot);
    };

    const onTodayClick = (date: Date) => {
        console.log("on todayClick", date);
    };

    const onDayChange = (date: Date[], actionType: ActionType) => {
        console.log("on day change", date, actionType);
        calendarInstance?.changeLoading(true);

        setTimeout(() => {
            calendarInstance?.changeLoading(false);
            switch (actionType) {
                case "next": {
                    setBookings(nextWeekBookingMock);
                    break;
                }
                case "previous": {
                    setBookings(mockBooking);
                }
            }
        }, 500);
    };

    const onModalClose = () => {
        console.log("On modal close");
    };

    const onHeaderDayClick = (date: Date) => {
        console.log("onHeaderDayClick", date);
    };

    const onCardDropCallback = async (
        booking: Booking,
        overId: string,
        slotData: BookingDateAndTime,
        newBooking: Booking,
    ) => {
        console.log("onCardDropCallback");
        console.log("booking", booking);
        console.log("overId", overId);
        console.log("slotData", slotData);
        console.log("newBooking", newBooking);

        setBookings((prevBookings) => {
            const updatedBooking = prevBookings.map((localBooking) => {
                if (localBooking.id === newBooking.id) {
                    return {
                        ...newBooking,
                        finishAt: newBooking.finishAt,
                        startAt: newBooking.startAt,
                    };
                }
                return localBooking;
            });
            return [...updatedBooking];
        });
    };

    const calendarInstance = useCalendarInstance({
        bookings: bookings,
        viewModes: ["day", "week"],
        onChangeViewType,
        onSlotClick,
        onHeaderDayClick,
        onTodayClick,
        onDayChange,
        onModalClose,
        onCardDropCallback,
        createBookingModal: <TabsContentCore />,
    });

    useEffect(() => {
        console.log("Booking updated", bookings);
    }, [bookings]);

    return (
        <div className="h-[100vh]">
            <div className="sticky top-0 right-0 left-0">HEADER EXAMPLE</div>

            <div className="mt-2 left-0 right-0 w-full p-3.5 center">
                {calendarInstance.getCalendar()}
            </div>
        </div>
    );
};

export default App;
