import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/Select";
import type { CardInfoOptions } from "../booking-options/BookingInfoOptions";

export interface SelectOptionsProps {
    options: CardInfoOptions[];
    onChange: (option: string) => void;
}

const SelectOptions = ({ options, onChange }: SelectOptionsProps) => {
    return (
        <Select
            onValueChange={(option) => onChange(option)}
            defaultValue={options[1].text}
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="view" />
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem key={option.text} value={option.text}>
                        {option.text}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default SelectOptions;
