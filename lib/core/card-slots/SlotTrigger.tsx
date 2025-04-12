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
import useResizableCardHook from "../slots/useResizableCardHook";

import useDragStore from "../../context/drag/dragStore";
import setEmptySlotKey from "../../context/emptySlotsStore.ts/emptySlotKey";
import useEmptySlotStore from "../../context/emptySlotsStore.ts/useEmptySlotStore";

import { useGlobalStore, useNewEventStore } from "../../hooks";
import useBookingModal from "../../hooks/use-booking-model";

import { DndContext } from "@dnd-kit/core";
import type { Booking } from "../../@types";

import { BOOKING_VIEW_TYPE } from "../../constants";
import { cn } from "../../lib/utils";
import { DateUtils } from "../../utils/date-utils";

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
    showEvent: (slotNode: string) => void;
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
    const { isDragging, updateIsDragging } = useDragStore((state) => state);

    const bookingModal = useBookingModal();

    const { emptySlotNodes, setSelectedNode } = useEmptySlotStore();
    const { onModalClose, onSlotClick } = useBookingModal();

    const {
        startAt,
        finishAt,
        updateDate,
        updateStartAt,
        updateFinishAtWithOffset,
        resetForm,
    } = useNewEventStore((state) => state);

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

    const onMouseEnterEvent = useCallback((): void => {
        if (isDragging || open) return;

        const result = events.onMouseEnterEvent();
        if (result === slotPosition) setShowTimeInfo(true);
    }, [slotPosition, events, isDragging, open]);

    const onCloseCreationModal = (event?: React.MouseEvent): void => {
        resetForm();
        updateIsDragging(false);

        const keyToFind = setEmptySlotKey(slotData);
        const slot = emptySlotNodes?.get(keyToFind);

        if (slot) slot.closeEvent();

        // user callback on close, using optional chain
        onModalClose?.();

        event?.stopPropagation();
        event?.preventDefault();
        setOpen(false);
    };

    const onOpenChange = (status: boolean): void => {
        if (!status) onCloseCreationModal();
        setRenderEvent(status);
        setShowTimeInfo(status);
        setOpen(status);
    };

    const openModal = useCallback(
        (finishAt?: string): void => {
            if (isDragging && !finishAt) return;

            updateIsDragging(false);
            const { time, key } = slotData;

            const keyToFind = setEmptySlotKey({ key, time });
            const slot = emptySlotNodes?.get(keyToFind);

            setSelectedNode(keyToFind);
            if (slot) slot.showEvent(time);

            updateDate(key);

            const increasingMinutes = finishAt ? 0 : 15;
            const updateFinishAtStarter = finishAt || time;

            const finishAtUpdated = updateFinishAtWithOffset(
                updateFinishAtStarter,
                increasingMinutes,
            );

            // User instance calendar callback
            onSlotClick({ slotData, finishTime: finishAtUpdated });
            setOpen(true);
        },
        [
            slotData,
            emptySlotNodes,
            isDragging,
            setSelectedNode,
            onSlotClick,
            updateDate,
            updateStartAt,
            updateIsDragging,
            updateFinishAtWithOffset,
        ],
    );

    const handleOnMouseLeave = (): void => {
        if (isDragging || open) return;
        setShowTimeInfo(false);
    };

    const activeStyle =
        disabledCss.length || isDraggingOnClick
            ? disabledCss
            : "hovering_slotTrigger_core";

    const borderStyle = border ? "slotTrigger_core_border" : "";

    const renderPreviewCard = useCallback(() => {
        const { time, key } = slotData;

        updateIsDragging(true);
        setIsDraggingOnClick(true);

        updateDate(key);
        updateStartAt(time);
        updateFinishAtWithOffset(time);
    }, [
        updateFinishAtWithOffset,
        slotData,
        updateDate,
        updateIsDragging,
        updateStartAt,
    ]);

    const openOptions = () => {
        setOpen(true);
    };

    const resetPrevView = useCallback(() => {
        setIsDraggingOnClick(false);
    }, []);

    // TODO: Improve this, are calling so many times.
    useEffect(() => {
        updateHeightStyle(finishMock, startMock);
    }, [finishMock, startMock, updateHeightStyle]);

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
        showEvent: (time: string) => {
            updateStartAt(time);
            setShowTimeInfo(false);
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

    return (
        <>
            <div
                ref={slotData.ref}
                key={slotData.key}
                style={slotData.style}
                className={cn(
                    "slotTrigger_core",
                    bookingViewType === BOOKING_VIEW_TYPE.DAY &&
                        "slotTrigger_core_day",
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
                        isDragging={isDragging}
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
                    <div style={{ width: "100%" }}>
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
                        side={
                            bookingViewType === BOOKING_VIEW_TYPE.DAY
                                ? "top"
                                : "right"
                        }
                    >
                        {bookingModal.createBookingModal}
                    </EventTabs>
                </DndContext>
            )}
        </>
    );
};

export default SlotTrigger;
