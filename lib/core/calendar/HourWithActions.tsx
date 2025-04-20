import { type Ref, useImperativeHandle, useRef } from "react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../components/ui/Dropdown-menu";

import { cn } from "../../lib/utils";

export interface HourWithActionsProps {
    hour: string;
    ref: Ref<HourWithActionsRef>;
}

export interface HourWithActionsRef {
    setActivateHour: () => void;
}

const HourWithActions = ({ hour, ref }: HourWithActionsProps) => {
    const setLunchIntervalLabel = "Set lunch interval";
    const removeLunchIntervalLabel = "Remove lunch interval";
    const hourOptionsLabel = "Hour options";

    const timeRef = useRef<HTMLSpanElement>(null);

    const hourWithActionsClasses =
        "border-solid hover:border-b-2 hover:border-b-purple-600 border-b-white";

    const setActivateHour = () => {
        if (timeRef?.current) {
            timeRef.current.setAttribute(
                "class",
                cn("activateVisibilityTime", hourWithActionsClasses),
            );
        }
    };

    useImperativeHandle(ref, () => ({
        setActivateHour,
    }));

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <span ref={timeRef} className={cn(hourWithActionsClasses)}>
                    {hour}
                </span>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
                <DropdownMenuLabel>{hourOptionsLabel}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>{setLunchIntervalLabel}</DropdownMenuItem>
                <DropdownMenuItem>{removeLunchIntervalLabel}</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default HourWithActions;
