import {
    type CSSProperties,
    type MouseEvent,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from "react";

import { cn } from "../../lib/utils";

import {
    Resizable,
    type ResizeCallbackData,
    type ResizeHandle,
} from "react-resizable";

import useDragStore from "../../context/drag/dragStore";
import useEmptySlotStore from "../../context/emptySlotsStore/useEmptySlotStore";

import { useShallow } from "zustand/shallow";

import { BOOKING_VIEW_TYPE, DAY_TIME_STARTER } from "../../constants";

import type { BookingCardRef } from "../../utils/forward";
import type { CardContentProps } from "../../utils/props";

import type { Booking } from "../../@types";
import { useBookingModal } from "../../hooks";
import { bookingUtils } from "../../utils/booking.utils";

import buildEmptyTimeSlotKey from "../../context/emptySlotsStore/emptySlotKey";
import { dateUtils } from "../../utils";
import BookingCard from "../booking-card/BookingCard";
import BookingCardContent from "../booking-card/BookingCardContent";
import { InnerCardsHandle } from "./innerCardHandle/inner-card-handle";

const CardContent = ({
    bookingInit,
    slotData,
    heightStyle,
    topHeightIncrement,
    customClasses,
    bookingViewType,
    resizableParam,
    events,
    open = true,
    lastCard,
    half,
    cardContentRef: dataRef,
    cardsQuantity,
    cardIndex,
    hoveringAdditionalCardId,
    ref,
}: CardContentProps) => {
    const updateIsDragging = useDragStore(
        useShallow((state) => state.updateIsDragging),
    );

    const { emptySlotNodes } = useEmptySlotStore();

    const { bookings, onCardResizeEnd: onCardResizeEndCallback } =
        useBookingModal();

    const [customClass, setCustomClass] = useState<string>("");
    const bookingCardRef = useRef<BookingCardRef>(null);

    const handleStyleCardContent: CSSProperties = useMemo(() => {
        return bookingViewType === BOOKING_VIEW_TYPE.DAY
            ? { width: "99%" }
            : { width: "100%" };
    }, [bookingViewType]);

    const onResizableStart = (
        e: React.SyntheticEvent,
        data: ResizeCallbackData,
    ) => {
        onResizeEvent("show-handle", true);

        if (resizableParam?.onResizeStart) {
            resizableParam.onResizeStart(e, data);
        }

        bookingCardRef.current?.changeCurrentCardResize();
    };

    const onResizeEvent = (customClass = "", isDragging = false) => {
        setCustomClass(customClass);
        updateIsDragging(isDragging);
    };

    const onResizableStop = (
        e: React.SyntheticEvent,
        data: ResizeCallbackData,
    ) => {
        bookingCardRef.current?.changeCurrentCardResize();
        onResizeEvent();

        if (data.handle.includes("n")) {
            onCardResizeEndCallback(
                bookingUtils.resizeBookingNorthId(bookingInit),
            );
        }

        if (data.handle.includes("s")) {
            onCardResizeEndCallback(
                bookingUtils.resizeBookingSouthId(bookingInit),
            );
        }

        if (resizableParam?.onResizeStop) resizableParam.onResizeStop(e, data);
    };

    const layerCount = useMemo((): number => {
        return InnerCardsHandle.calculateOverlappingBookings(
            bookingInit,
            bookings,
        );
    }, [bookingInit, bookings]);

    const getResizableClassNames = useMemo(() => {
        return cn(
            resizableParam?.customClass,
            customClass,
            half && layerCount > 0 && "",
            half ? "" : layerCount > 0 && "inner_cards_parent",
            lastCard &&
                layerCount &&
                half &&
                "inner_cards_parent_last_card_disable",
            lastCard && layerCount && "inner_cards_parent_last_card",
            lastCard &&
                layerCount === 2 &&
                "inner_cards_parent_last_card_layer_2",
            layerCount === 1 && !half && "inner_cards_parent_1_layer",
            layerCount === 2 && "inner_cards_parent_2_layer",
            half &&
                layerCount === 3 &&
                "inner_cards_parent_resizable_layer_3_half inner_cards_parent_3_layer_half",
            layerCount === 3 &&
                "inner_cards_parent_resizable_layer_3 inner_cards_parent_3_layer",
        );
    }, [resizableParam, customClass, half, layerCount, lastCard]);

    const rightSide = (cardIndex: number): string => {
        if (cardIndex === 0) return "8rem";
        return "4rem";
    };

    const rightMovement = useMemo((): string | number => {
        if (half && cardIndex === 0 && cardsQuantity === 3) {
            return rightSide(cardIndex);
        }
        if (half && cardIndex === 1 && cardsQuantity === 3) {
            return rightSide(cardIndex);
        }
        if (layerCount === 2) return "0.8rem";
        if (lastCard && layerCount === 1) return "0.2rem";
        if (lastCard && layerCount) return "1rem";
        if (layerCount === 1) return "0.4rem";
        return 0;
    }, [half, lastCard, layerCount, cardIndex, cardsQuantity]);

    const halfCardLastBooking = useMemo((): string | number => {
        if (half && cardIndex === 0 && cardsQuantity === 3 && !layerCount) {
            return "0rem";
        }
        if (half && cardIndex === 0 && cardsQuantity === 3) return "0.4rem";
        if (half && cardIndex === 1 && cardsQuantity === 3) return "5rem";
        if (lastCard && cardsQuantity === 3) return "9rem";
        if (lastCard) return "6.5rem";
        return 0;
    }, [half, lastCard, cardIndex, layerCount, cardsQuantity]);

    const insetCardHeight: CSSProperties = useMemo(() => {
        if (
            (half &&
                cardsQuantity === 3 &&
                ((half && cardIndex === 0) || (half && cardIndex === 1))) ||
            (half && lastCard && cardsQuantity === 3) ||
            (half && lastCard)
        ) {
            return {
                inset: `${topHeightIncrement}rem ${rightMovement} ${heightStyle}rem ${halfCardLastBooking}`,
            };
        }

        if ((half && cardsQuantity === 3) || half) {
            return {
                inset: `${topHeightIncrement}rem 6.5rem ${heightStyle}rem ${rightMovement}`,
            };
        }

        return {
            inset: `${topHeightIncrement || 0}rem ${rightMovement} ${heightStyle}rem`,
        };
    }, [
        half,
        layerCount,
        heightStyle,
        topHeightIncrement,
        cardIndex,
        cardsQuantity,
        rightMovement,
        halfCardLastBooking,
    ]);

    const hoveringAdditionalCard = (
        booking: Booking,
        emptySlotId: string,
    ): void => {
        const emptySlotNode = emptySlotNodes.get(emptySlotId);
        emptySlotNode?.hoveringAdditionalCard(booking.id);
    };

    const clearingAdditionalCard = (emptySlotId: string): void => {
        const emptySlotNode = emptySlotNodes.get(emptySlotId);
        emptySlotNode?.clearHoveringCard();
    };

    const processSlotEvent = (emptySlotId: string, eventType: string): void => {
        const eventHandlers: Record<string, () => void> = {
            mouseenter: () => hoveringAdditionalCard(bookingInit, emptySlotId),
            mouseleave: () => clearingAdditionalCard(emptySlotId),
        };

        const handler =
            eventHandlers[eventType] ||
            (() => console.warn(`Unhandled event type: ${eventType}`));

        handler();
    };

    const getEmptySlotKey = (finishAt: Date) => {
        const nextKeyDay = finishAt.toDateString();

        return buildEmptyTimeSlotKey({
            key: nextKeyDay,
            time: DAY_TIME_STARTER,
        });
    };

    const dispatchEventsForDaysDifference = (eventType: string): void => {
        const daysDifference = dateUtils.calculateDaysDifference(
            bookingInit.finishAt,
            bookingInit.startAt,
        );

        if (daysDifference === 1) {
            processSlotEvent(getEmptySlotKey(bookingInit.finishAt), eventType);
            return;
        }

        const futureDateList = dateUtils.buildFutureDateList(
            bookingInit,
            daysDifference,
        );

        for (const dateList of futureDateList) {
            processSlotEvent(getEmptySlotKey(dateList), eventType);
        }
    };

    const handleOnHoverEvent = (event: MouseEvent<HTMLDivElement>): void => {
        const eventType = event.type;

        if (bookingInit?.nodes) {
            for (const node of bookingInit.nodes) {
                processSlotEvent(node, eventType);
            }
        }

        dispatchEventsForDaysDifference(eventType);
    };

    useEffect(() => {
        return () => {
            if (events?.onUnmount) events.onUnmount();
        };
    }, []);

    useImperativeHandle(dataRef, () => ({
        changeCurrentCardResize: () => {
            bookingCardRef.current?.changeCurrentCardResize();
        },
    }));

    if (!open && !bookingInit.finishAt) return null;

    if (resizableParam?.state?.height) {
        const { state, onResize, resizeHandle = ["s", "n"] } = resizableParam;

        const resizeHandleSet = (): ResizeHandle[] => {
            switch (bookingInit?.disabledResize) {
                case "full": {
                    return [];
                }
                case "half": {
                    return ["s"];
                }
                default: {
                    return resizeHandle;
                }
            }
        };

        return (
            <Resizable
                className={cn(getResizableClassNames)}
                height={state?.height}
                width={state?.width}
                onResize={onResize}
                onResizeStart={onResizableStart}
                onResizeStop={onResizableStop}
                resizeHandles={resizeHandleSet()}
                draggableOpts={{ grid: [35, 35] }}
                handleSize={[20, 20]}
                maxConstraints={[
                    Number.POSITIVE_INFINITY,
                    Number.POSITIVE_INFINITY,
                ]}
                transformScale={1}
            >
                <div
                    className="card_content_core"
                    style={{
                        ...insetCardHeight,
                    }}
                    onMouseEnter={handleOnHoverEvent}
                    onMouseLeave={handleOnHoverEvent}
                    onBlur={() => {}}
                >
                    <BookingCard
                        ref={bookingCardRef}
                        key={bookingInit.id}
                        booking={bookingInit}
                        slotData={slotData}
                        layerCount={layerCount}
                        half={half}
                        hoveringAdditionalCardId={hoveringAdditionalCardId}
                    >
                        <BookingCardContent
                            booking={bookingInit}
                            slotData={slotData}
                            events={{ onClick: events?.onClick }}
                        />
                    </BookingCard>
                </div>
            </Resizable>
        );
    }

    // After card drag render this card.
    return (
        <div
            ref={ref}
            className="card_content_core"
            style={{
                ...handleStyleCardContent,
                ...insetCardHeight,
            }}
        >
            <BookingCard
                customClasses={customClasses}
                booking={bookingInit}
                slotData={slotData}
            >
                <BookingCardContent
                    booking={bookingInit}
                    slotData={slotData}
                    events={{ onClick: events?.onClick }}
                />
            </BookingCard>
        </div>
    );
};

export default CardContent;
