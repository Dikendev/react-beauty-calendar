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

    const startMock = useMemo((): Date => {
        return DateUtils.convertStringTimeToDateFormat(startAt);
    }, [startAt]);

    const finishMock = useMemo((): Date => {
        return DateUtils.convertStringTimeToDateFormat(finishAt);
    }, [finishAt]);

    const bookingMock: Booking = useMemo(() => {
        return {
            id: "",
            client: {
                id: "",
                profile: {
                    id: "",
                    name: "",
                },
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            user: {
                id: "",
                profile: {
                    id: "",
                    name: "",
                },
                roles: [],
                proLaborePercent: 0,
                updatedAt: new Date(),
                createdAt: new Date(),
            },
            procedures: [],
            payment: {
                type: "CREDIT_CARD",
                status: "PENDING",
                total: 0,
            },
            observation: "",
            startAt: startMock,
            finishAt: finishMock,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }, [finishMock, startMock]);

    const startCounter = () => {
        setIsDraggingOnClick(true);
        renderPreviewCard();
    };

    const mouseUp = () => {
        onClick(finishAt);
        resetLocalStates();
    };

    const addTime = async (dateTime: Date): Promise<void> => {
        setFinishAt(DateUtils.dateTimeAsString(dateTime));
    };

    const subTime = async (dateTime: Date): Promise<void> => {
        setFinishAt(DateUtils.dateTimeAsString(dateTime));
    };

    const {
        state,
        resetState,
        resetHeightStyle,
        heightStyle,
        onResize,
        updateHeightStyle,
    } = useResizableCardHook({
        booking: bookingMock,
        onAddTime: addTime,
        onSubTime: subTime,
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
        updateHeightStyle(finishMock, startMock);
    }, [finishMock, startMock, updateHeightStyle]);

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
                            bookingInit={bookingMock}
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
