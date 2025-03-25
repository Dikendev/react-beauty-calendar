import { use } from "react";
import { useStore } from "zustand";
import { NewEventContext } from "../context/new-event/new-event-context";
import type { NewEventFormState } from "../context/new-event/new-event-store";

const useNewEventStore = <T>(selector: (state: NewEventFormState) => T): T => {
    const store = use(NewEventContext);

    if (!store) {
        throw new Error(
            "Missing useNewEventContextProvider must be within a NewEventProvider",
        );
    }

    return useStore(store, selector);
};

export default useNewEventStore;
