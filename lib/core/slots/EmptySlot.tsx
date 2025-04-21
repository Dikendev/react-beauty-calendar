import { type CSSProperties, useCallback } from "react";
import type { Booking } from "../../@types";
import type { BookingDateAndTime } from "../../@types/booking";

import setEmptySlotKey from "../../context/emptySlotsStore.ts/emptySlotKey";
import useEmptySlotStore from "../../context/emptySlotsStore.ts/useEmptySlotStore";
import { DateUtils } from "../../utils/date-utils";

import SlotTrigger, {
    type SlotTriggerForwardRef,
} from "../card-slots/SlotTrigger";
import Card from "./Card";
import ActualTimerIndicator from "./actualTimeIndicator/ActualTimeIndicator";

export interface BlockTimeRef {
    ref: (element: HTMLElement | null) => void;
    style: CSSProperties;
}

export interface BlockTimeData {
    key: string;
    time: string;
}

export type BlocksTimeStructure = BlockTimeRef & BlockTimeData;

export interface EmptySlotProps {
    bookings?: Booking[];
    dayHour?: BookingDateAndTime;
    first: BlocksTimeStructure;
    second: BlocksTimeStructure;
    third: BlocksTimeStructure;
    fourth: BlocksTimeStructure;
    disabledCss: string;
    firstDay: boolean;
}

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

    const firstSlot = CardContentRender({
        bookings,
        blockTimeString: "00",
        slotData: dayHour,
    });
    const secondSlot = CardContentRender({
        bookings,
        blockTimeString: "15",
        slotData: dayHour,
    });
    const thirdSlot = CardContentRender({
        bookings,
        blockTimeString: "30",
        slotData: dayHour,
    });
    const fourthSlot = CardContentRender({
        bookings,
        blockTimeString: "45",
        slotData: dayHour,
    });

    const insideCallBack = useCallback(
        (node: SlotTriggerForwardRef | null, blockTimeData: BlockTimeData) => {
            if (!node) return;

            const keyToFind = setEmptySlotKey(blockTimeData);
            const last = emptySlotNodes.get(keyToFind);

            if (!last) setEmptySlotNode(node, blockTimeData);
        },
        [setEmptySlotNode, emptySlotNodes],
    );

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
                actualTimerIndicatorChildren={
                    <ActualTimerIndicator
                        isFirstDay={firstDay}
                        slotData={first}
                    />
                }
            >
                {firstSlot}
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
                actualTimerIndicatorChildren={
                    <ActualTimerIndicator
                        isFirstDay={firstDay}
                        slotData={second}
                    />
                }
            >
                {secondSlot}
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
                actualTimerIndicatorChildren={
                    <ActualTimerIndicator
                        isFirstDay={firstDay}
                        slotData={third}
                    />
                }
            >
                {thirdSlot}
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
                actualTimerIndicatorChildren={
                    <ActualTimerIndicator
                        isFirstDay={firstDay}
                        slotData={fourth}
                    />
                }
            >
                {fourthSlot}
            </SlotTrigger>
        </>
    );
};

interface CardContentRenderProps {
    bookings?: Booking[];
    blockTimeString: string;
    slotData?: BookingDateAndTime;
}

const CardContentRender = ({
    bookings,
    blockTimeString,
    slotData,
}: CardContentRenderProps) => {
    if (!bookings || (!slotData?.day && !slotData?.hour)) return null;

    const bookingToRender = bookings.filter((booking) => {
        const actualSlotTimeString = DateUtils.dateAndHourDateToString(
            new Date(booking.startAt),
        );
        return actualSlotTimeString.split(":")[1] === blockTimeString;
    });

    if (!bookingToRender || !bookingToRender?.length) return;

    if (bookingToRender.length === 1) {
        return <Card booking={bookingToRender[0]} slotData={slotData} />;
    }

    return (
        <div style={{ display: "flex", flexDirection: "row", height: "100%" }}>
            {bookingToRender.map((booking, index) => (
                <Card
                    key={booking.id}
                    booking={booking}
                    half
                    slotData={slotData}
                    lastCard={bookingToRender.length - 1 === index}
                />
            ))}
        </div>
    );
};

export default EmptySlot;
