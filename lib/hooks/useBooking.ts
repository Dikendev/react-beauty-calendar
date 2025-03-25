import { use } from "react";
import { useStore } from "zustand";
import BookingContext from "../context/booking/booking-context";
import type { BookingState } from "../context/booking/booking-store";

const useBooking = <T>(selector: (state: BookingState) => T): T => {
    const store = use(BookingContext);

    if (!store) {
        throw new Error(
            "Missing useBookingContextProvider must be within a BookingProvider",
        );
    }

    return useStore(store, selector);
};

export default useBooking;
