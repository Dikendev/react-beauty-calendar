import { create } from "zustand";

export interface DragProps {
    isDragging: boolean;
}

export interface DragState extends DragProps {
    updateIsDragging: (status: boolean) => void;
}

const useDragStore = create<DragState>((set) => ({
    isDragging: false,

    updateIsDragging: (status: boolean): void =>
        set((prev) => ({
            ...prev,
            isDragging: status,
        })),
}));

export default useDragStore;
