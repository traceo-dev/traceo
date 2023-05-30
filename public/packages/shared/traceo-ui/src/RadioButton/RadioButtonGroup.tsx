import { joinClasses } from "../utils/classes";
import { RadioButton, RadioButtonSize } from "./RadioButton";
import { FC } from "react";

export type RatioButtonGroupOption = {
  label: string | JSX.Element;
  value: string | number | boolean;
};

interface RadioButtonGroupProps {
  options: RatioButtonGroupOption[];
  onChange: (value: any) => void;
  value: string | number | boolean;
  size?: RadioButtonSize;
  className?: string;
}
export const RadioButtonGroup: FC<RadioButtonGroupProps> = (props: RadioButtonGroupProps) => {
  const { onChange, options, value, size = "md", className } = props;

  return (
    <div
      className={joinClasses(
        "flex flex-row p-0.5 rounded-sm bg-canvas max-w-min border border-solid border-secondary",
        className
      )}
    >
      {options.map((option, index) => (
        <RadioButton
          key={index}
          size={size}
          isSelected={option.value === value}
          label={option.label}
          onChange={() => onChange(option.value)}
        />
      ))}
    </div>
  );
};
