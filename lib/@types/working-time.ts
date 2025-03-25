export const DayOfWeek = {
    SUN: "SUN",
    MON: "MON",
    TUE: "TUE",
    WED: "WED",
    THU: "THU",
    FRI: "FRI",
    SAT: "SAT",
} as const;

export type DayOfWeek = (typeof DayOfWeek)[keyof typeof DayOfWeek];
