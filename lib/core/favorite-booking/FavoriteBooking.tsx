import { Bookmark } from "lucide-react";
import { useState } from "react";
import { Toggle } from "../../components/ui/Toggle";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../../components/ui/Tooltip";

const FavoriteBooking = () => {
    const [bookmarked, setBookmarked] = useState<boolean>(false);
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div>
                        <Toggle
                            className="group size-10 p-0 hover:bg-indigo-50 hover:text-indigo-500 data-[state=on]:bg-indigo-50 data-[state=on]:text-indigo-500"
                            aria-label="Bookmark this"
                            variant={bookmarked ? "default" : "outline"}
                            pressed={bookmarked}
                            onPressedChange={setBookmarked}
                        >
                            <Bookmark
                                size={16}
                                strokeWidth={2}
                                aria-hidden="true"
                            />
                        </Toggle>
                    </div>
                </TooltipTrigger>
                <TooltipContent className="border border-input bg-popover px-2 py-1 text-xs text-muted-foreground">
                    <p>{bookmarked ? "Remove bookmark" : "Bookmark this"}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default FavoriteBooking;
