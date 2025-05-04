import {
    type CSSProperties,
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from "react";

import type { Booking } from "../../@types";
import CardContent from "./CardContent";

import { useGlobalStore, useNewEventStore } from "../../hooks";
import type { BlocksTimeStructure } from "./EmptySlot";

import { Resizable } from "react-resizable";

import useGlobalConfig from "../../hooks/useGlobalConfig";
import { cn } from "../../lib/utils";
import { DateUtils } from "../../utils/date-utils";
import type { BookingCardRef } from "../booking-card/BookingCard";
import useResizableCardHook from "./useResizableCardHook";

interface TimeInfoEvents {
    onClick: (finishAt?: string) => void;
    renderPreviewCard: () => void;
    openOptions: () => void;
    resetPrevView: () => void;
}

export interface TimeInfoRef {
    show: () => void;
    hide: () => void;
    changeIsOpen: (isOpen: boolean) => void;
}

interface TimeInfoProps {
    isDragging: boolean;
    slotData: BlocksTimeStructure;
    events: TimeInfoEvents;
}

const TimeInfo = forwardRef<TimeInfoRef, TimeInfoProps>(
    (
        {
            isDragging,
            slotData,
            events: { onClick, renderPreviewCard, resetPrevView },
        },
        ref,
    ) => {
        const [isOpen, setIsOpen] = useState<boolean>(false);

        const startAt = useNewEventStore((state) => state.startAt);

        const bookingViewType = useGlobalStore(
            (state) => state.bookingViewType,
        );

        const { systemColor, isTimeInfoVisible } = useGlobalConfig(
            (state) => state,
        );

        const [isResizing, setIsResizing] = useState<boolean>(false);

        const [finishAt, setFinishAt] = useState<string>(
            DateUtils.addMinutesToHour(slotData.time, 15),
        );

        const [isDraggingOnClick, setIsDraggingOnClick] =
            useState<boolean>(false);

        const cardContentRef = useRef<BookingCardRef>(null);

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
            setIsResizing(true);
            setIsDraggingOnClick(true);
            renderPreviewCard();
        };

        const mouseUp = () => {
            setIsResizing(false);
            onClick(finishAt);
            resetLocalStates();
        };

        useEffect(() => {
            if (isResizing) {
                cardContentRef.current?.changeCurrentCardResize();
            }
        }, [isResizing]);

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

        useImperativeHandle(
            ref,
            () => ({
                show: () => setIsOpen(true),
                hide: () => setIsOpen(false),
                changeIsOpen: (isOpen: boolean) => setIsOpen(isOpen),
            }),
            [],
        );

        if (!isOpen) return;

        return (
            <div
                style={{
                    ...withChildrenStyle,
                    border:
                        isTimeInfoVisible && !isDragging
                            ? `1.5px solid ${systemColor}`
                            : "none",
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
                                heightStyle={heightStyle}
                                cardContentRef={cardContentRef}
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
                                <span
                                    className="timeInfo_core_timeParent_time"
                                    style={{
                                        color: systemColor,
                                        display: isTimeInfoVisible
                                            ? "initial"
                                            : "none",
                                    }}
                                >
                                    {slotData.time}
                                </span>
                            )}
                        </div>
                    )}
                </Resizable>
            </div>
        );
    },
);

export default TimeInfo;
