import type { FormEvent, MouseEvent } from "react";

type EventType = MouseEvent | FormEvent;

const useEventPrevention = <T extends EventType>(callback: () => void) => {
    return (event: T) => {
        event.stopPropagation();
        event.preventDefault();
        callback();
    };
};

export default useEventPrevention;
