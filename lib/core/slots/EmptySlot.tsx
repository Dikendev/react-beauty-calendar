import { type CSSProperties, useCallback } from "react";
import type { Booking } from "../../@types";
import type { BookingDateAndTime } from "../../@types/booking";

import setEmptySlotKey from "../../context/emptySlotsStore.ts/emptySlotKey";
import useEmptySlotStore from "../../context/emptySlotsStore.ts/useEmptySlotStore";

import SlotTrigger, {
    type SlotTriggerForwardRef,
} from "../card-slots/SlotTrigger";
import CardBlockContent from "./CardBlockContent";
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

    const insideCallBack = useCallback(
        (node: SlotTriggerForwardRef | null, blockTimeData: BlockTimeData) => {
            if (!node) return;

            const emptyTimeBlockKey = setEmptySlotKey(blockTimeData);
            const emptySlotNode = emptySlotNodes.get(emptyTimeBlockKey);

            if (!emptySlotNode) setEmptySlotNode(node, blockTimeData);
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
                <CardBlockContent
                    bookings={bookings}
                    blockTimeString={"00"}
                    slotData={dayHour}
                />
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
                <CardBlockContent
                    bookings={bookings}
                    blockTimeString="15"
                    slotData={dayHour}
                />
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
                <CardBlockContent
                    bookings={bookings}
                    blockTimeString="30"
                    slotData={dayHour}
                />
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
                <CardBlockContent
                    bookings={bookings}
                    blockTimeString="45"
                    slotData={dayHour}
                />
            </SlotTrigger>
        </>
    );
};

export default EmptySlot;
