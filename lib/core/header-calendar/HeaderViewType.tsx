import { type ReactElement, useCallback, useMemo, useState } from "react";

import {
    CalendarCog,
    CalendarDays,
    Columns4,
    GalleryVertical,
    Grid3x3,
} from "lucide-react";

import { BOOKING_VIEW_TYPE } from "../../constants";

import WithTooltip from "../../hoc/WithTooltip";
import { useDaysSelectedView, useGlobalStore } from "../../hooks";

import type { BookingViewType } from "../../@types/booking";
import { Button } from "../../components/ui/Button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "../../components/ui/Dropdown-menu";
import useEmptySlotStore from "../../context/emptySlotsStore.ts/useEmptySlotStore";
import useBookingModal from "../../hooks/use-booking-model";
import { StringUtils } from "../../utils/string.utils";
import ShortcutCommands from "../shortcut-commands/ShortcutCommands";

interface IconsViewType {
    variant: string;
    icon: ReactElement;
    events: (option: BookingViewType) => void;
    label: BookingViewType;
}

const VIEW_TYPE_ICONS = {
    [BOOKING_VIEW_TYPE.DAY]: <GalleryVertical size="20px" />,
    [BOOKING_VIEW_TYPE.WEEK]: <Columns4 size="20px" />,
    [BOOKING_VIEW_TYPE.TABLE]: <CalendarDays size="20px" />,
    [BOOKING_VIEW_TYPE.MONTH]: <Grid3x3 size="20px" />,
};

const HeaderViewType = () => {
    const { bookingViewType } = useGlobalStore();
    const { onViewTypeChange } = useDaysSelectedView();
    const { resetNodes, resetSelectedNode } = useEmptySlotStore();
    const { viewModes, onChangeViewType } = useBookingModal();

    const [selected, setSelected] = useState<keyof typeof BOOKING_VIEW_TYPE>(
        BOOKING_VIEW_TYPE.WEEK,
    );

    const variantOnSelection = useCallback(
        (_bookingViewType: BookingViewType) => {
            return _bookingViewType === bookingViewType ? "custom" : "outline";
        },
        [bookingViewType],
    );

    const week = useCallback(
        (option: keyof typeof BOOKING_VIEW_TYPE) => {
            if (option === selected) return;

            // Need to reset the slot nodes and the selectedNode. Previously, the selected node was only being reset during the render of the slots, which caused UI flashes. This needs to be refactored to be used in multiple places without causing UI issues.

            resetNodes();
            resetSelectedNode();

            // Call this from the booking app
            onChangeViewType(option);
            setSelected(option);
            onViewTypeChange(option);
        },
        [
            onViewTypeChange,
            selected,
            resetNodes,
            resetSelectedNode,
            onChangeViewType,
        ],
    );

    const options: IconsViewType[] = useMemo(() => {
        return viewModes.map((viewMode) => ({
            variant: variantOnSelection(viewMode),
            icon: VIEW_TYPE_ICONS[viewMode],
            events: (option: BookingViewType) => week(option),
            label: viewMode,
        }));
    }, [viewModes, week, variantOnSelection]);

    const findSelectedIcon = useMemo(() => {
        const option = options.find((option) => option.label === selected);
        if (option) return option.icon;
    }, [selected, options]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button variant="ghost" className="w-8 h-8" asChild>
                    <WithTooltip content="Calendar Modes">
                        {findSelectedIcon || (
                            <CalendarCog
                                color="gray"
                                className="w-full h-full"
                            />
                        )}
                    </WithTooltip>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-100">
                {options.map((option) => (
                    <DropdownMenuCheckboxItem
                        key={option.label}
                        checked={option.label === selected}
                        onCheckedChange={() => option.events(option.label)}
                        className="flex flex-row justify-between gap-6"
                    >
                        <div className="flex flex-row gap-4">
                            {option.icon}
                            <div>{StringUtils.capitalize(option.label)}</div>
                        </div>

                        {/* TODO: Add the correct keys shortcut */}
                        <ShortcutCommands code="o" />
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default HeaderViewType;
