import { type SyntheticEvent, useState } from "react";
import type { ResizeCallbackData, ResizeHandle } from "react-resizable";
import type { Booking } from "../../@types";
import { DateUtils } from "../../utils/date-utils";
import { INITIAL_HEIGHT, MIN_DIFF_TIME_THRESHOLD } from "./Card";
import { TIME_INTERVAL_IN_MINUTES } from "./service/StartAt";

interface useResizableCardHookProps {
    booking: Booking;
    onAddTime?: (datetime: Date) => void;
    onAddStartTime?: (datetime: Date) => void;
    onSubTime?: (datetime: Date) => void;
    starter?: boolean;
}

const BASE_VALUE = 1.95;

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
        height: INITIAL_HEIGHT,
        width: 600,
    });

    const calculateHeight = () => {
        const diffInMinutes = DateUtils.timeDiffInSeconds(
            booking.finishAt,
            booking.startAt,
        );

        const increment = 2;
        const blocks = Math.ceil(diffInMinutes / TIME_INTERVAL_IN_MINUTES);
        return BASE_VALUE + (blocks - 1) * increment;
    };

    const [heightStyle, setHeightStyle] = useState<number>(
        starter ? calculateHeight() : BASE_VALUE,
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
                return Math.round(prev) + BASE_VALUE;
            });

            // call my function
            if (onAddTime) onAddTime(newFinish);
        }
    };

    const subTime = async (): Promise<void> => {
        const newFinish = newFinishDate(booking.finishAt, "remove");
        const timeDiff = DateUtils.timeDiffInSeconds(
            booking.finishAt,
            booking.startAt,
        );

        if (timeDiff === MIN_DIFF_TIME_THRESHOLD) return;

        setHeightStyle((prev) => {
            return prev - BASE_VALUE;
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
        setHeightStyle(
            DateUtils.timeDiffInSeconds(finishMock, startMock) / 7.5,
        );
    };

    const resetState = () => {
        setState({ height: INITIAL_HEIGHT, width: 600 });
    };

    const resetHeightStyle = () => {
        setHeightStyle(2);
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
