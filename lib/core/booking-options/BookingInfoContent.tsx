import { useDndMonitor, useDraggable } from "@dnd-kit/core";
import type { Transform } from "@dnd-kit/utilities";
import { Pencil, Trash2 } from "lucide-react";
import type { CSSProperties, PropsWithChildren } from "react";
import { Button } from "../../components/ui/Button";
import { PopoverContent } from "../../components/ui/Popover";
import FavoriteBooking from "../favorite-booking/FavoriteBooking";
import SelectOptions from "../header-calendar/SelectItem";
import type { CardInfoOptions, Side } from "./BookingInfoOptions";

const buttonsOptions: CardInfoOptions[] = [
    {
        text: "teste1",
        onClick: () => console.log("teste1"),
    },
    {
        text: "teste2",
        onClick: () => console.log("teste2"),
    },
];

const SIDE_OFF_SET = 5;
const ALIGN_OFF_SET = 0;
interface BookingInfoContextProps {
    side: Side;
    xAxis: number;
    yAxis: number;
    updatePosition: (transform: Transform | null) => void;
}
type BookingInfoContextPropsWithChild =
    PropsWithChildren<BookingInfoContextProps>;

const BookingInfoContext = ({
    side,
    xAxis,
    yAxis,
    updatePosition,
    children,
}: BookingInfoContextPropsWithChild) => {
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
        transform: `translate3d(${xAxis + (transform?.x || 0)}px, ${yAxis + (transform?.y || 0)}px, 0)`,
    };

    useDndMonitor({
        onDragStart() {},
        onDragEnd(event) {
            event.active.id && updatePosition(transform);
        },
    });

    return (
        <PopoverContent
            ref={setNodeRef}
            updatePositionStrategy="optimized"
            side={side}
            align="start"
            sticky="always"
            sideOffset={SIDE_OFF_SET}
            alignOffset={ALIGN_OFF_SET}
            style={{ ...dragStyle, width: "25rem" }}
        >
            <div className="grid gap-3">
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
                    {/* All this buttons need to change to be dynamic based on user selection */}
                    <FavoriteBooking />
                    <Button type="button" variant="outline" size="icon">
                        <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {}}
                    >
                        <Trash2 className="h-3 w-3" />
                    </Button>
                    <SelectOptions
                        options={buttonsOptions}
                        onChange={() => {}}
                    />
                </div>
                {children}
            </div>
        </PopoverContent>
    );
};

export default BookingInfoContext;
