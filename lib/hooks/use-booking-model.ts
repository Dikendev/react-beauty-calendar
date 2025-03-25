import { use } from "react";
import BookingModalContext from "../context/bookingModal/booking-modal-context";

export const useBookingModal = () => {
    const context = use(BookingModalContext);

    if (!context) {
        throw new Error(
            "useBookingModal must be used within a BookingModalProvider",
        );
    }

    return context;
};

export default useBookingModal;
