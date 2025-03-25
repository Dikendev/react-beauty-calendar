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

interface EventTabsProps {
    emptySlotNodes?: EmptySlotNodes;
    buttonTrigger: JSX.Element;
    onClose: (event: React.MouseEvent) => void;
    onOpenChange: (status: boolean) => void;
}
type EventTabsWithChildren = PropsWithChildren<EventTabsProps>;

const EventTabs = ({
    onClose,
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
            dir="ltr"
            modal={false}
            open={true}
            defaultOpen={false}
            onOpenChange={onOpenChange}
        >
            <DropdownMenuTrigger asChild>{buttonTrigger}</DropdownMenuTrigger>

            <DropdownMenuContent
                ref={setNodeRef}
                style={{ ...dragStyle, zIndex: 100 }}
                className="w-[25rem]"
                updatePositionStrategy="always"
                forceMount
                side="right"
                sticky="always"
                onEscapeKeyDown={() => {}}
                {...attributes}
            >
                <div className="flex justify-between items-center hover:bg-gray-100 rounded-sm">
                    <Label
                        ref={setActivatorNodeRef}
                        className="w-full hover:cursor-move p-4"
                        {...listeners}
                    >
                        Appointment
                    </Label>
                    <X
                        className="hover:cursor-pointer hover:text-gray-500"
                        onClick={onClose}
                    />
                </div>
                {bookingModal.createBookingModal}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default EventTabs;
