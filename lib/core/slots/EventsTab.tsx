import { useDndMonitor, useDraggable } from "@dnd-kit/core";
import {
    type CSSProperties,
    type JSX,
    type PropsWithChildren,
    useState,
} from "react";

import { X } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "../../components/ui/Dropdown-menu";
import { Label } from "../../components/ui/Label";
import type { EmptySlotNodes } from "../../context/emptySlotsStore.ts/useEmptySlotStore";
import useBookingModal from "../../hooks/use-booking-model";
import type { Side } from "../booking-options/BookingInfoOptions";

interface EventTabsProps {
    emptySlotNodes?: EmptySlotNodes;
    side: Side;
    buttonTrigger: JSX.Element;
    onClose: (event: React.MouseEvent) => void;
    onOpenChange: (status: boolean) => void;
}
type EventTabsWithChildren = PropsWithChildren<EventTabsProps>;

const EventTabs = ({
    onClose,
    side,
    onOpenChange,
    buttonTrigger,
}: EventTabsWithChildren) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const bookingModal = useBookingModal();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        setActivatorNodeRef,
    } = useDraggable({
        id: "unique-id",
        data: {
            type: "another",
        },
    });

    const dragStyle: CSSProperties = {
        transform: `translate3d(${position.x + (transform?.x || 0)}px, ${position.y + (transform?.y || 0)}px, 0)`,
    };

    useDndMonitor({
        onDragEnd(event) {
            if (event.active.id) {
                const { y, x } = position;

                setPosition({
                    x: x + (transform?.x || 0),
                    y: y + (transform?.y || 0),
                });
            }
        },
    });

    return (
        <DropdownMenu
            modal={false}
            open={true}
            defaultOpen={false}
            onOpenChange={onOpenChange}
        >
            <DropdownMenuTrigger asChild>{buttonTrigger}</DropdownMenuTrigger>

            <DropdownMenuContent
                ref={setNodeRef}
                style={{ ...dragStyle, zIndex: 100, width: "25rem" }}
                forceMount
                avoidCollisions
                side={side}
                sticky="always"
                updatePositionStrategy="always"
                onEscapeKeyDown={() => {}}
                {...attributes}
            >
                <div className="dropdownLabelContent">
                    <Label
                        ref={setActivatorNodeRef}
                        className="dropdownLabelContent_dropdownLabel"
                        {...listeners}
                    >
                        Appointment
                    </Label>
                    <X
                        className="dropdownLabelContent_close"
                        onClick={onClose}
                    />
                </div>
                {bookingModal.createBookingModal}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default EventTabs;
