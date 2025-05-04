import {
    type CSSProperties,
    type Ref,
    type SyntheticEvent,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from "react";

import { cn } from "../../lib/utils";

import type { Booking } from "../../@types";
import type { BookingDateAndTime } from "../../@types/booking";

import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

import {
    Resizable,
    type ResizeCallbackData,
    type ResizeHandle,
} from "react-resizable";

import { BOOKING_VIEW_TYPE } from "../../constants";

import useDragStore from "../../context/drag/dragStore";
import useBookingModal from "../../hooks/use-booking-model";

import BookingCard, { type BookingCardRef } from "../booking-card/BookingCard";
import { InnerCardsHandle } from "./innerCardHandle/inner-card-handle";

interface ResizableState {
    height: number;
    width: number;
}
export interface ResizableParam {
    state: ResizableState;
    customClass?: string;
    onResize: (
        event: SyntheticEvent<Element, Event>,
        args_1: ResizeCallbackData,
    ) => void;
    onResizeStart?: (e: React.SyntheticEvent, data: ResizeCallbackData) => void;
    onResizeStop?: (e: React.SyntheticEvent, data: ResizeCallbackData) => void;
    resizeHandle?: ResizeHandle[];
}

interface CardContentProps {
    bookingInit: Booking;
    bookingViewType: string;
    slotData: BookingDateAndTime;
    heightStyle: number;
    listeners?: SyntheticListenerMap | undefined;
    attributes?: DraggableAttributes;
    onClick?: () => void;
    customClasses?: string;
    open?: boolean;
    lastCard?: boolean;
    half?: boolean;
    resizableParam?: ResizableParam;
    events?: {
        onUnmount: () => void;
    };
    cardContentRef?: Ref<BookingCardRef>;
    ref?: Ref<CardContentForward>;
}

type CardContentForward = HTMLDivElement;

const CardContent = ({
    bookingInit,
    slotData,
    heightStyle,
    onClick,
    customClasses,
    bookingViewType,
    resizableParam,
    events,
    open = true,
    lastCard,
    half,
    cardContentRef: dataRef,
    ref,
}: CardContentProps) => {
    const updateIsDragging = useDragStore((state) => state.updateIsDragging);
    const { bookings } = useBookingModal();

    const [customClass, setCustomClass] = useState<string>("");
    const bookingCardRef = useRef<BookingCardRef>(null);

    const handleStyleCardContent: CSSProperties =
        bookingViewType === BOOKING_VIEW_TYPE.DAY
            ? { width: "99%" }
            : { width: "100%" };

    const onResizableStart = (
        e: React.SyntheticEvent,
        data: ResizeCallbackData,
    ) => {
        setCustomClass("show-handle");
        updateIsDragging(true);

        if (resizableParam?.onResizeStart) {
            resizableParam.onResizeStart(e, data);
        }

        bookingCardRef.current?.changeCurrentCardResize();
    };

    const onResizableStop = (
        e: React.SyntheticEvent,
        data: ResizeCallbackData,
    ) => {
        bookingCardRef.current?.changeCurrentCardResize();
        setCustomClass("");
        updateIsDragging(false);

        if (resizableParam?.onResizeStop) {
            resizableParam.onResizeStop(e, data);
        }
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
            lastCard && layerCount && "inner_cards_parent_last_card",
            lastCard &&
                layerCount === 2 &&
                "inner_cards_parent_last_card_layer_2",
            layerCount === 1 &&
                "inner_cards_parent_resizable inner_cards_parent_1_layer",
            layerCount === 2 &&
                "inner_cards_parent_resizable_layer_2 inner_cards_parent_2_layer",
            half &&
                layerCount === 3 &&
                "inner_cards_parent_resizable_layer_3_half inner_cards_parent_3_layer_half",
            layerCount === 3 &&
                "inner_cards_parent_resizable_layer_3 inner_cards_parent_3_layer",
        );
    }, [resizableParam, customClass, half, layerCount, lastCard]);

    const insetCardHeight: CSSProperties = useMemo(() => {
        return { inset: `0rem 0 ${heightStyle}rem` };
    }, [heightStyle]);

    useEffect(() => {
        return () => {
            if (events?.onUnmount) events?.onUnmount();
        };
    }, []);

    useImperativeHandle(dataRef, () => ({
        changeCurrentCardResize: () => {
            bookingCardRef.current?.changeCurrentCardResize();
        },
    }));

    if (!open && !bookingInit.finishAt) return null;

    if (resizableParam?.state?.height) {
        const { state, onResize } = resizableParam;

        return (
            <Resizable
                className={cn(getResizableClassNames)}
                height={state?.height}
                width={state?.width}
                onResize={onResize}
                onResizeStart={onResizableStart}
                onResizeStop={onResizableStop}
                resizeHandles={["s"]}
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
                >
                    <BookingCard
                        ref={bookingCardRef}
                        key={bookingInit.id}
                        heightStyle={heightStyle}
                        booking={bookingInit}
                        slotData={slotData}
                        onClick={onClick}
                        layerCount={layerCount}
                        half={half}
                    />
                </div>
            </Resizable>
        );
    }

    // After card drag render this card.
    return (
        <div
            ref={ref}
            style={{
                display: "flex",
                zIndex: 100,
                ...handleStyleCardContent,
            }}
        >
            <BookingCard
                heightStyle={heightStyle}
                customClasses={customClasses}
                booking={bookingInit}
                slotData={slotData}
                onClick={onClick}
            />
        </div>
    );
};

export default CardContent;
