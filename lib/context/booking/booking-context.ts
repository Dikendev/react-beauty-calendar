import { createContext } from "react";
import type { BookingStore } from "./booking-store";

const BookingContext = createContext<BookingStore | null>(null);

export default BookingContext;
