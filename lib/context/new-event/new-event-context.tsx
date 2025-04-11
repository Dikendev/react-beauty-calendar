import {
    type PropsWithChildren,
    createContext,
    useImperativeHandle,
    useRef,
} from "react";
import {
    type NewEventFormProps,
    type NewEventStore,
    newEventFormStore,
} from "./new-event-store";

const NewEventContext = createContext<NewEventStore | null>(null);

type NewEventProviderProps = PropsWithChildren<NewEventFormProps>;

const NewEventProvider = ({
    children,
    ref,
    ...props
}: NewEventProviderProps) => {
    const newEventRef = useRef<NewEventStore | null>(null);

    if (!newEventRef.current) {
        newEventRef.current = newEventFormStore(props);
    }

    const updateFinishAt = (hour24Format: string): void => {
        newEventRef.current?.getState().updateFinishAt(hour24Format);
    };

    useImperativeHandle(ref, () => ({
        updateFinishAt: updateFinishAt,
    }));

    return (
        <NewEventContext value={newEventRef.current}>
            {children}
        </NewEventContext>
    );
};

export { NewEventProvider, NewEventContext };
