import { PlusCircle } from "lucide-react";
import {
    type CSSProperties,
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from "react";
import {
    useDaysSelectedView,
    useGlobalStore,
    useMonthDescription,
} from "../../hooks";
import useBookingModal from "../../hooks/use-booking-model";

import type { BookingViewType } from "../../@types/booking";
import { BOOKING_VIEW_TYPE, MONTH } from "../../constants";
import { cn } from "../../lib/utils";
import { DateUtils, WEEK_DAYS } from "../../utils/date-utils";

import { Button } from "../../components/ui/Button";
import WithTooltip from "../../hoc/WithTooltip";

import useEmptySlotStore from "../../context/emptySlotsStore.ts/useEmptySlotStore";
import type { MonthDescriptionProps } from "../../context/month-description/month-description-store";

import BookingCreate, {
    type BookingCreateRef,
} from "../booking-create/BookingCreate";

interface DaysWeekProps {
    daysOfWeek: Date[];
    bookingViewType: BookingViewType;
}

const DaysWeek = ({ daysOfWeek, bookingViewType }: DaysWeekProps) => {
    const { setTodayDay, setBookingViewType } = useGlobalStore();
    const { updateMonthMessage, updateHeaderDateLabel } = useMonthDescription(
        (state) => state,
    );
    const { onViewTypeChange } = useDaysSelectedView();
    const { onHeaderDayClick } = useBookingModal();

    const { resetSelectedNode, resetNodes } = useEmptySlotStore(
        (state) => state,
    );

    const bookingCreateRef = useRef<BookingCreateRef>(null);

    const getBookingModalCreateRef = (): BookingCreateRef | null => {
        return bookingCreateRef.current;
    };

    const openCreationBookingModal = (): void => {
        getBookingModalCreateRef()?.showCreationModal();
    };

    const handleClickDay = useCallback(
        (day: Date) => {
            const swapViewType = () => {
                setBookingViewType(BOOKING_VIEW_TYPE.WEEK);
                onViewTypeChange(BOOKING_VIEW_TYPE.WEEK);
            };

            const isViewTypeDay = () => {
                return bookingViewType === BOOKING_VIEW_TYPE.DAY;
            };

            onHeaderDayClick?.(day, bookingViewType);
            if (isViewTypeDay()) return swapViewType();

            const daySelected = setTodayDay(day);

            if (!daySelected) return;

            const monthData: MonthDescriptionProps = {
                month: daySelected.getMonth(),
                fullYear: daySelected.getFullYear(),
                monthMessage: MONTH[daySelected.getMonth()],
            };

            updateMonthMessage(monthData);
            setBookingViewType(BOOKING_VIEW_TYPE.DAY);
        },
        [bookingViewType, setTodayDay, updateMonthMessage, setBookingViewType],
    );

    const tableStyle: CSSProperties =
        bookingViewType === BOOKING_VIEW_TYPE.TABLE
            ? { justifySelf: "start" }
            : {};

    const daysOfWeekRender = useMemo(() => {
        const ifIsToday = (day: Date): boolean => {
            return new Date(day).toDateString() === new Date().toDateString();
        };

        return daysOfWeek.map((day) => {
            const dayOfWeek = WEEK_DAYS[new Date(day).getDay()];

            return (
                <th
                    key={dayOfWeek}
                    className={cn(
                        "daysOfWeek",
                        bookingViewType !== BOOKING_VIEW_TYPE.DAY &&
                            "daysOfWeek_day",
                    )}
                >
                    <div
                        style={{
                            ...tableStyle,
                            maxWidth:
                                bookingViewType === BOOKING_VIEW_TYPE.DAY
                                    ? "11rem"
                                    : undefined,
                        }}
                        className="daysOfWeek_parent"
                    >
                        <span
                            className={cn(
                                ifIsToday(day) && "daysOfWeek_day_today_title",
                            )}
                        >
                            {dayOfWeek}
                        </span>
                        <div style={{ width: "100%" }}>
                            <button
                                type="button"
                                className={cn(
                                    "daysOfWeek_day",
                                    ifIsToday(day)
                                        ? "daysOfWeek_day_today"
                                        : "daysOfWeek_day_rest",
                                )}
                                onClick={() => handleClickDay(day)}
                            >
                                {DateUtils.formatDate(day.toDateString())}
                            </button>
                        </div>
                    </div>
                </th>
            );
        });
    }, [daysOfWeek, handleClickDay, bookingViewType]);

    useEffect(() => {
        switch (bookingViewType) {
            case BOOKING_VIEW_TYPE.DAY: {
                resetNodes();
                resetSelectedNode();
                updateHeaderDateLabel(daysOfWeek[0]);
                break;
            }
            case BOOKING_VIEW_TYPE.WEEK: {
                const monthMessage =
                    DateUtils.generateWeekMonthLabel(daysOfWeek);
                updateMonthMessage({ monthMessage });
            }
        }
    }, [daysOfWeek]);

    return (
        <>
            <table className="daysOfWeek_emptySlot_table">
                <tbody>
                    <tr>
                        <th
                            key="emptyBlocks"
                            style={tableStyle}
                            className="calendarHeader"
                        >
                            <div className="daysOfWeek_emptySlot">
                                <WithTooltip content="Create booking">
                                    <Button
                                        variant="ghost"
                                        onClick={openCreationBookingModal}
                                    >
                                        <PlusCircle />
                                    </Button>
                                </WithTooltip>
                            </div>
                        </th>
                        {daysOfWeekRender}
                    </tr>
                </tbody>
            </table>

            <BookingCreate modal ref={bookingCreateRef} />
        </>
    );
};

export default DaysWeek;
