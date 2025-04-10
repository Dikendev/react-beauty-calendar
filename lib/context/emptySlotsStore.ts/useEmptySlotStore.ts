import { create } from "zustand";
import type { SlotTriggerForwardRef } from "../../core/card-slots/SlotTrigger";
import type { BlockTimeData } from "../../core/slots/EmptySlot";
import setEmptySlotKey from "./emptySlotKey";

export type EmptySlotNodes = Map<string, SlotTriggerForwardRef>;

export interface EmptySlotStore {
    emptySlotNodes: EmptySlotNodes;
    selectedNode: string;
}

export interface EmptySlotState extends EmptySlotStore {
    setEmptySlotNode: (
        node: SlotTriggerForwardRef,
        slotData: BlockTimeData,
    ) => void;
    setSelectedNode: (nodeKey: string) => void;
    resetSelectedNode: () => void;
    resetNodes: () => void;
}

const useEmptySlotStore = create<EmptySlotState>((set, get) => ({
    emptySlotNodes: new Map(),
    selectedNode: "",

    setEmptySlotNode: (
        node: SlotTriggerForwardRef,
        slotData: BlockTimeData,
    ): void => {
        set((prev) => {
            const prevEmptySlotNodes = new Map(prev.emptySlotNodes);

            // BUG SOLVED, WHEN THE PAGE RELOAD WITH THE OLD REF, IT DO NOT WORK TO THE NEW REFERENCES.
            // WHEN I TRY TO CALL WITH THE OLD REFERENCES IT CAUSE A BUG.

            // 13 starting from 8:00 AM to 20:00 PM

            // rendered refs at window
            //
            // 13 X 4 = 52
            // 52 x 7 = 364
            // 0 ... 363

            // conclusion: the mapSizeLimit will change based on the total size of time hours. today is 8am to 20pm
            // if this range change, the mapSizeLimit need to change accordingly.
            const mapSizeLimit = 447;

            const oldEmptySlotNodesSize = prevEmptySlotNodes.size;
            if (oldEmptySlotNodesSize > mapSizeLimit)
                prevEmptySlotNodes.clear();

            const key = setEmptySlotKey(slotData);
            prevEmptySlotNodes.set(key, node);

            return {
                ...prev,
                emptySlotNodes: prevEmptySlotNodes,
            };
        });
    },

    setSelectedNode: (selectedNode: string): void => {
        const prevMaps = new Map(get().emptySlotNodes);
        const prevSelectedNode = get().selectedNode;

        set((prev) => {
            if (prevSelectedNode.length) {
                const prevNodeOpen = prevMaps.get(prevSelectedNode);
                if (prevNodeOpen) prevNodeOpen.closeEvent();
            }

            return {
                ...prev,
                selectedNode,
            };
        });
    },

    resetNodes: (): void => {
        set((prev) => {
            const oldEmptySlotNodesSize = new Map(prev.emptySlotNodes);
            oldEmptySlotNodesSize.clear();

            return {
                ...prev,
                emptySlotNodes: oldEmptySlotNodesSize,
            };
        });
    },

    resetSelectedNode: (): void =>
        set((prev) => ({ ...prev, selectedNode: "" })),
}));

export default useEmptySlotStore;
