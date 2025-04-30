import { create } from "zustand";

export interface DragProps {
    startAt: string;
}

export interface DragState extends DragProps {
    updateStartAt: (startAt: string) => void;
}

const useDragStartAtStore = create<DragState>((set) => ({
    startAt: "",
    updateStartAt: (startAt: string) =>
        set((prev) => ({
            ...prev,
            startAt,
        })),
}));

export default useDragStartAtStore;
