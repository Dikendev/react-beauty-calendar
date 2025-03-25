import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import Root from "../core/Root";
import TabsContentCore from "../core/slots/TabsContent";
import { mockBooking } from "../mock/booking-mock";

const meta = {
    title: "Calendar example",
    component: Root,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: "padded",
        // toc: {
        //     disable: true, // 👈 Disables the table of contents
        // },
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ["autodocs"],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        viewModes: { control: "select" },
    },
    args: {
        onChangeViewType: fn((bookingViewType) => {
            console.log("bookingViewType", bookingViewType);
        }),
        onDayChange: fn((date, actionType) => {
            console.log("date", date);
            console.log("actionType", actionType);
        }),
        onModalClose: fn(() => {
            console.log("actionType");
        }),
        onSlotClick: fn(() => {
            console.log("onSlotClick");
        }),
        onTodayClick: fn((date) => {
            console.log("date", date);
        }),
        onCardDropCallback: fn(async (booking, overId, slotData) => {
            console.log("booking", booking);
            console.log("overId", overId);
            console.log("slotData", slotData);
        }),
    },

    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
    // args: { onClick: fn() },
} satisfies Meta<typeof Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const calendar: Story = {
    args: {
        bookings: mockBooking,
        viewModes: ["DAY", "WEEK"],
        createBookingModal: TabsContentCore(),
    },
};
