interface SlotKeyData {
    date: Date;
    hour: string;
}

// input: 2025-04-08;09:00
const retrieveSlotKey = (slotKey: string): SlotKeyData => {
    const split = slotKey.split(";");
    const date = new Date(split[0]);
    const hour = split[1];

    return {
        date,
        hour,
    };
};

export default retrieveSlotKey;
