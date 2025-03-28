import { useCallback, useRef } from "react";

const useDebounceCallback = (
    callback: () => void,
    delay = 1000,
): (() => void) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    return useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        timeoutRef.current = setTimeout(() => {
            callback();
        }, delay);
    }, [callback, delay]);
};

export default useDebounceCallback;
