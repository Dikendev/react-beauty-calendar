import { useCallback, useRef } from "react";

const useThrottleCallback = <T extends (...args: never[]) => void>(
    fn: T,
    delay = 1000,
): ((...args: Parameters<T>) => void) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    return useCallback(
        (...args: Parameters<T>) => {
            if (!timeoutRef.current) {
                fn(...args);

                timeoutRef.current = setTimeout(() => {
                    timeoutRef.current = null;
                }, delay);
            }
        },
        [fn, delay],
    );
};

export default useThrottleCallback;
