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

//TODO: need to add some dynamic data to the card booking.

// const mockProcedure: Procedure = {
//     id: "procedure-123",
//     name: "Haircut",
//     requiredTimeMin: 30,
//     description: "",
//     color: "",
//     organizationFeePercent: 10,
//     // duration: 30,
//     amount: 60,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     // price: 50,
// };

// const mockPayment: Payment = {
//     total: 50,
//     type: "CREDIT_CARD",
//     // method: "Credit Card",
//     status: "PAID",
//     // Add other properties as needed
// };

const mockBooking: Booking[] = [
    {
        id: "1",
        startAt: new Date("2025-03-16T11:00:00Z"),
        finishAt: new Date("2025-03-16T11:15:00Z"),
    },
    {
        id: "2",
        startAt: new Date("2025-03-15T11:00:00Z"),
        finishAt: new Date("2025-03-15T12:00:00Z"),
    },
    {
        id: "3",
        startAt: new Date("2025-03-17T11:00:00Z"),
        finishAt: new Date("2025-03-17T11:30:00Z"),
    },
    {
        id: "4",
        startAt: new Date("2025-03-14T11:00:00Z"),
        finishAt: new Date("2025-03-14T11:45:00Z"),
    },
    {
        id: "5",
        startAt: new Date("2025-03-23T13:00:00Z"),
        finishAt: new Date("2025-03-23T13:30:00Z"),
    },
    {
        id: "6",
        startAt: new Date("2025-03-23T14:30:00Z"),
        finishAt: new Date("2025-03-23T15:30:00Z"),
    },
];

export { mockBooking, mockUser };
