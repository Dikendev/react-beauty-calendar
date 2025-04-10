import type { UserProfile } from "./user";

export interface Booking {
    id: string;
    startAt: Date;
    finishAt: Date;
}

export type Bookings = Booking[];

export interface BookingDateAndTime {
    day: string;
    hour: string;
}

export interface BookingBulkData {
    user: UserProfile;
    booking: Booking[];
}

export type BookingViewType = "week" | "day" | "month" | "table";
