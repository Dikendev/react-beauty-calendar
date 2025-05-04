import { type SyntheticEvent, useState } from "react";
import type { ResizeCallbackData, ResizeHandle } from "react-resizable";
import type { Booking } from "../../@types";
import { DateUtils } from "../../utils/date-utils";
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

    const computeCardHeight = (finish: Date, start: Date): number => {
        const diffInMinutes = DateUtils.timeDiffInSeconds(finish, start);
        const blocks = Math.ceil(diffInMinutes / TIME_INTERVAL_IN_MINUTES);
        return -Math.abs((blocks - 1) * 2);
    };

    const [heightStyle, setHeightStyle] = useState<number>(
        starter
            ? computeCardHeight(booking.finishAt, booking.startAt)
            : BASE_VALUE,
    );

    const addTime = async (
        handle: ResizeHandle[] = ["se", "s"],
    ): Promise<void> => {
        if (handle.includes("n")) {
            const newFinish = newFinishDate(booking.startAt, "remove");

            if (onAddStartTime) onAddStartTime(newFinish);
        } else {
            const newFinish = newFinishDate(booking.finishAt, "add");

            setHeightStyle((prev) => {
                if (prev === -Math.abs(0) || prev === 0) return BASE_VALUE;
                return prev - 2;
            });

            // call the exposed function
            if (onAddTime) onAddTime(newFinish);
        }
    };

    const isMinDiffTimeThreshold = (): boolean => {
        const timeDiff = DateUtils.timeDiffInSeconds(
            booking.finishAt,
            booking.startAt,
        );
        return timeDiff === MIN_DIFF_TIME_THRESHOLD;
    };

    const subTime = async (): Promise<void> => {
        const newFinish = newFinishDate(booking.finishAt, "remove");

        if (isMinDiffTimeThreshold()) return;

        setHeightStyle((prev) => {
            return prev + Math.abs(2);
        });

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
                    if (Number(prev.height) < Number(size.height)) addTime();
                    if (Number(prev.height) > Number(size.height)) subTime();

                    return {
                        ...prev,
                        height: size.height,
                        width: size.width,
                    };
                });
                break;
            }
            case "n": {
                setState((prev) => {
                    if (Number(size.height) > Number(prev.height)) {
                        addTime(["n"]);
                    }
                    // if (Number(prev.height) > Number(size.height)) subTime();

                    return {
                        ...prev,
                        height: size.height,
                        width: size.width,
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
        onResize,
        updateHeightStyle,
    };
};

export default useResizableCardHook;
