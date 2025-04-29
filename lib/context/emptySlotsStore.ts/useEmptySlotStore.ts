import { differenceInHours } from "date-fns";
import { create } from "zustand";
import type { SlotTriggerForwardRef } from "../../core/card-slots/SlotTrigger";
import type { BlockTimeData } from "../../core/slots/EmptySlot";
import {
    END_24_HOUR_FORMAT,
    START_TIME,
} from "../global/days-and-week/day-and-week-store";
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

            const hoursDiff = differenceInHours(
                new Date(`1970/01/01 ${END_24_HOUR_FORMAT}`),
                new Date(2014, 6, 0, Number(START_TIME), 0),
            );
            const hourBlockQuantity = 4;
            const daysOfWeek = 7;
            const hourDiffMultiplyBy = (hoursDiff + 2) * hourBlockQuantity;
            const quantityOfSlots = hourDiffMultiplyBy * daysOfWeek;

            // rendered slot refs on window
            // 24 X 4 = 96
            // 96 x 7 = 672
            // 0 ... 671

            // CRIAR UMA ISSUE, DISSO.
            // E COMO POSSO FAZER PARA O USUÁRIO ESCOLHER O TIPO DE VISUALIZAÇÃO? SE É 12 OU 24?
            //TODO: AGORA FAZER ISSO SER DINÂMICO.

            const mapSizeLimit = quantityOfSlots - 1;

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
