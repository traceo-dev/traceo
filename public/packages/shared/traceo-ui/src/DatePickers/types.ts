import { ManipulateType } from "dayjs";

export type RelativeTimeOption = {
    label: string;
    value: number;
    unit: ManipulateType;
    onClick?: () => void;
};
