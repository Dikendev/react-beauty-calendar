import {
    type CSSProperties,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import type { Booking } from "../../@types";
import CardContent from "./CardContent";

import { useGlobalStore, useNewEventStore } from "../../hooks";
import type { BlocksTimeStructure } from "./EmptySlot";

import { Resizable } from "react-resizable";

import { cn } from "../../lib/utils";
import { DateUtils } from "../../utils/date-utils";
import useResizableCardHook from "./useResizableCardHook";

interface TimeInfoEvents {
    onClick: (finishAt?: string) => void;
    renderPreviewCard: () => void;
    openOptions: () => void;
    resetPrevView: () => void;
}

interface TimeInfoProps {
    isDragging: boolean;
    slotData: BlocksTimeStructure;
    events: TimeInfoEvents;
}

const TimeInfo = ({
    isDragging,
    slotData,
    events: { onClick, renderPreviewCard, resetPrevView },
}: TimeInfoProps) => {
    const startAt = useNewEventStore((state) => state.startAt);
    const bookingViewType = useGlobalStore((state) => state.bookingViewType);

    const [finishAt, setFinishAt] = useState<string>(
        DateUtils.addMinutesToHour(slotData.time, 15),
    );
    const [isDraggingOnClick, setIsDraggingOnClick] = useState<boolean>(false);

    const withChildrenStyle: CSSProperties = isDraggingOnClick
        ? { backgroundColor: "white", border: "none" }
        : {};

    const bookingPreview: Booking = useMemo(() => {
        return {
            id: "dragging_booking_preview",
            startAt: DateUtils.convertStringTimeToDateFormat(startAt),
            finishAt: DateUtils.convertStringTimeToDateFormat(finishAt),
        };
    }, [finishAt, startAt]);

    const startCounter = () => {
        setIsDraggingOnClick(true);
        renderPreviewCard();
    };

    const mouseUp = () => {
        onClick(finishAt);
        resetLocalStates();
    };

    const {
        state,
        resetState,
        resetHeightStyle,
        heightStyle,
        onResize,
        updateHeightStyle,
    } = useResizableCardHook({
        booking: bookingPreview,
        onAddTime: (dateTime) => {
            setFinishAt(DateUtils.dateTimeAsString(dateTime));
        },
        onSubTime: (dateTime) => {
            setFinishAt(DateUtils.dateTimeAsString(dateTime));
        },
    });

    const onUnmountCardContent = () => {
        resetLocalStates();
    };

    const resetFinishAt = useCallback(() => {
        setFinishAt(DateUtils.addMinutesToHour(slotData.time, 15));
    }, [slotData.time]);

    const resetLocalStates = useCallback(() => {
        setIsDraggingOnClick(false);
        resetState();
        resetFinishAt();
        resetHeightStyle();
        resetPrevView();
    }, [resetFinishAt, resetHeightStyle, resetPrevView, resetState]);

    useEffect(() => {
        if (!finishAt || !startAt) return;

        const finishAtConverted =
            DateUtils.convertStringTimeToDateFormat(finishAt);
        const startAtConverted =
            DateUtils.convertStringTimeToDateFormat(startAt);

        if (
            Number.isNaN(finishAtConverted) ||
            Number.isNaN(startAtConverted) ||
            !(finishAtConverted instanceof Date) ||
            !(startAtConverted instanceof Date)
        ) {
            return;
        }

        updateHeightStyle(finishAtConverted, startAtConverted);
    }, [finishAt, startAt]);

    useEffect(() => {
        return () => {
            resetLocalStates();
        };
    }, []);

    return (
        <div
            style={{
                ...withChildrenStyle,
            }}
            className={cn("timeInfo_core", withChildrenStyle)}
        >
            <Resizable
                className="slot-resizable"
                height={state.height}
                width={state.width}
                onResizeStart={startCounter}
                onResizeStop={mouseUp}
                onResize={onResize}
                resizeHandles={["se"]}
                draggableOpts={{ grid: [35, 35] }}
                handleSize={[30, 30]}
                maxConstraints={[
                    Number.POSITIVE_INFINITY,
                    Number.POSITIVE_INFINITY,
                ]}
                transformScale={1}
            >
                {isDraggingOnClick ? (
                    <div className="timeInfo_core_dragging">
                        <CardContent
                            bookingInit={bookingPreview}
                            bookingViewType={bookingViewType}
                            slotData={{
                                day: new Date().toISOString(),
                                hour: "09:00",
                            }}
                            heightStyleTransformer={`${heightStyle}rem`}
                            resizableParam={{
                                state,
                                onResize,
                                customClass: "show-handle",
                            }}
                            events={{ onUnmount: onUnmountCardContent }}
                        />
                    </div>
                ) : (
                    <div className="timeInfo_core_timeParent">
                        {!isDragging && (
                            <span className="timeInfo_core_timeParent_time">
                                {slotData.time}
                            </span>
                        )}
                    </div>
                )}
            </Resizable>
        </div>
    );
};

export default TimeInfo;
