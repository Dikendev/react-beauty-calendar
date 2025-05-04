import { type Ref, useImperativeHandle, useRef, useState } from "react";

import type { Booking, BookingDateAndTime } from "../../@types/booking";

import { useGlobalStore } from "../../hooks";

import { BOOKING_VIEW_TYPE } from "../../constants";

import BookingInfoOptions, {
    type Side,
} from "../booking-options/BookingInfoOptions";
import CardContent from "./CardContent";
import useResizableCardHook from "./useResizableCardHook";

interface CardProps {
    booking: Booking;
    slotData: BookingDateAndTime;
    lastCard?: boolean;
    half?: boolean;
    ref?: Ref<CardRef>;
}

export interface CardRef {
    bookingId: string;
}

const Card = ({
    booking,
    slotData,
    lastCard = false,
    half = false,
    ref,
}: CardProps) => {
    const { bookingViewType, optimisticCardUpdate } = useGlobalStore();

    const [bookingInit, setBookingInit] = useState<Booking>({ ...booking });
    const [isEditingOpen, setIsEditingOpen] = useState<boolean>(false);

    const sideOption = useRef<Side>("left");

    const openEditingModal = (): void => {
        const weekDay = slotData.day.split(":")[0].trim();

        if (bookingViewType === BOOKING_VIEW_TYPE.DAY) {
            sideOption.current = "top";
        } else {
            switch (weekDay) {
                case "Mon":
                case "Sun":
                    sideOption.current = "right";
                    break;
                default:
                    sideOption.current = "left";
                    break;
            }
        }
        setIsEditingOpen(true);
    };

    const addTime = async (datetime: Date): Promise<void> => {
        try {
            // const updatedBooking = await patchBookingResize(bookingInit.id, {
            //     finishAt: newFinishDat,
            // });
            setBookingInit((prev) => ({
                ...prev,
                finishAt: datetime,
            }));
            // updatingBooking(updatedBooking);
            // setBookingInit(updatedBooking);
        } catch (error) {
            console.log(error);
        }
    };

    const addStartTime = async (datetime: Date): Promise<void> => {
        // isso funcionou, mas como todo o componente renderiza, está tirando o restando do drag.
        // estudar como fazer isso funcionar.

        // Desse modo nao vai funcinar por causa da atualização de todo o componente do calendário.
        optimisticCardUpdate(
            bookingInit,
            datetime,
            bookingInit.finishAt,
            slotData,
        );

        setBookingInit((prev) => ({
            ...prev,
            startAt: datetime,
        }));
    };

    const subTime = async (datetime: Date): Promise<void> => {
        try {
            setBookingInit((prev) => ({
                ...prev,
                finishAt: datetime,
            }));
            // const updatedBooking = await patchBookingSelfResize(
            //     bookingInit.id,
            //     {
            //         finishAt: newFinishDat,
            //     },
            // );

            // updatingBooking(updatedBooking);
            // setBookingInit(updatedBooking);
        } catch (error) {
            console.log(error);
        }
    };

    const { state, heightStyle, onResize } = useResizableCardHook({
        booking: bookingInit,
        onAddTime: addTime,
        onAddStartTime: addStartTime,
        onSubTime: subTime,
        starter: true,
    });

    // const onResizeStop = (
    //   event: SyntheticEvent,
    //   { size, handle }: ResizeCallbackData
    // ) => {
    //   const finalDiff = calculateFinalDiffResizable(Number(size.height));
    // };

    // const calculateFinalDiffResizable = (
    //   endSize: number
    // ): {
    //   type: 'add' | 'sub';
    //   diff: number;
    // } => {
    //   if (endSize > state.height) {
    //     return {
    //       type: 'add',
    //       diff: endSize - state.height,
    //     };
    //   } else {
    //     return {
    //       type: 'sub',
    //       diff: state.height - endSize,
    //     };
    //   }
    // };

    useImperativeHandle(
        ref,
        () => ({
            bookingId: booking.id,
        }),
        [booking.id],
    );

    return (
        <BookingInfoOptions
            booking={bookingInit}
            onOpenChange={setIsEditingOpen}
            side={bookingViewType === BOOKING_VIEW_TYPE.DAY ? "top" : "left"}
            isEditingOpen={isEditingOpen}
        >
            <CardContent
                resizableParam={{
                    state,
                    onResize,
                    resizeHandle: ["s"],
                }}
                customClasses={"Draggable"}
                bookingInit={bookingInit}
                bookingViewType={bookingViewType}
                slotData={slotData}
                heightStyle={heightStyle}
                onClick={openEditingModal}
                half={half}
                lastCard={lastCard}
                // style={ backgroundColor: "black" }
            />
        </BookingInfoOptions>
    );
};

export default Card;
