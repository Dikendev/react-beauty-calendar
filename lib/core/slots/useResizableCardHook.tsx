import { type SyntheticEvent, useState } from "react";
import type { ResizeCallbackData, ResizeHandle } from "react-resizable";
import type { Booking } from "../../@types";
import { DateUtils } from "../../utils/date-utils";
import { INITIAL_HEIGHT, MIN_DIFF_TIME_THRESHOLD } from "./Card";

interface useResizableCardHookProps {
    booking: Booking;
    onAddTime?: (datetime: Date) => void;
    onAddStartTime?: (datetime: Date) => void;
    onSubTime?: (datetime: Date) => void;
    starter?: boolean;
}

const INCREASER = 0.2;

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

    // For some reason i need to start with the number 2, find out a better way to do this.

    // find out why 7.3;
    // maybe related to the height of the time slot.
    // study about this.
    const [heightStyle, setHeightStyle] = useState<number>(
        starter
            ? Math.round(
                  DateUtils.timeDiffInSeconds(
                      booking.finishAt,
                      booking.startAt,
                  ) / 7.5,
              )
            : 2,
    );

    const dividerByEight = (value: number): boolean => {
        return value % 8 === 0;
    };

    const isGreaterThen18 = (value: number): boolean => {
        return value >= 18;
    };

    const greatherAndOdd = (value: number): boolean => {
        const greaterThan8 = value >= 8 && value <= 10;
        const isOdd = value % 2 === 0;
        return greaterThan8 && dividerByEight(value) && isOdd;
    };

    const addTime = async (
        handle: ResizeHandle[] = ["se", "s"],
    ): Promise<void> => {
        if (handle.includes("n")) {
            const newFinish = newFinishDate(booking.startAt, "remove");

            if (onAddStartTime) onAddStartTime(newFinish);
        } else {
            const newFinish = newFinishDate(booking.finishAt, "add");

            setHeightStyle((prev) => {
                const sum = Math.round(prev) + 2;

                if (greatherAndOdd(sum) || isGreaterThen18(sum)) {
                    return sum + INCREASER;
                }

                return sum;
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
            if (prev > 10) return prev - 2;
            return prev - 2;
        });

        // call my function
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
            DateUtils.timeDiffInSeconds(finishMock, startMock) / 7.3,
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
