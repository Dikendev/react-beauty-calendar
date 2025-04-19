import { Badge } from "../../../components/ui/Badge";

interface FirstDaySlotProps {
    dateToRender: string;
}

const FirstDaySlot = ({ dateToRender }: FirstDaySlotProps) => {
    return (
        <div className="first_day_slot">
            <span>
                <Badge>{dateToRender}</Badge>
            </span>
        </div>
    );
};

export default FirstDaySlot;
