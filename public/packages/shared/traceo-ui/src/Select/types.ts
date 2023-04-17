import { RefCallback } from "react";
import { Dictionary } from "../../../../../../../traceo-node/packages/browser/dist";

export interface SelectOptionProps {
  label: string;
  value: string | number | boolean | object | Dictionary<string | number | undefined>;
  description?: string;
  icon?: JSX.Element;
  // [key: string]: any;
}

export interface SelectMenuOptionProps {
  isDisabled: boolean;
  isFocused: boolean;
  isSelected: boolean;
  innerProps: any;
  innerRef: RefCallback<HTMLDivElement>;
  renderOptionLabel?: (value: SelectOptionProps) => JSX.Element;
  data: SelectOptionProps | any; //TODO: fix this
}
