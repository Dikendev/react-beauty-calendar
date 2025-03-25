import { createContext } from "react";
import type { BookingModalContextProps } from "./BookingModalProvider";

const BookingModalContext = createContext<BookingModalContextProps | undefined>(
    undefined,
);

export default BookingModalContext;
