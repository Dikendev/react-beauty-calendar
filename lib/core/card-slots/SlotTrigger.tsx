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
import TimeInfo, { type TimeInfoRef } from "../slots/TimeInfo";
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
    actualTimerIndicatorChildren,
    children,
    ref,
}: SlotTriggerProps) => {
    const { isDragging, updateIsDragging } = useDragStore((state) => state);

    const bookingModal = useBookingModal();

    const { emptySlotNodes, setSelectedNode, resetSelectedNode } =
        useEmptySlotStore();

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

    const timeInfoRef = useRef<TimeInfoRef>(null);

    const showTimeInfo = () => {
        timeInfoRef.current?.show();
    };

    const hideTimeInfo = () => {
        timeInfoRef.current?.hide();
    };

    const changeIsOpen = (isOpen: boolean) => {
        timeInfoRef.current?.changeIsOpen(isOpen);
    };

    const bookingMock: Booking = useMemo(() => {
        return {
            id: "dragging_booking_preview",
            startAt: DateUtils.convertStringTimeToDateFormat(startAt),
            finishAt: DateUtils.convertStringTimeToDateFormat(finishAt),
        };
    }, [finishAt, startAt]);

    const { updateHeightStyle, heightStyle } = useResizableCardHook({
        booking: bookingMock,
    });

    const [renderEvent, setRenderEvent] = useState<boolean>(false);
    const [isOpenCustomModal, setIsOpenCustomModal] = useState(false);
    const [isDraggingOnClick, setIsDraggingOnClick] = useState<boolean>(false);

    const renderedCardPreviewRef = useRef<HTMLDivElement>(null);

    const onMouseEnterEvent = useCallback((): void => {
        if (!children || typeof children !== "object") return;

        if (
            "props" in children &&
            children.props &&
            typeof children.props === "object" &&
            "bookings" in children.props
        ) {
            if (
                Array.isArray(children.props.bookings) &&
                children.props?.bookings.length &&
                "slotData" in children.props
            ) {
                if (
                    typeof children?.props?.slotData === "object" &&
                    children?.props?.slotData &&
                    "hour" in children.props.slotData &&
                    typeof children.props.slotData.hour === "string" &&
                    "blockTimeString" in children.props &&
                    typeof children.props.blockTimeString === "string"
                ) {
                    const blockTime = children.props.blockTimeString;
                    const slotBlock = children.props.slotData.hour;
                    const bookings = children.props.bookings as Booking[];

                    const sameHour = bookings.findIndex((booking) => {
                        const slotHour = Number(slotBlock.split(":")[0]);
                        const slotMinutes = Number(blockTime);

                        const bookingHour = booking.startAt.getHours();
                        const bookingMinutes = booking.startAt.getMinutes();

                        const isSameHour = slotHour === bookingHour;
                        const isSameMinutes = slotMinutes === bookingMinutes;
                        if (isSameHour && isSameMinutes) return true;
                        return false;
                    });

                    if (sameHour !== -1) return;
                }
            }
        }

        if (isDragging || isOpenCustomModal || renderEvent) return;

        const result = events.onMouseEnterEvent();
        if (result === slotPosition) showTimeInfo();
    }, [
        slotPosition,
        isDragging,
        isOpenCustomModal,
        renderEvent,
        children,
        events,
    ]);

    const resetDataAndDragging = () => {
        resetForm();
        updateIsDragging(false);
        resetSelectedNode();
    };

    const onCloseCreationModal = (event?: React.MouseEvent): void => {
        resetDataAndDragging();

        const keyToFind = setEmptySlotKey(slotData);
        const slot = emptySlotNodes?.get(keyToFind);

        if (slot) slot.closeEvent();

        // user callback on close, using optional chain
        onModalClose?.();

        event?.stopPropagation();
        event?.preventDefault();
        setIsOpenCustomModal(false);
    };

    const onOpenChange = (status: boolean): void => {
        if (!status) onCloseCreationModal();
        setRenderEvent(status);
        changeIsOpen(status);
        setIsOpenCustomModal(status);
    };

    const openModal = useCallback(
        (finishAt?: string): void => {
            resetDataAndDragging();
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
            setIsOpenCustomModal(true);
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
        if (isDragging || isOpenCustomModal) return;
        hideTimeInfo();
    };

    const activeStyle =
        disabledCss.length || isDraggingOnClick
            ? disabledCss
            : "hovering_slotTrigger_core";

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
        setIsOpenCustomModal(true);
    };

    const resetPrevView = useCallback(() => {
        setIsDraggingOnClick(false);
    }, []);

    const prepareToShowModal = () => {
        hideTimeInfo();
        setIsOpenCustomModal(true);
        setRenderEvent(true);
    };

    useEffect(() => {
        if (isDragging) {
            document.body.style.cursor = "ns-resize";
        } else {
            document.body.style.cursor = "default";
        }
    }, [isDragging]);

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
        if (!renderEvent) {
            hideTimeInfo();
            return;
        }

        if (renderedCardPreviewRef?.current) {
            renderedCardPreviewRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [renderEvent]);

    useEffect(() => {
        if (!children) hideTimeInfo();
        if (isDraggingOnClick) showTimeInfo();
    }, [children, isDraggingOnClick]);

    useEffect(() => {
        if (isDraggingOnClick) {
            showTimeInfo();
        }
    }, [isDraggingOnClick]);

    useImperativeHandle(ref, () => ({
        showEvent: (time: string) => {
            updateStartAt(time);
            prepareToShowModal();
        },
        closeEvent: () => {
            setIsOpenCustomModal(false);
            setRenderEvent(false);
            hideTimeInfo();
            resetPrevView();
        },
        onOpenCloseChange: (status: boolean) => {
            changeIsOpen(status);
            setRenderEvent(status);
            resetPrevView();
        },
    }));

    return (
        <>
            <div
                ref={slotData.ref}
                key={slotData.key}
                style={{
                    borderBottom:
                        slotPosition === "fourth" ? "1px solid #8080807a" : "",
                    ...slotData.style,
                }}
                className={cn(
                    "slotTrigger_core",
                    bookingViewType === BOOKING_VIEW_TYPE.DAY &&
                        "slotTrigger_core_day",
                    activeStyle,
                )}
                onMouseOver={onMouseEnterEvent}
                onMouseLeave={handleOnMouseLeave}
                onFocus={() => {}}
            >
                <TimeInfo
                    ref={timeInfoRef}
                    isDragging={isDragging}
                    slotData={slotData}
                    events={{
                        onClick: openModal,
                        openOptions,
                        renderPreviewCard,
                        resetPrevView,
                    }}
                />

                {actualTimerIndicatorChildren}

                {renderEvent && (
                    <CardContent
                        ref={renderedCardPreviewRef}
                        bookingInit={bookingMock}
                        bookingViewType={bookingViewType}
                        slotData={{
                            day: new Date().toISOString(),
                            hour: "09:00",
                        }}
                        heightStyle={heightStyle}
                    />
                )}
                {children}
            </div>

            {isOpenCustomModal && (
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
