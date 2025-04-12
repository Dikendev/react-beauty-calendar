import { SquareMousePointer } from "lucide-react";
import { Button } from "../../components/ui/Button";

interface HeaderTodayActionProps {
    mobileLayout: boolean;
    onClick: () => void;
}

const HeaderTodayAction = ({
    mobileLayout,
    onClick,
}: HeaderTodayActionProps) => {
    return (
        <Button variant={mobileLayout ? "ghost" : "outline"} onClick={onClick}>
            <SquareMousePointer style={{ paddingTop: "0.8px" }} />
            {!mobileLayout && "Today"}
        </Button>
    );
};

export default HeaderTodayAction;
