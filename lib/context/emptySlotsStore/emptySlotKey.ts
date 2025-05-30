import type { BlockTimeData } from "../../utils/props";

const buildEmptyTimeSlotKey = (slotData: BlockTimeData) => {
    const asDate = new Date(slotData.key);
    const day = asDate.getDate().toString().padStart(2, "0");
    const month = (asDate.getMonth() + 1).toString().padStart(2, "0");
    const year = asDate.getFullYear();
    const newDayKey = `${year}-${month}-${day}`;

    return `${newDayKey};${slotData.time}`;
};

export default buildEmptyTimeSlotKey;
