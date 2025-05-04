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
import useDragStore from "../../context/drag/dragStore";
import type { Side } from "../booking-options/BookingInfoOptions";

interface EventTabsProps {
    side?: Side;
    buttonTrigger?: JSX.Element;
    modal?: boolean;
    onClose: (event: React.MouseEvent) => void;
    onOpenChange: (status: boolean) => void;
}
type EventTabsWithChildren = PropsWithChildren<EventTabsProps>;

const EventTabs = ({
    onClose,
    side,
    onOpenChange,
    buttonTrigger,
    modal = false,
    children,
}: EventTabsWithChildren) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const updateIsDragging = useDragStore((state) => state.updateIsDragging);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        setActivatorNodeRef,
    } = useDraggable({
        id: "booking_info",
        data: {
            type: "another",
        },
    });

    const dragStyle: CSSProperties = {
        transform: `translate3d(${position.x + (transform?.x || 0)}px, ${position.y + (transform?.y || 0)}px, 0)`,
    };

    useDndMonitor({
        onDragStart() {
            updateIsDragging(true);
        },
        onDragEnd(event) {
            if (event.active.id) {
                const { y, x } = position;

                setPosition({
                    x: x + (transform?.x || 0),
                    y: y + (transform?.y || 0),
                });

                updateIsDragging(false);
            }
        },
    });

    return (
        <DropdownMenu dir="ltr" modal={modal} open onOpenChange={onOpenChange}>
            <DropdownMenuTrigger asChild>
                {buttonTrigger || <div />}
            </DropdownMenuTrigger>

            <DropdownMenuContent
                ref={setNodeRef}
                style={{ ...dragStyle, zIndex: 50, width: "25rem" }}
                forceMount
                avoidCollisions
                side={side}
                sticky="always"
                updatePositionStrategy="always"
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
                {children}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default EventTabs;
