import { conditionClass, joinClasses } from "../utils/classes";
import { defaultStyles } from "./styles";
import { SelectMenuOptionProps, SelectOptionProps } from "./types";
import { DownOutlined, LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import { FC, forwardRef } from "react";
import {
  ActionMeta,
  components,
  ContainerProps,
  default as ReactSelect,
  GroupBase,
  MenuPlacement
} from "react-select";

/**
 * TODO:
 * - multi
 */

interface SelectProps {
  options: SelectOptionProps[];
  isClearable?: boolean;
  isLoading?: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
  menuPlacement?: MenuPlacement;
  maxMenuHeight?: number;
  isSearchable?: boolean;
  isMulti?: boolean;
  prefix?: JSX.Element;
  suffix?: JSX.Element;
  className?: string;
  placeholder?: string;
  width?: number;
  value?: any;
  defaultValue?: any;
  onChange?: (value: SelectOptionProps | any, actionMeta: ActionMeta<unknown>) => void;
  isDisabled?: boolean;
  variant?: "primary" | "secondary";
}

const Control = (props: any) => {
  const { children, innerProps } = props;
  const selectProps = props.selectProps as SelectProps;

  const variant = selectProps.variant;
  const bgColor = variant && variant === "secondary" ? "bg-primary" : "bg-canvas";
  return (
    <div
      className={joinClasses("h-[30px] px-2 flex rounded-sm items-center", bgColor)}
      {...innerProps}
    >
      {(selectProps.prefix || selectProps.value?.icon) && (
        <div className="px-1">{selectProps.value?.icon || selectProps.prefix}</div>
      )}
      {children}
      {selectProps.suffix && <div className="pr-1 pl-2">{selectProps.suffix}</div>}
    </div>
  );
};

const SelectContainer = <Option, isMulti extends boolean, Group extends GroupBase<Option>>(
  props: ContainerProps<Option, isMulti, Group> & { isFocused: boolean }
) => {
  const { isDisabled, isFocused, children } = props;

  return (
    <components.SelectContainer
      {...props}
      className={joinClasses(
        "border border-secondary rounded-sm block text-sm items-center",
        conditionClass(isFocused, "ring-2 ring-blue-400"),
        conditionClass(isDisabled, "opacity-75 cursor-not-allowed")
      )}
    >
      {children}
    </components.SelectContainer>
  );
};

const Option: FC<SelectMenuOptionProps> = ({ data, innerProps, innerRef, isSelected }) => {
  return (
    <div
      ref={innerRef}
      className={joinClasses(
        "flex flex-row px-3 py-1 hover:bg-secondary items-center cursor-pointer",
        conditionClass(isSelected, "bg-secondary")
      )}
      {...innerProps}
    >
      {data.icon && (
        <div
          className={joinClasses("pr-2", conditionClass(data.description, "text-lg", "text-md"))}
        >
          {data.icon}
        </div>
      )}
      <div className="flex flex-col">
        <span className="text-sm">{data.label}</span>
        <span className="text-xs font-normal">{data.description}</span>
      </div>
    </div>
  );
};

export const Select = forwardRef<any, SelectProps>((props, ref) => {
  const {
    loadingMessage = "Loading ...",
    emptyMessage = "No options",
    options,
    value,
    defaultValue,
    width = 150,
    ...restProps
  } = props;

  const selectStyles = defaultStyles(width);
  const selectedValue = options?.find((opt) => opt.value === value) || value;
  const selectedDefaultValue = options?.find((opt) => opt.value === defaultValue) || defaultValue;

  return (
    <ReactSelect
      ref={ref}
      options={options}
      value={selectedValue}
      isOptionDisabled={(option) => option["disabled"]}
      defaultValue={selectedDefaultValue}
      components={{
        Control,
        SelectContainer,
        DropdownIndicator(props: any) {
          return props.selectProps.menuIsOpen ? <SearchOutlined /> : <DownOutlined />;
        },
        LoadingIndicator(_: any) {
          return <LoadingOutlined />;
        },
        Option
      }}
      styles={selectStyles}
      {...restProps}
    />
  );
});
