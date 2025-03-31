import {
    type Ref,
    useCallback,
    useImperativeHandle,
    useRef,
    useState,
} from "react";

import {
    DndContext,
    type DragPendingEvent,
    useDndMonitor,
    useDraggable,
} from "@dnd-kit/core";

import type { Booking, BookingDateAndTime } from "../../@types/booking";

import { useGlobalStore } from "../../hooks";

import { BOOKING_VIEW_TYPE } from "../../constants";

import { cn } from "../../lib/utils";
import BookingInfoOptions, {
    type Side,
} from "../booking-options/BookingInfoOptions";
import CardContent from "./CardContent";
import CardOverlay from "./CardOverlay";
import useResizableCardHook from "./useResizableCardHook";

interface CardProps {
    booking: Booking;
    slotData: BookingDateAndTime;
    ref?: Ref<CardRef>;
}

export const INITIAL_HEIGHT = 600;
export const MIN_DIFF_TIME_THRESHOLD = 15;

export interface CardRef {
    bookingId: string;
}

const Card = ({ booking, slotData, ref }: CardProps) => {
    const { bookingViewType, optimisticCardUpdate } = useGlobalStore();

    const [bookingInit, setBookingInit] = useState<Booking>({ ...booking });

    const [isPending, setIsPending] = useState(false);
    const [pendingDelayMs, setPendingDelay] = useState(0);
    const [isEditingOpen, setIsEditingOpen] = useState<boolean>(false);

    const sideOption = useRef<Side>("left");

    const openEditingModal = () => {
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

    const { attributes, listeners, setNodeRef, isDragging, transform } =
        useDraggable({
            id: bookingInit.id,
            data: {
                type: "booking-slots",
                booking: bookingInit,
                slotData,
            },
        });

    const style = transform
        ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
          }
        : undefined;

    const handlePending = useCallback((event: DragPendingEvent) => {
        setIsPending(true);
        const { constraint } = event;

        if ("delay" in constraint) {
            setPendingDelay(constraint.delay);
        }
    }, []);

    const handlePendingEnd = useCallback(() => {
        setIsPending(false);
    }, []);

    useDndMonitor({
        onDragPending: (event) => handlePending(event),
        onDragAbort: () => handlePendingEnd(),
        onDragCancel: () => handlePendingEnd(),
        onDragEnd: () => handlePendingEnd(),
    });

    const pendingStyle: React.CSSProperties = isPending
        ? { animationDuration: `${pendingDelayMs}ms` }
        : {};

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
        <>
            {isDragging ? (
                <>
                    <CardOverlay
                        bookingInit={booking}
                        slotData={slotData}
                        heightStyle={`${heightStyle}rem`}
                    />
                    <div className="isDraggingCard">
                        <CardContent
                            bookingInit={bookingInit}
                            bookingViewType={bookingViewType}
                            slotData={slotData}
                            heightStyleTransformer={`${heightStyle}rem`}
                        />
                    </div>
                </>
            ) : (
                <DndContext>
                    <BookingInfoOptions
                        booking={bookingInit}
                        onOpenChange={setIsEditingOpen}
                        side={
                            bookingViewType === BOOKING_VIEW_TYPE.DAY
                                ? "top"
                                : "left"
                        }
                        isEditingOpen={isEditingOpen}
                    >
                        <CardContent
                            ref={setNodeRef}
                            resizableParam={{
                                state,
                                onResize,
                                resizeHandle: ["s"],
                            }}
                            customClasses={cn(
                                "Draggable",
                                isPending && "pendingDelay",
                            )}
                            bookingInit={bookingInit}
                            bookingViewType={bookingViewType}
                            slotData={slotData}
                            heightStyleTransformer={`${heightStyle}rem`}
                            onClick={openEditingModal}
                            pendingStyle={pendingStyle}
                            style={{ ...style, backgroundColor: "black" }}
                            listeners={listeners}
                            attributes={attributes}
                        />
                    </BookingInfoOptions>
                </DndContext>
            )}
        </>
    );
};

export default Card;
