import { UplotDataType, DashboardPanel } from "@traceo/types";
import { SelectOptionProps } from "@traceo/ui";
import { DraftFunction } from "use-immer";

export type FormProps = {
  data?: UplotDataType;
  options: DashboardPanel;
  serieFieldOptions?: SelectOptionProps[];
  setOptions: (arg: DashboardPanel | DraftFunction<DashboardPanel>) => void;
};
