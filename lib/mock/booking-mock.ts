// import type { Booking, Client, Payment, Procedure, User } from "../@types";
import type { Booking, User } from "../@types";

const mockUser: User = {
    id: "user-123",
    profile: {
        id: "profile-123",
        name: "Diego",
        email: "jane.smith@example.com",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
};

const mockBooking: Booking[] = [
    {
        id: "1",
        startAt: new Date("2025-04-22T11:00:00Z"),
        finishAt: new Date("2025-04-22T13:15:00Z"),
    },
    {
        id: "2",
        startAt: new Date("2025-04-22T12:45:00Z"),
        finishAt: new Date("2025-04-22T13:00:00Z"),
    },
    {
        id: "3",
        startAt: new Date("2025-04-22T11:30:00Z"),
        finishAt: new Date("2025-04-22T12:30:00Z"),
    },
    {
        id: "4",
        startAt: new Date("2025-04-22T11:30:00Z"),
        finishAt: new Date("2025-04-22T12:15:00Z"),
    },
    // {
    //     id: "5",
    //     startAt: new Date("2025-04-22T11:45:00Z"),
    //     finishAt: new Date("2025-04-22T12:00:00Z"),
    // },
    {
        id: "6",
        startAt: new Date("2025-04-23T14:00:00Z"),
        finishAt: new Date("2025-04-23T15:30:00Z"),
    },
    {
        id: "7",
        startAt: new Date("2025-04-24T13:00:00Z"),
        finishAt: new Date("2025-04-24T13:30:00Z"),
    },
    {
        id: "8",
        startAt: new Date("2025-04-26T14:30:00Z"),
        finishAt: new Date("2025-04-26T15:30:00Z"),
    },
    {
        id: "9",
        startAt: new Date("2025-04-14T10:00:00Z"),
        finishAt: new Date("2025-04-14T11:00:00Z"),
    },
    {
        id: "10",
        startAt: new Date("2025-04-20T11:15:00Z"),
        finishAt: new Date("2025-04-20T12:45:00Z"),
    },
    {
        id: "60",
        startAt: new Date("2025-04-20T11:15:00Z"),
        finishAt: new Date("2025-04-20T13:00:00Z"),
    },
    {
        id: "11",
        startAt: new Date("2025-04-25T11:30:00Z"),
        finishAt: new Date("2025-04-25T13:00:00Z"),
    },
    {
        id: "12",
        startAt: new Date("2025-04-25T12:00:00Z"),
        finishAt: new Date("2025-04-25T12:30:00Z"),
    },
    {
        id: "13",
        startAt: new Date("2025-04-26T12:00:00Z"),
        finishAt: new Date("2025-04-26T12:30:00Z"),
    },
    {
        id: "14",
        startAt: new Date("2025-04-26T11:30:00Z"),
        finishAt: new Date("2025-04-26T11:45:00Z"),
    },
    {
        id: "21",
        startAt: new Date("2025-04-23T19:30:00Z"),
        finishAt: new Date("2025-04-23T23:00:00Z"),
    },
    {
        id: "22",
        startAt: new Date("2025-04-23T00:00:00Z"),
        finishAt: new Date("2025-04-23T01:00:00Z"),
    },
];

const nextWeekBookingMock: Booking[] = [
    {
        id: "15",
        startAt: new Date("2025-03-27T13:00:00Z"),
        finishAt: new Date("2025-03-27T14:30:00Z"),
    },
    {
        id: "16",
        startAt: new Date("2025-03-27T15:00:00Z"),
        finishAt: new Date("2025-03-27T16:00:00Z"),
    },
    {
        id: "17",
        startAt: new Date("2025-03-28T09:00:00Z"),
        finishAt: new Date("2025-03-28T10:15:00Z"),
    },
    {
        id: "18",
        startAt: new Date("2025-03-28T11:00:00Z"),
        finishAt: new Date("2025-03-28T12:30:00Z"),
    },
    {
        id: "19",
        startAt: new Date("2025-03-29T14:00:00Z"),
        finishAt: new Date("2025-03-29T15:00:00Z"),
    },
    {
        id: "20",
        startAt: new Date("2025-03-29T15:30:00Z"),
        finishAt: new Date("2025-03-29T16:45:00Z"),
    },
    {
        id: "20",
        startAt: new Date("2025-03-29T00:00:00Z"),
        finishAt: new Date("2025-03-29T01:00:00Z"),
    },
];

export { mockBooking, nextWeekBookingMock, mockUser };
