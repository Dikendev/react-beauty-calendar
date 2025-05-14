import { DndContext } from "@dnd-kit/core";
import { type JSX, type Ref, useImperativeHandle, useState } from "react";
import { useBookingModal } from "../../hooks";
import type { Side } from "../booking-options/BookingInfoOptions";
import EventTabs from "../slots/EventsTab";

interface BookingCreateProps {
    modal?: boolean;
    side?: Side;
    buttonTrigger?: JSX.Element;
    onClose?: () => void;
    onOpenChange?: (status: boolean) => void;
    ref: Ref<BookingCreateRef>;
}

export interface BookingCreateRef {
    showCreationModal: () => void;
    closeModal: () => void;
    isModalOpen: () => boolean;
}

const BookingCreate = ({
    modal = false,
    side,
    onClose,
    onOpenChange,
    buttonTrigger,
    ref,
}: BookingCreateProps) => {
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const { createBookingModal } = useBookingModal();

    const _onClose = (): void => {
        setIsOpenModal(false);
        onClose?.();
    };

    const _onOpenChange = (status: boolean): void => {
        setIsOpenModal(status);
        onOpenChange?.(status);
    };

    useImperativeHandle(ref, () => ({
        showCreationModal: () => setIsOpenModal(true),
        closeModal: () => setIsOpenModal(false),
        isModalOpen: () => isOpenModal,
    }));

    return (
        <>
            {isOpenModal && (
                <DndContext>
                    <EventTabs
                        onClose={_onClose}
                        onOpenChange={_onOpenChange}
                        modal={modal}
                        side={side}
                        buttonTrigger={buttonTrigger}
                    >
                        {createBookingModal}
                    </EventTabs>
                </DndContext>
            )}
        </>
    );
};

export default BookingCreate;
