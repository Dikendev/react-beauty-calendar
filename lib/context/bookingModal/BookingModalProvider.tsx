import type { PropsWithChildren, ReactNode } from "react";
import type { BookingViewType, Bookings } from "../../@types/booking";
import type { RootEventsProps } from "../../@types/calendar-instance";
import BookingModalContext from "./booking-modal-context";

export interface BookingModalContextProps extends RootEventsProps {
    createBookingModal: ReactNode;
    bookings: Bookings;
    viewModes: BookingViewType[];
}
type BookingModalContextPropsWithChildren =
    PropsWithChildren<BookingModalContextProps>;

const BookingModalProvider = ({
    children,
    ...props
}: BookingModalContextPropsWithChildren) => {
    return (
        <BookingModalContext value={{ ...props }}>
            {children}
        </BookingModalContext>
    );
};

export default BookingModalProvider;
