import { type PropsWithChildren, createContext, useRef } from "react";
import {
    type NewEventFormProps,
    type NewEventStore,
    newEventFormStore,
} from "./new-event-store";

const NewEventContext = createContext<NewEventStore | null>(null);

type NewEventProviderProps = PropsWithChildren<NewEventFormProps>;

const NewEventProvider = ({ children, ...props }: NewEventProviderProps) => {
    const newEventRef = useRef<NewEventStore | null>(null);

    if (!newEventRef.current) {
        newEventRef.current = newEventFormStore(props);
    }

    return (
        <NewEventContext value={newEventRef.current}>
            {children}
        </NewEventContext>
    );
};

export { NewEventProvider, NewEventContext };
