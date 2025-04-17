import type { ReactNode } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../components/ui/Tooltip";

interface WithTooltipProps {
    content: string;
}

type PropsWithChildren<P = unknown> = P & { children: ReactNode };

type WithTooltipChildren = PropsWithChildren<WithTooltipProps>;

const WithTooltip = ({ children, content }: WithTooltipChildren) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent
                    sideOffset={3}
                    side="bottom"
                    className="border border-input bg-popover px-2 py-1 text-xs text-muted-foreground"
                >
                    {content}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default WithTooltip;
