import { type SyntheticEvent, useState } from "react";
import type { ResizeCallbackData, ResizeHandle } from "react-resizable";
import type { Booking } from "../../@types";
import { dateUtils } from "../../utils/date.utils";
import { TIME_INTERVAL_IN_MINUTES } from "./service/StartAt";

interface useResizableCardHookProps {
    booking: Booking;
    onAddTime?: (datetime: Date) => void;
    onAddStartTime?: (datetime: Date) => void;
    onSubTime?: (datetime: Date) => void;
    starter?: boolean;
}

export const INITIAL_SIZE = 600;
export const MIN_DIFF_TIME_THRESHOLD = 15;

// Estou usando essa notação com o valor negativo por conta de como a propriedade do css inset
// está dinamicamente sendo usado para renderizar o tamanho dos cards, sendo negativo o card aumenta.
// Usando inset fica muito mais fácil esse controle, por conta do resize nos pontos [N] e no [S] dos cards.
export const BASE_VALUE = -Math.abs(1.98);

const useResizableCardHook = ({
    booking,
    onAddTime,
    onAddStartTime,
    onSubTime,
    starter = false,
}: useResizableCardHookProps) => {
    const [state, setState] = useState<{
        height: number;
        width: number;
    }>({
        height: INITIAL_SIZE,
        width: INITIAL_SIZE,
    });

    const [topHeightIncrement, setTopHeightIncrement] = useState<number>(0);

    const computeCardHeight = (finish: Date, start: Date): number => {
        const diffInMinutes = dateUtils.timeDiffInSeconds(finish, start);
        const blocks = Math.ceil(diffInMinutes / TIME_INTERVAL_IN_MINUTES);
        return -Math.abs((blocks - 1) * 2);
    };

    const [heightStyle, setHeightStyle] = useState<number>(
        starter
            ? computeCardHeight(booking.finishAt, booking.startAt)
            : BASE_VALUE,
    );

    const baseValueLimitMin = (prevHeight: number): boolean => {
        return prevHeight === -Math.abs(0) || prevHeight === 0;
    };

    const isMinDiffTimeThreshold = (): boolean => {
        const timeDiff = dateUtils.timeDiffInSeconds(
            booking.finishAt,
            booking.startAt,
        );
        return timeDiff === MIN_DIFF_TIME_THRESHOLD;
    };

    const addTime = async (handle: ResizeHandle[]): Promise<void> => {
        if (handle.includes("n")) {
            const newStartAt = newStartDate(booking.startAt, "add");

            if (isMinDiffTimeThreshold()) return;

            setTopHeightIncrement((prev) => {
                // if (baseValueLimitMin(prev)) return BASE_VALUE;
                return prev + 2;
            });

            // call the exposed function
            if (onAddStartTime) onAddStartTime(newStartAt);
        } else {
            const newFinish = newFinishDate(booking.finishAt, "add");

            setHeightStyle((prev) => {
                if (baseValueLimitMin(prev)) return BASE_VALUE;
                return prev - 2;
            });

            // call the exposed function
            if (onAddTime) onAddTime(newFinish);
        }
    };

    const subTime = async (handle: ResizeHandle[]): Promise<void> => {
        if (handle.includes("n")) {
            const newStartAt = newStartDate(booking.startAt, "remove");

            setTopHeightIncrement((prev) => prev - 2);

            if (onAddStartTime) onAddStartTime(newStartAt);
            return;
        }

        const newFinish = newFinishDate(booking.finishAt, "remove");

        if (isMinDiffTimeThreshold()) return;

        setHeightStyle((prev) => prev + 2);

        if (onSubTime) onSubTime(newFinish);
    };

    const newFinishDate = (
        finishDate: Date,
        action: "add" | "remove",
    ): Date => {
        const newFinishDate = new Date(finishDate);
        const minutes = newFinishDate.getMinutes();

        if (action === "add") newFinishDate.setMinutes(minutes + 15);
        if (action === "remove") newFinishDate.setMinutes(minutes - 15);

        return newFinishDate;
    };

    const newStartDate = (startDate: Date, action: "add" | "remove"): Date => {
        const newStartDate = new Date(startDate);
        const minutes = newStartDate.getMinutes();

        if (action === "add") newStartDate.setMinutes(minutes + 15);
        if (action === "remove") newStartDate.setMinutes(minutes - 15);

        return newStartDate;
    };

    const onResize = (
        event: SyntheticEvent,
        { size, handle }: ResizeCallbackData,
    ) => {
        event.stopPropagation();
        event.preventDefault();

        switch (handle) {
            case "se":
            case "s": {
                setState((prev) => {
                    if (Number(prev.height) < Number(size.height))
                        addTime(["s", "se"]);
                    if (Number(prev.height) > Number(size.height))
                        subTime(["s", "se"]);

                    return {
                        ...prev,
                        height: size.height,
                    };
                });
                break;
            }
            case "n": {
                setState((prev) => {
                    const diffAbs = Math.abs(
                        Number(size.height - Number(prev.height)),
                    );

                    if (diffAbs < 10) {
                        return {
                            ...prev,
                            height: size.height,
                        };
                    }

                    if (Number(prev.height < Number(size.height))) {
                        subTime(["n"]);
                    }

                    if (Number(prev.height > Number(size.height))) {
                        addTime(["n"]);
                    }

                    return {
                        ...prev,
                        height: size.height,
                    };
                });
                break;
            }
        }
    };

    const updateHeightStyle = (finishMock: Date, startMock: Date) => {
        setHeightStyle(computeCardHeight(finishMock, startMock));
    };

    const resetState = () => {
        setState({ height: INITIAL_SIZE, width: INITIAL_SIZE });
    };

    const resetHeightStyle = () => {
        setHeightStyle(BASE_VALUE);
    };

    return {
        state,
        setState,
        resetState,
        resetHeightStyle,
        heightStyle,
        topHeightIncrement,
        onResize,
        updateHeightStyle,
    };
};

export default useResizableCardHook;
