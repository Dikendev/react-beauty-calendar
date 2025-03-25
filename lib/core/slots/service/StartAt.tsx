import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/Select";

interface StartAtFieldProps {
    formStartAt: string;
    onStartTimeChange: (value: string) => void;
    generateHoursArray: (startHour: string, isStartHour?: boolean) => string[];
}

export const INITIAL_START_TIME = "08:00";
export const TIME_INTERVAL_IN_MINUTES = 15;

const StartAtField = ({
    formStartAt,
    onStartTimeChange,
    generateHoursArray,
}: StartAtFieldProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <Select
            name="startAt"
            open={isOpen}
            value={formStartAt}
            onValueChange={onStartTimeChange}
            onOpenChange={setIsOpen}
        >
            <SelectTrigger>
                <SelectValue placeholder="Início" />
            </SelectTrigger>
            <SelectContent>
                {generateHoursArray(INITIAL_START_TIME, true).map((hour) => (
                    <SelectItem id={hour} key={hour} value={hour}>
                        {hour}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default StartAtField;
