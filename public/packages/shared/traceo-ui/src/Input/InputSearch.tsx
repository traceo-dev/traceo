import { SearchOutlined } from "@ant-design/icons";
import { Input } from "./Input";
import { joinClasses } from "../utils/classes";
import { ChangeEvent, forwardRef, HTMLProps } from "react";

interface Props extends Omit<HTMLProps<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (val: string) => void;
  loading?: boolean;
}

export const InputSearch = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { value, placeholder = "Search", onChange, className } = props;

  const onChangeInputValue = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <Input
      ref={ref}
      placeholder={placeholder}
      prefix={<SearchOutlined />}
      defaultValue={value}
      onChange={onChangeInputValue}
      className={joinClasses("w-full", className)}
    />
  );
});
