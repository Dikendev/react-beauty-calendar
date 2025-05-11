import { describe, expect, test } from "vitest";
import type { Booking } from "../../@types";
import { dateUtils } from "../date.utils";

describe("date-utils", () => {
    describe("bookingTimeRange", () => {
        test("should return correct time range", () => {
            const booking: Booking = {
                id: "666",
                startAt: new Date("2025-05-06T01:00:00.000Z"),
                finishAt: new Date("2025-05-06T02:15:00.000Z"),
            };

            const overId =
                "Mon May 05 2025 05:00:00 GMT-0300 (Brasilia Standard Time)";

            const expected: Booking = {
                ...booking,
                startAt: new Date(overId),
                finishAt: new Date(
                    "Mon May 05 2025 06:15:00 GMT-0300 (Brasilia Standard Time)",
                ),
            };
            const newBookingTimes = dateUtils.bookingTimeRange(booking, overId);
            expect(newBookingTimes).toEqual(expected);
        });

        test("should return more than 1 day difference", () => {
            const booking: Booking = {
                id: "666",
                startAt: new Date("2025-05-06T01:00:00.000Z"),
                finishAt: new Date("2025-05-07T02:15:00.000Z"),
            };

            const overId =
                "Mon May 04 2025 05:00:00 GMT-0300 (Brasilia Standard Time)";

            const expected: Booking = {
                ...booking,
                startAt: new Date(overId),
                finishAt: new Date(
                    "Mon May 05 2025 06:15:00 GMT-0300 (Brasilia Standard Time)",
                ),
            };
            const newBookingTimes = dateUtils.bookingTimeRange(booking, overId);
            expect(newBookingTimes).toEqual(expected);
        });

        test("should return minutes difference only", () => {
            const booking: Booking = {
                id: "666",
                startAt: new Date("2025-05-06T01:00:00.000Z"),
                finishAt: new Date("2025-05-06T01:15:00.000Z"),
            };

            const overId =
                "Mon May 04 2025 05:00:00 GMT-0300 (Brasilia Standard Time)";

            const expected: Booking = {
                ...booking,
                startAt: new Date(overId),
                finishAt: new Date(
                    "Mon May 04 2025 05:15:00 GMT-0300 (Brasilia Standard Time)",
                ),
            };
            const newBookingTimes = dateUtils.bookingTimeRange(booking, overId);
            expect(newBookingTimes).toEqual(expected);
        });

        test("should return 3 days difference", () => {
            const booking: Booking = {
                id: "666",
                startAt: new Date("2025-05-04T01:00:00.000Z"),
                finishAt: new Date("2025-05-06T01:15:00.000Z"),
            };

            const overId =
                "Mon May 01 2025 01:00:00 GMT-0300 (Brasilia Standard Time)";

            const expected: Booking = {
                ...booking,
                startAt: new Date(overId),
                finishAt: new Date(
                    "Mon May 03 2025 01:15:00 GMT-0300 (Brasilia Standard Time)",
                ),
            };
            const newBookingTimes = dateUtils.bookingTimeRange(booking, overId);
            expect(newBookingTimes).toEqual(expected);
        });
    });
});
