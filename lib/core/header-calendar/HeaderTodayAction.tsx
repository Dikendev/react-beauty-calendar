import { SquareMousePointer } from "lucide-react";
import { Button } from "../../components/ui/Button";
import WithTooltip from "../../hoc/WithTooltip";

interface HeaderTodayActionProps {
    onClick: () => void;
}

const HeaderTodayAction = ({ onClick }: HeaderTodayActionProps) => {
    return (
        <WithTooltip content="Today">
            <Button variant="ghost" onClick={onClick}>
                <SquareMousePointer style={{ paddingTop: "0.8px" }} />
            </Button>
        </WithTooltip>
    );
};

export default HeaderTodayAction;
