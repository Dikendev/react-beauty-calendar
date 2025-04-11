import type { Ref } from "react";
import { createStore } from "zustand";

export interface NewEventFormRef {
    updateFinishAt: (selectedHour: string) => void;
}

export interface NewEventFormProps {
    date: string;
    startAt: string;
    finishAt: string;
    ref?: Ref<NewEventFormRef>;
}

export interface NewEventFormState extends NewEventFormProps {
    updateForm: (newEventForm: NewEventFormState) => void;
    updateDynamicForm: (key: string, value: string) => void;
    updateStartAt: (selectedHour: string) => void;
    updateFinishAt: (selectedHour: string) => void;
    updateDate: (dateAsString: string) => void;
    resetForm: () => void;
}

export const initialFormState: NewEventFormProps = {
    date: "",
    startAt: "",
    finishAt: "",
};

export type NewEventStore = ReturnType<typeof newEventFormStore>;

const newEventFormStore = (initProps?: Partial<NewEventFormState>) => {
    return createStore<NewEventFormState>((set) => ({
        ...initialFormState,
        ...initProps,

        updateForm: (newEventForm) =>
            set((prevForm) => ({ ...prevForm, ...newEventForm })),

        updateDynamicForm: (key: string, value: string) =>
            set((prev) => ({
                ...prev,
                [key]: value,
            })),

        updateStartAt: (selectedHour: string) =>
            set((prev) => ({ ...prev, startAt: selectedHour })),

        updateFinishAt: (selectedHour: string) =>
            set((prev) => ({ ...prev, finishAt: selectedHour })),

        updateClient: (id: string, name: string) =>
            set((prev) => ({
                ...prev,
                client: {
                    id: id,
                    name: name,
                },
            })),

        updateDate: (dateAsString: string) =>
            set((prev) => ({ ...prev, date: dateAsString })),

        resetForm: () => set(initialFormState),
    }));
};

export { newEventFormStore };
