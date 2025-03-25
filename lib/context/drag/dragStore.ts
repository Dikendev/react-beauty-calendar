import { create } from "zustand";

export interface DragProps {
    isDragging: boolean;
    isDelayActive: boolean;
}

export interface DragState extends DragProps {
    updateIsDragging: (status: boolean) => void;
    updateIsDelayActive: (status: boolean) => void;
    onChangeIsDelayActive: () => void;
}

const useDragStore = create<DragState>((set) => ({
    isDragging: false,
    isDelayActive: true,

    updateIsDragging: (status: boolean): void =>
        set((prev) => ({
            ...prev,
            isDragging: status,
        })),

    updateIsDelayActive: (status: boolean): void =>
        set((prev) => ({
            ...prev,
            isDelayActive: status,
        })),

    onChangeIsDelayActive: (): void =>
        set((prev) => ({
            ...prev,
            isDelayActive: !prev,
        })),
}));

export default useDragStore;
