import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "../../components/ui/Button";
import type { ActionType } from "./Header";

interface handleWeekChangeProps {
    handleWeekChange: (actionType: ActionType) => void;
}

const HeaderDayActions = ({ handleWeekChange }: handleWeekChangeProps) => {
    return (
        <div className="header_day_actions">
            <Button
                className="header_day_actions_button"
                variant="ghost"
                size="lg"
                onClick={() => handleWeekChange("previous")}
            >
                <ChevronLeftIcon className="header_day_actions_button_icon" />
            </Button>
            <Button
                className="header_day_actions_button"
                variant="ghost"
                size="lg"
                onClick={() => handleWeekChange("next")}
            >
                <ChevronRightIcon className="header_day_actions_button_icon" />
            </Button>
        </div>
    );
};

export default HeaderDayActions;
