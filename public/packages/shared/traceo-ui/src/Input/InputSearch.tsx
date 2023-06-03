import { joinClasses } from "../utils/classes";
import { Input } from "./Input";
import { SearchOutlined } from "@ant-design/icons";
import { ChangeEvent, forwardRef, HTMLProps } from "react";

interface Props extends Omit<HTMLProps<HTMLInputElement>, "onChange"> {
  value: string;
  onChange?: (val: string) => void;
  loading?: boolean;
  variant?: "primary" | "secondary";
}

export const InputSearch = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const {
    value,
    placeholder = "Search",
    onChange,
    className,
    variant = "primary",
    ...rest
  } = props;

  const onChangeInputValue = (event: ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(event.target.value);
  };

  return (
    <Input
      {...rest}
      ref={ref}
      placeholder={placeholder}
      prefix={<SearchOutlined />}
      defaultValue={value}
      onChange={onChangeInputValue}
      className={joinClasses("w-full", className)}
      variant={variant}
    />
  );
});
