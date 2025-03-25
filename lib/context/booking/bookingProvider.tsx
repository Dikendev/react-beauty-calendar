import { type PropsWithChildren, useRef } from "react";
import BookingContext from "./booking-context";
import {
    type BookingProps,
    type BookingStore,
    bookingStore,
} from "./booking-store";

type BookingProviderProps = PropsWithChildren<BookingProps>;

const BookingProvider = ({ children, ...props }: BookingProviderProps) => {
    const bookingStoreRef = useRef<BookingStore | null>(null);

    if (!bookingStoreRef.current) {
        bookingStoreRef.current = bookingStore(props);
    }

    return (
        <BookingContext value={bookingStoreRef.current}>
            {children}
        </BookingContext>
    );
};

export default BookingProvider;
