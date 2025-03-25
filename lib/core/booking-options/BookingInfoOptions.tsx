import { Pencil, Trash2 } from "lucide-react";

import {
    type CSSProperties,
    type Dispatch,
    type SetStateAction,
    useMemo,
    useState,
} from "react";

import { useDndMonitor, useDraggable } from "@dnd-kit/core";

import FavoriteBooking from "../favorite-booking/FavoriteBooking";

import type { Booking } from "../../@types/booking";

import { DateUtils, WEEK_DAYS_FULL_NAME } from "../../utils/date-utils";

import useDragStore from "../../context/drag/dragStore";

import { Button } from "../../components/ui/Button";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../../components/ui/Popover";
import { MONTH, type SIDE_OPTIONS } from "../../constants";
import SelectOptions from "../header-calendar/SelectItem";

interface BookingInfoOptionsProps {
    side: Side;
    booking: Booking;
    onOpenChange: Dispatch<SetStateAction<boolean>>;
}

export type Side = (typeof SIDE_OPTIONS)[number];

export interface CardInfoOptions {
    text: string;
    onClick: () => void;
}

const BookingInfoOptions = ({
    side,
    booking,
    onOpenChange,
}: BookingInfoOptionsProps) => {
    const [sideOffSet] = useState<number>(70);
    const [alignOffSet] = useState<number>(-150);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const dragStore = useDragStore();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        setActivatorNodeRef,
    } = useDraggable({
        id: "booking-info-id",
        data: {
            type: "booking-info-options",
        },
    });

    const dragStyle: CSSProperties = {
        transform: `translate3d(${position.x + (transform?.x || 0)}px, ${position.y + (transform?.y || 0)}px, 0)`,
    };

    const buttonsOptions = useMemo((): CardInfoOptions[] => {
        return [
            {
                text: "teste1",
                onClick: () => console.log("teste1"),
            },
            {
                text: "teste2",
                onClick: () => console.log("teste2"),
            },
        ];
    }, []);

    const dateToString = useMemo(() => {
        return `${DateUtils.dateAndHourDateToString(booking.startAt)} - ${DateUtils.dateAndHourDateToString(
            booking.finishAt,
        )}`;
    }, [booking.startAt, booking.finishAt]);

    const dateInformation = useMemo(() => {
        const date = new Date(booking.startAt);
        const day = date.getDate();
        const dayOfWeek = date.getDay();
        const month = MONTH[date.getMonth()];
        return (
            <span>{`${WEEK_DAYS_FULL_NAME[dayOfWeek]}, ${day} ${month}`}</span>
        );
    }, [booking.startAt]);

    const bookingColorSpan = () => {
        return {
            // backgroundColor: booking.procedure.color,
            backgroundColor: "",
        };
    };

    const handleOnDeleteBooking = async () => {
        // event.stopPropagation();
        // event.preventDefault();
        // Call the user delete booking action callback
    };

    useDndMonitor({
        onDragStart(event) {
            if (event.active.id) dragStore.updateIsDragging(true);
        },

        onDragEnd(event) {
            if (event.active.id) {
                const { y, x } = position;

                setPosition({
                    x: x + (transform?.x || 0),
                    y: y + (transform?.y || 0),
                });

                dragStore.updateIsDragging(false);
            }
        },
    });

    return (
        <Popover open={true} onOpenChange={onOpenChange}>
            <PopoverTrigger />
            <PopoverContent
                ref={setNodeRef}
                updatePositionStrategy="optimized"
                className="w-[25rem]"
                side={side}
                align="start"
                sticky="always"
                sideOffset={sideOffSet}
                alignOffset={alignOffSet}
                // onClick={(event) => test(event)}
                style={dragStyle}
            >
                <div className="grid gap-3">
                    {/* <div className="grid gap-3" onClick={test}> */}
                    {/* find a better way to handle this using ref */}
                    <input
                        type="text"
                        style={{
                            position: "absolute",
                            opacity: 0,
                            height: 0,
                            width: 0,
                        }}
                    />
                    <div className="flex justify-end gap-1">
                        <div
                            ref={setActivatorNodeRef}
                            className="w-full cursor-move"
                            {...attributes}
                            {...listeners}
                        />
                        <FavoriteBooking />
                        <Button type="button" variant="outline" size="icon">
                            <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={handleOnDeleteBooking}
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                        <SelectOptions
                            options={buttonsOptions}
                            onChange={() => {}}
                        />
                    </div>
                    <div className="mb-1 grid grid-cols-[25px_1fr] items-start pb-1 last:mb-0 last:pb-0">
                        <div>
                            <span
                                style={bookingColorSpan()}
                                className="flex h-4 w-4 translate-y-0 rounded-sm"
                            />
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                                {dateInformation} | {dateToString}
                            </p>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

BookingInfoOptions.displayName = "BookingInfoOptions";
export default BookingInfoOptions;
