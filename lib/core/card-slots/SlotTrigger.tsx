import {
    type ReactNode,
    type Ref,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from "react";

import CardContent from "../slots/CardContent";
import type { BlocksTimeStructure } from "../slots/EmptySlot";
import EventTabs from "../slots/EventsTab";
import type { TimesBlock } from "../slots/Slots";
import TimeInfo from "../slots/TimeInfo";

import useDragStore from "../../context/drag/dragStore";
import setEmptySlotKey from "../../context/emptySlotsStore.ts/emptySlotKey";
import useEmptySlotStore from "../../context/emptySlotsStore.ts/useEmptySlotStore";
import { useGlobalStore, useNewEventStore } from "../../hooks";

import { DndContext } from "@dnd-kit/core";
import type { Booking } from "../../@types";

import useBookingModal from "../../hooks/use-booking-model";
import { cn } from "../../lib/utils";
import { DateUtils } from "../../utils/date-utils";
import useResizableCardHook from "../slots/useResizableCardHook";

interface SlotEvents {
    onMouseEnterEvent: () => string;
}

interface SlotTriggerProps {
    slotData: BlocksTimeStructure;
    slotPosition: TimesBlock;
    disabledCss: string;
    events: SlotEvents;
    border?: boolean;
    children?: ReactNode;
    actualTimerIndicatorChildren?: ReactNode;
    ref: Ref<SlotTriggerForwardRef>;
}

export interface SlotTriggerForwardRef {
    showEvent: () => void;
    closeEvent: () => void;
    onOpenCloseChange: (status: boolean) => void;
}

const SlotTrigger = ({
    slotData,
    slotPosition,
    disabledCss,
    events,
    border,
    actualTimerIndicatorChildren,
    children,
    ref,
}: SlotTriggerProps) => {
    const { updateIsDelayActive, isDragging, updateIsDragging } = useDragStore(
        (state) => state,
    );

    const { emptySlotNodes, setSelectedNode } = useEmptySlotStore();

    const { onModalClose, onSlotClick } = useBookingModal();

    const { finishAt, startAt, updateStartAt, updateFinishAt, updateDate } =
        useNewEventStore((state) => state);

    const bookingViewType = useGlobalStore((state) => state.bookingViewType);

    const startMock = useMemo(() => {
        return DateUtils.convertStringTimeToDateFormat(startAt);
    }, [startAt]);

    const finishMock = useMemo(() => {
        return DateUtils.convertStringTimeToDateFormat(finishAt);
    }, [finishAt]);

    const bookingMock: Booking = useMemo(() => {
        const newFinishAt = DateUtils.convertStringTimeToDateFormat(finishAt);
        const newStartAt = DateUtils.convertStringTimeToDateFormat(startAt);

        return {
            id: "3",
            startAt: newStartAt,
            finishAt: newFinishAt,
        };
    }, [finishAt, startAt]);

    const { updateHeightStyle, heightStyle } = useResizableCardHook({
        booking: bookingMock,
    });

    const [renderEvent, setRenderEvent] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const [showTimeInfo, setShowTimeInfo] = useState<boolean>(false);
    const [isDraggingOnClick, setIsDraggingOnClick] = useState<boolean>(false);

    const renderedCardPreviewRef = useRef<HTMLDivElement>(null);

    // isso está muito errado. melhorar. está chamando toda hora. sem necessidade.
    useEffect(() => {
        updateHeightStyle(finishMock, startMock);
    }, [finishMock, startMock, updateHeightStyle]);

    const onMouseEnterEvent = useCallback((): void => {
        if (isDragging || open) return;

        const result = events.onMouseEnterEvent();
        if (result === slotPosition) setShowTimeInfo(true);
    }, [slotPosition, events, isDragging, open]);

    const onCloseCreationModal = (event: React.MouseEvent): void => {
        updateIsDragging(false);
        updateIsDelayActive(true);

        const keyToFind = setEmptySlotKey(slotData);
        const slot = emptySlotNodes?.get(keyToFind);

        if (slot) slot.closeEvent();

        // user callback on close, using optional chain
        onModalClose?.();

        event.stopPropagation();
        event.preventDefault();
        setOpen(false);
    };

    const onOpenChange = (status: boolean): void => {
        updateIsDelayActive(true);
        setRenderEvent(status);
        setShowTimeInfo(status);
        setOpen(status);
    };

    const formUpdateFinishAt = useCallback(
        (time: string, increasingMinutes = 15) => {
            const convertDateToString = DateUtils.addMinutesToHour(
                time,
                increasingMinutes,
            );
            updateFinishAt(convertDateToString);
        },
        [updateFinishAt],
    );

    const openModal = useCallback(
        (finishAt?: string): void => {
            if (isDragging && !finishAt) return;

            updateIsDragging(false);
            const { time, key } = slotData;

            // User instance calendar callback call
            onSlotClick({ time, key });
            const keyToFind = setEmptySlotKey({ key, time });
            const slot = emptySlotNodes?.get(keyToFind);

            setSelectedNode(keyToFind);
            if (slot) slot.showEvent();

            updateDate(key);
            updateStartAt(time);

            const increasingMinutes = finishAt ? 0 : 15;
            const updateFinishAtStarter = finishAt || time;

            formUpdateFinishAt(updateFinishAtStarter, increasingMinutes);
            setOpen(true);
        },
        [
            slotData,
            updateDate,
            updateStartAt,
            formUpdateFinishAt,
            emptySlotNodes,
            isDragging,
            setSelectedNode,
            updateIsDragging,
            onSlotClick,
        ],
    );

    const handleOnMouseLeave = (): void => {
        if (isDragging || open) return;
        setShowTimeInfo(false);
    };

    const activeStyle =
        disabledCss.length || isDraggingOnClick
            ? disabledCss
            : "hover:bg-white-50";

    const borderStyle = border ? "border-b border-solid" : "";

    const renderPreviewCard = useCallback(() => {
        const { time, key } = slotData;

        updateIsDragging(true);
        setIsDraggingOnClick(true);

        updateDate(key);
        updateStartAt(time);
        formUpdateFinishAt(time);
    }, [
        formUpdateFinishAt,
        slotData,
        updateDate,
        updateIsDragging,
        updateStartAt,
    ]);

    const openOptions = () => {
        setOpen(true);
    };

    useEffect(() => {
        if (!renderEvent) return;

        if (renderedCardPreviewRef?.current) {
            renderedCardPreviewRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [renderEvent]);

    useEffect(() => {
        if (!children) setShowTimeInfo(false);
    }, [children]);

    useImperativeHandle(ref, () => ({
        showEvent: () => {
            setShowTimeInfo(false);
            updateIsDelayActive(false);
            setOpen(true);
            setRenderEvent(true);
        },
        closeEvent: () => {
            setOpen(false);
            setRenderEvent(false);
            setShowTimeInfo(false);
            resetPrevView();
        },
        onOpenCloseChange: (status: boolean) => {
            setShowTimeInfo(status);
            setRenderEvent(status);
            resetPrevView();
        },
    }));

    const resetPrevView = useCallback(() => {
        setIsDraggingOnClick(false);
    }, []);

    return (
        <>
            <div
                ref={slotData.ref}
                key={slotData.key}
                style={slotData.style}
                className={cn(
                    "min-w-[1rem] h-[2rem] relative",
                    borderStyle,
                    activeStyle,
                )}
                onMouseOver={onMouseEnterEvent}
                onMouseLeave={handleOnMouseLeave}
                onFocus={() => {}}
            >
                {actualTimerIndicatorChildren}

                {((!children && showTimeInfo && !renderEvent) ||
                    isDraggingOnClick) && (
                    <TimeInfo
                        slotData={slotData}
                        events={{
                            onClick: openModal,
                            openOptions,
                            renderPreviewCard,
                            resetPrevView,
                        }}
                    />
                )}

                {renderEvent && (
                    <div className="w-full">
                        <CardContent
                            ref={renderedCardPreviewRef}
                            bookingInit={bookingMock}
                            bookingViewType={bookingViewType}
                            slotData={{
                                day: new Date().toISOString(),
                                hour: "09:00",
                            }}
                            heightStyleTransformer={`${heightStyle}rem`}
                        />
                    </div>
                )}
                {children}
            </div>

            {open && (
                <DndContext>
                    <EventTabs
                        onClose={onCloseCreationModal}
                        onOpenChange={onOpenChange}
                        buttonTrigger={<div key={slotData.key} />}
                    />
                </DndContext>
            )}
        </>
    );
};

export default SlotTrigger;
