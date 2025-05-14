import {
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from "react";

import BookingCreate, {
    type BookingCreateRef,
} from "../booking-create/BookingCreate";
import CardBlockContent from "../slots/CardBlockContent";
import CardContent from "../slots/CardContent";
import TimeInfo from "../slots/TimeInfo";
import useResizableCardHook from "../slots/useResizableCardHook";

import useDragStore from "../../context/drag/dragStore";
import buildEmptyTimeSlotKey from "../../context/emptySlotsStore/emptySlotKey";
import useEmptySlotStore from "../../context/emptySlotsStore/useEmptySlotStore";

import { useBookingModal, useGlobalStore, useNewEventStore } from "../../hooks";

import type { Booking } from "../../@types";
import { BOOKING_VIEW_TYPE } from "../../constants";

import { cn } from "../../lib/utils";
import { bookingUtils } from "../../utils";
import { dateUtils } from "../../utils/date.utils";
import type { TimeInfoRef } from "../../utils/forward";
import type { SlotTriggerProps } from "../../utils/props";

const SlotTrigger = ({
    slotData,
    blockTimeString,
    dayHour,
    slotPosition,
    disabledCss,
    events,
    bookings,
    children,
    ref,
}: SlotTriggerProps) => {
    const { isDragging, updateIsDragging } = useDragStore((state) => state);

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

    const [renderEvent, setRenderEvent] = useState<boolean>(false);
    const [isDraggingOnClick, setIsDraggingOnClick] = useState<boolean>(false);

    const [additionalBookings, setAdditionalBookings] = useState<Booking[]>([]);
    const [hoveringAdditionalCardId, setHoveringAdditionalCardId] =
        useState<string>("");

    const renderedCardPreviewRef = useRef<HTMLDivElement>(null);
    const timeInfoRef = useRef<TimeInfoRef>(null);
    const bookingCreateRef = useRef<BookingCreateRef>(null);

    const removeFromAdditionalBooking = (booking: Booking) => {
        setAdditionalBookings((prev) => {
            return prev.filter((prevBooking) => prevBooking.id !== booking.id);
        });
    };

    const addAdditionalBooking = (
        booking: Booking,
        allEmptySlotNodesId: string[],
        full = false,
    ) => {
        const fullFinishAtColumn = new Date(booking.finishAt);
        fullFinishAtColumn.setHours(24, 0);

        const additionalBookingDemo: Booking[] = [
            {
                id: booking.id,
                finishAt: full ? fullFinishAtColumn : booking.finishAt,
                overflow: true,
                startAt: bookingUtils.resetToFirstHourNextDay(booking),
                disabledResize: full ? "full" : "half",
                nodes: allEmptySlotNodesId,
            },
        ];
        setAdditionalBookings(additionalBookingDemo);
    };

    const getBookingCreateModal = (): BookingCreateRef | null => {
        return bookingCreateRef.current;
    };
    const isCustomModalVisible = (): void => {
        bookingCreateRef.current?.isModalOpen();
    };

    const showBookingCreationModal = () => {
        getBookingCreateModal()?.showCreationModal();
    };

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
            startAt: dateUtils.convertStringTimeToDateFormat(startAt),
            finishAt: dateUtils.convertStringTimeToDateFormat(finishAt),
        };
    }, [finishAt, startAt]);

    const { updateHeightStyle, heightStyle } = useResizableCardHook({
        booking: bookingMock,
    });

    const onMouseEnterEvent = useCallback((): void => {
        if (additionalBookings.length || bookings?.length) return;

        if (isDragging || isCustomModalVisible() || renderEvent) return;

        const result = events.onMouseEnterEvent();
        if (result === slotPosition) showTimeInfo();
    }, [
        slotPosition,
        isDragging,
        renderEvent,
        events,
        additionalBookings,
        bookings,
    ]);

    const resetDataAndDragging = () => {
        resetForm();
        updateIsDragging(false);
        resetSelectedNode();
    };

    const onCloseCreationModal = (event?: React.MouseEvent): void => {
        resetDataAndDragging();

        const keyToFind = buildEmptyTimeSlotKey(slotData);
        const slot = emptySlotNodes?.get(keyToFind);

        if (slot) slot.closeEvent();

        // user callback on close, using optional chain
        onModalClose?.();

        event?.stopPropagation();
        event?.preventDefault();
        getBookingCreateModal()?.closeModal();
    };

    const onOpenChange = (status: boolean): void => {
        if (!status) onCloseCreationModal();
        setRenderEvent(status);
        changeIsOpen(status);
    };

    const openModal = useCallback(
        (finishAt?: string): void => {
            resetDataAndDragging();
            if (isDragging && !finishAt) return;

            updateIsDragging(false);
            const { time, key } = slotData;

            const keyToFind = buildEmptyTimeSlotKey({ key, time });
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
            showBookingCreationModal();
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
        if (isDragging || isCustomModalVisible()) return;
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
        showBookingCreationModal();
    };

    const resetPrevView = useCallback(() => {
        setIsDraggingOnClick(false);
    }, []);

    const prepareToShowModal = () => {
        hideTimeInfo();
        showBookingCreationModal();
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
            dateUtils.convertStringTimeToDateFormat(finishAt);
        const startAtConverted =
            dateUtils.convertStringTimeToDateFormat(startAt);

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
        if (bookings?.length) hideTimeInfo();
        if (isDraggingOnClick) showTimeInfo();
    }, [bookings, isDraggingOnClick]);

    useEffect(() => {
        if (isDraggingOnClick) showTimeInfo();
    }, [isDraggingOnClick]);

    useImperativeHandle(ref, () => ({
        showEvent: (time: string) => {
            updateStartAt(time);
            prepareToShowModal();
        },
        closeEvent: () => {
            getBookingCreateModal()?.closeModal();
            setRenderEvent(false);
            hideTimeInfo();
            resetPrevView();
        },
        onOpenCloseChange: (status: boolean) => {
            changeIsOpen(status);
            setRenderEvent(status);
            resetPrevView();
        },
        addAdditionalBooking,
        removeFromAdditionalBooking,
        hoveringAdditionalCard: (hoveringCardId: string) => {
            setHoveringAdditionalCardId(hoveringCardId);
        },
        clearHoveringCard: () => {
            setHoveringAdditionalCardId("");
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

                {children}

                {renderEvent && (
                    <CardContent
                        ref={renderedCardPreviewRef}
                        bookingInit={bookingMock}
                        bookingViewType={bookingViewType}
                        slotData={{
                            day: new Date().toISOString(),
                            hour: "09:00",
                        }}
                        hoveringAdditionalCardId={hoveringAdditionalCardId}
                        heightStyle={heightStyle}
                    />
                )}

                <CardBlockContent
                    hoveringAdditionalCardId={hoveringAdditionalCardId}
                    bookings={additionalBookings}
                    blockTimeString="00"
                    slotData={dayHour}
                />

                <CardBlockContent
                    hoveringAdditionalCardId={hoveringAdditionalCardId}
                    bookings={bookings}
                    blockTimeString={blockTimeString}
                    slotData={dayHour}
                />
            </div>

            <BookingCreate
                ref={bookingCreateRef}
                onClose={onCloseCreationModal}
                onOpenChange={onOpenChange}
                buttonTrigger={<div key={slotData.key} />}
                side={
                    bookingViewType === BOOKING_VIEW_TYPE.DAY ? "top" : "right"
                }
            />
        </>
    );
};

export default SlotTrigger;
