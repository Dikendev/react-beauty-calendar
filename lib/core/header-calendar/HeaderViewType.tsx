import { type ReactElement, useCallback, useMemo } from "react";

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
    const { viewModes } = useBookingModal();

    const variantOnSelection = useCallback(
        (_bookingViewType: BookingViewType) => {
            return _bookingViewType === bookingViewType ? "custom" : "outline";
        },
        [bookingViewType],
    );

    const week = useCallback(
        (option: BookingViewType) => {
            if (option === bookingViewType) return;
            onViewTypeChange(option);
        },
        [onViewTypeChange],
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
        const option = options.find(
            (option) => option.label === bookingViewType,
        );
        if (option) return option.icon;
    }, [bookingViewType, options]);

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
                        checked={option.label === bookingViewType}
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
