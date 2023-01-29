import { conditionClass, joinClasses } from "../utils/classes";
import { forwardRef, HTMLProps } from "react";

export type RadioButtonSize = "sm" | "md" | "lg";

interface RadioButtonProps
  extends Omit<HTMLProps<HTMLInputElement>, "checked" | "label" | "size"> {
  isSelected: boolean;
  label: string | JSX.Element;
  onChange: (value: any) => void;
  size?: RadioButtonSize;
}

const mapRadioButtonSize: Record<RadioButtonSize, string> = {
  sm: "px-3",
  md: "py-1 px-4",
  lg: "py-2 px-6",
};

export const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  (
    { id, onChange, isSelected, label, value, size = "md", ...restProps },
    ref
  ) => {
    return (
      <div onClick={onChange}>
        <input
          className="opacity-0 absolute"
          ref={ref}
          id={id}
          value={value}
          type="radio"
          checked={isSelected}
          onChange={onChange}
          {...restProps}
        />
        <label
          htmlFor={id}
          className={joinClasses(
            conditionClass(isSelected, "bg-light-secondary", "bg-canvas"),
            mapRadioButtonSize[size],
            "h-full inline-block relative transition duration-200 font-semibold rounded-sm text-center whitespace-nowrap cursor-pointer"
          )}
        >
          {label}
        </label>
      </div>
    );
  }
);

RadioButton.displayName = "RadioButton";
