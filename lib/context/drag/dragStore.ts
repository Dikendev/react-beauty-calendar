import { create } from "zustand";

const initialDragStore: DragStoreProps = {
    isDragging: false,
};

export interface DragStoreProps {
    isDragging: boolean;
}

export interface DragStoreState extends DragStoreProps {
    updateIsDragging: (isDragging: boolean) => void;
}

const useDragStore = create<DragStoreState>((set) => ({
    ...initialDragStore,

    updateIsDragging: (isDragging: boolean): void =>
        set((prev) => ({
            ...prev,
            isDragging,
        })),
}));

export default useDragStore;
