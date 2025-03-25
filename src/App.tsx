import type {
    Booking,
    BookingDateAndTime,
    BookingViewType,
} from "../lib/@types/booking";
import type { ActionType } from "../lib/core/header-calendar/Header";
import type { BlockTimeData } from "../lib/core/slots/EmptySlot";
import TabsContentCore from "../lib/core/slots/TabsContent";
import { useCalendarInstance } from "../lib/main";
import { mockBooking } from "../lib/mock/booking-mock";

export interface CalendarInstanceRef {
    getStatus: () => boolean;
}

const App = () => {
    const onChangeViewType = (bookingViewType: BookingViewType) => {
        console.log("on change view Type", bookingViewType);
    };

    const onSlotClick = (slotData: BlockTimeData) => {
        console.log("onSlotClick", slotData);
    };

    const onTodayClick = (date: Date) => {
        console.log("on todayClick", date);
    };

    const onDayChange = (date: Date[], actionType: ActionType) => {
        console.log("on day change", date, actionType);
    };

    const onModalClose = () => {
        console.log("On modal close");
    };

    const onCardDropCallback = async (
        booking: Booking,
        overId: string,
        slotData: BookingDateAndTime,
    ) => {
        console.log("onCardDropCallback");
        console.log("booking", booking);
        console.log("overId", overId);
        console.log("slotData", slotData);
    };

    const calendarInstance = useCalendarInstance({
        bookings: mockBooking,
        viewModes: ["DAY", "WEEK"],
        onChangeViewType,
        onSlotClick,
        onTodayClick,
        onDayChange,
        onModalClose,
        onCardDropCallback,
        createBookingModal: <TabsContentCore />,
    });

    return <>{calendarInstance.getCalendar()}</>;
};

export default App;
