import { UplotDataType, DashboardPanel } from "@traceo/types";
import { SelectOptionProps } from "@traceo/ui";
import { DeepPartial } from "redux";
import { DraftFunction } from "use-immer";

export type FormProps = {
    data?: UplotDataType;
    options: DeepPartial<DashboardPanel>;
    serieFieldOptions?: SelectOptionProps[];
    setOptions: (
        arg: DeepPartial<DashboardPanel> | DraftFunction<DeepPartial<DashboardPanel>>
    ) => void;
}
