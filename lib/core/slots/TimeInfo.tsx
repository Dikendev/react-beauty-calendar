import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { Booking } from "../../@types";
import CardContent from "./CardContent";

import { useGlobalStore, useNewEventStore } from "../../hooks";
import type { BlocksTimeStructure } from "./EmptySlot";

import { Resizable } from "react-resizable";

import { cn } from "../../lib/utils";
import { DateUtils } from "../../utils/date-utils";
import useResizableCardHook from "./useResizableCardHook";

// import styles from "./Draggable.module.css";

interface TimeInfoEvents {
    onClick: (finishAt?: string) => void;
    renderPreviewCard: () => void;
    openOptions: () => void;
    resetPrevView: () => void;
}

interface TimeInfoProps {
    slotData: BlocksTimeStructure;
    events: TimeInfoEvents;
}

const TimeInfo = ({
    slotData,
    events: { onClick, renderPreviewCard, resetPrevView },
}: TimeInfoProps) => {
    const { startAt } = useNewEventStore((state) => state);

    const [counter, setCounter] = useState<number>(0);

    const [finishAt, setFinishAt] = useState<string>(
        DateUtils.addMinutesToHour(slotData.time, 15),
    );

    const [isDraggingOnClick, setIsDraggingOnClick] = useState<boolean>(false);

    const mouseClickPressTimeRef = useRef<NodeJS.Timeout>(null);

    useEffect(() => {
        if (counter === 0) return;

        if (counter > 20) {
            setIsDraggingOnClick(true);
            renderPreviewCard();
        }
    }, [counter, renderPreviewCard]);

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
        if (mouseClickPressTimeRef.current) return;

        mouseClickPressTimeRef.current = setInterval(() => {
            setCounter((prev) => prev + 1);
        }, 10);
    };

    const stopCounter = useCallback(() => {
        if (!mouseClickPressTimeRef.current) return;

        setCounter(0);
        clearInterval(mouseClickPressTimeRef.current);
        mouseClickPressTimeRef.current = null;
    }, []);

    const mouseUp = () => {
        if (counter < 20) {
            onClick();
            stopCounter();
            resetLocalStates();
        } else {
            stopCounter();

            onClick(finishAt);
            resetLocalStates();
        }
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

    useEffect(() => {
        updateHeightStyle(finishMock, startMock);
    }, [finishMock, startMock, updateHeightStyle]);

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

    // TODO: avaliar esse aviso aqui.
    useEffect(() => {
        return () => {
            stopCounter();
            resetLocalStates();
        };
    }, []);

    const bookingViewType = useGlobalStore((state) => state.bookingViewType);
    const withChildrenStyle = isDraggingOnClick ? "bg-white border-none" : "";

    return (
        <div
            className={cn(
                "w-full bg-red-300 h-full z-[-1] content-center border-solid border-[1px] border-black rounded-sm cursor-default",
                withChildrenStyle,
            )}
        >
            <Resizable
                className="slot-resizable "
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
                    <div style={{ height: "100%", alignContent: "center" }}>
                        <CardContent
                            customClasses="dragging-effect"
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
                    <div className="rounded-sm w-full h-full content-center relative">
                        <span className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                            {slotData.time}
                        </span>
                    </div>
                )}
            </Resizable>
        </div>
    );
};

export default TimeInfo;
