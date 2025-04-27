import { Badge } from "../../../components/ui/Badge";

interface FirstDaySlotProps {
    dateToRender: string;
    isFirstDay: boolean;
}

const FirstDaySlot = ({ dateToRender, isFirstDay }: FirstDaySlotProps) => {
    return (
        <div
            style={{
                left: isFirstDay ? "3px" : "10px",
            }}
            className="first_day_slot"
        >
            <span>
                <Badge>{dateToRender}</Badge>
            </span>
        </div>
    );
};

export default FirstDaySlot;
