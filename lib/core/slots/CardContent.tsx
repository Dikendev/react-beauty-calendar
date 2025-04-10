import {
    type CSSProperties,
    type Ref,
    type SyntheticEvent,
    useEffect,
    useState,
} from "react";

import { cn } from "../../lib/utils";

import type { Booking } from "../../@types";
import type { BookingDateAndTime } from "../../@types/booking";

import BookingCard from "../booking-card/BookingCard";

import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

import {
    Resizable,
    type ResizeCallbackData,
    type ResizeHandle,
} from "react-resizable";
import { BOOKING_VIEW_TYPE } from "../../constants";
import useDragStore from "../../context/drag/dragStore";

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
    heightStyleTransformer: string;
    listeners?: SyntheticListenerMap | undefined;
    attributes?: DraggableAttributes;
    onClick?: () => void;
    customClasses?: string;
    open?: boolean;
    resizableParam?: ResizableParam;
    events?: {
        onUnmount: () => void;
    };
    ref?: Ref<CardContentForward>;
}

type CardContentForward = HTMLDivElement;

const CardContent = ({
    bookingInit,
    slotData,
    heightStyleTransformer,
    onClick,
    customClasses,
    bookingViewType,
    resizableParam,
    events,
    open = true,
    ref,
}: CardContentProps) => {
    const [customClass, setCustomClass] = useState<string>("");

    const { updateIsDragging } = useDragStore((state) => state);

    const handleStyleCardContent: CSSProperties =
        bookingViewType === BOOKING_VIEW_TYPE.DAY
            ? { width: "99%" }
            : { width: "100%" };

    useEffect(() => {
        return () => {
            if (events?.onUnmount) events?.onUnmount();
        };
    }, []);

    const onResizableStart = (
        e: React.SyntheticEvent,
        data: ResizeCallbackData,
    ) => {
        setCustomClass("show-handle");
        updateIsDragging(true);

        if (resizableParam?.onResizeStart) {
            resizableParam.onResizeStart(e, data);
        }
    };

    const onResizableStop = (
        e: React.SyntheticEvent,
        data: ResizeCallbackData,
    ) => {
        setCustomClass("");
        updateIsDragging(false);

        if (resizableParam?.onResizeStop) {
            resizableParam.onResizeStop(e, data);
        }
    };

    if (!open && !bookingInit.finishAt) return null;

    if (resizableParam?.state?.height) {
        const { state, onResize } = resizableParam;

        return (
            <Resizable
                className={cn(
                    "cardContent_resizable",
                    resizableParam.customClass,
                    customClass,
                )}
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
                    style={{
                        display: "flex",
                        height: heightStyleTransformer,
                        zIndex: 99,
                    }}
                >
                    <BookingCard
                        key={bookingInit.id}
                        heightStyleTransformer={heightStyleTransformer}
                        booking={bookingInit}
                        slotData={slotData}
                        onClick={onClick}
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
                height: heightStyleTransformer,
                display: "flex",
                zIndex: 100,
                ...handleStyleCardContent,
            }}
        >
            <BookingCard
                heightStyleTransformer={heightStyleTransformer}
                customClasses={customClasses}
                booking={bookingInit}
                slotData={slotData}
                onClick={onClick}
            />
        </div>
    );
};

export default CardContent;
