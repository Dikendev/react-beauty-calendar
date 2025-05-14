import { useCallback, useEffect } from "react";

import buildEmptyTimeSlotKey from "../../context/emptySlotsStore/emptySlotKey";
import useEmptySlotStore from "../../context/emptySlotsStore/useEmptySlotStore";

import { DAY_TIME_STARTER } from "../../constants";

import { dateUtils } from "../../utils";
import type { BlockTimeData, EmptySlotProps } from "../../utils/props";

import type { Booking } from "../../@types";
import type { SlotTriggerForwardRef } from "../../utils/forward";
import SlotTrigger from "../card-slots/SlotTrigger";
import ActualTimerIndicator from "./actualTimeIndicator/ActualTimeIndicator";

const EmptySlot = ({
    bookings,
    first,
    second,
    third,
    fourth,
    disabledCss,
    firstDay,
    dayHour,
}: EmptySlotProps) => {
    const { setEmptySlotNode, emptySlotNodes } = useEmptySlotStore();

    const insideCallBack = useCallback(
        (node: SlotTriggerForwardRef | null, blockTimeData: BlockTimeData) => {
            if (!node) return;

            const emptyTimeBlockKey = buildEmptyTimeSlotKey(blockTimeData);
            const emptySlotNode = emptySlotNodes.get(emptyTimeBlockKey);

            if (!emptySlotNode) setEmptySlotNode(node, blockTimeData);
        },
        [setEmptySlotNode, emptySlotNodes],
    );

    const buildEmptySlotIdentifier = (
        finishAt: Date,
        bookingStartAt?: Date,
    ) => {
        const nextKeyDay = finishAt.toDateString();

        return buildEmptyTimeSlotKey({
            key: nextKeyDay,
            time: bookingStartAt
                ? dateUtils.dateTimeAsString(bookingStartAt)
                : DAY_TIME_STARTER,
        });
    };

    const findNextDaySlotNode = useCallback(
        (finishAt: Date) => {
            const emptySlotId = buildEmptySlotIdentifier(finishAt);
            return emptySlotNodes.get(emptySlotId);
        },
        [emptySlotNodes],
    );

    const processFutureBookingSlots = (
        booking: Booking,
        daysDifference: number,
        allEmptySlotNodes: string[],
    ) => {
        const futureDateList = dateUtils.buildFutureDateList(
            booking,
            daysDifference,
        );

        for (let i = 0; i < futureDateList.length; i++) {
            const nextDaySlotNode = findNextDaySlotNode(futureDateList[i]);

            if (!nextDaySlotNode) return;

            nextDaySlotNode.addAdditionalBooking(
                booking,
                allEmptySlotNodes,
                i !== futureDateList.length - 1,
            );
        }
    };

    const handleCardAdditionalExec = useCallback((): void => {
        if (!bookings?.length) return;

        for (const booking of bookings) {
            const daysDifference = dateUtils.calculateDaysDifference(
                booking.finishAt,
                booking.startAt,
            );

            const futureDateListIncludingToday = dateUtils.buildFutureDateList(
                booking,
                daysDifference + 1,
                0,
            );

            const allEmptySlotNodes = futureDateListIncludingToday
                .map((dateList, index) => {
                    return buildEmptySlotIdentifier(
                        dateList,
                        index === 0 ? booking.startAt : undefined,
                    );
                })
                .filter((el) => el !== undefined);

            if (daysDifference === 1) {
                const nextDaySlotNode = findNextDaySlotNode(booking.finishAt);
                if (!nextDaySlotNode) return;

                nextDaySlotNode.addAdditionalBooking(
                    booking,
                    allEmptySlotNodes,
                );
                return;
            }

            processFutureBookingSlots(
                booking,
                daysDifference,
                allEmptySlotNodes,
            );
        }
    }, [bookings, findNextDaySlotNode, processFutureBookingSlots]);

    useEffect(() => {
        // TODO: Add custom ref methods to additional cards rendered
        if (bookings?.length) {
            handleCardAdditionalExec();
        }
    }, [bookings, emptySlotNodes, handleCardAdditionalExec]);

    return (
        <>
            <SlotTrigger
                ref={(node) =>
                    insideCallBack(node, {
                        key: first.key,
                        time: first.time,
                    })
                }
                slotData={first}
                disabledCss={disabledCss}
                events={{
                    onMouseEnterEvent: () => "first",
                }}
                slotPosition="first"
                dayHour={dayHour}
                bookings={bookings}
                blockTimeString="00"
            >
                <ActualTimerIndicator isFirstDay={firstDay} slotData={first} />
            </SlotTrigger>
            <SlotTrigger
                ref={(node) =>
                    insideCallBack(node, {
                        key: second.key,
                        time: second.time,
                    })
                }
                slotData={second}
                disabledCss={disabledCss}
                events={{
                    onMouseEnterEvent: () => "second",
                }}
                slotPosition="second"
                dayHour={dayHour}
                bookings={bookings}
                blockTimeString="15"
            >
                <ActualTimerIndicator isFirstDay={firstDay} slotData={second} />
            </SlotTrigger>
            <SlotTrigger
                ref={(node) =>
                    insideCallBack(node, {
                        key: third.key,
                        time: third.time,
                    })
                }
                slotData={third}
                disabledCss={disabledCss}
                events={{
                    onMouseEnterEvent: () => "third",
                }}
                slotPosition="third"
                dayHour={dayHour}
                bookings={bookings}
                blockTimeString="30"
            >
                <ActualTimerIndicator isFirstDay={firstDay} slotData={third} />
            </SlotTrigger>
            <SlotTrigger
                ref={(node) =>
                    insideCallBack(node, {
                        key: fourth.key,
                        time: fourth.time,
                    })
                }
                slotData={fourth}
                disabledCss={disabledCss}
                events={{
                    onMouseEnterEvent: () => "fourth",
                }}
                slotPosition="fourth"
                dayHour={dayHour}
                bookings={bookings}
                blockTimeString="45"
            >
                <ActualTimerIndicator isFirstDay={firstDay} slotData={fourth} />
            </SlotTrigger>
        </>
    );
};

export default EmptySlot;
