import { LoadingOutlined } from "@ant-design/icons";
import { conditionClass, joinClasses } from "../utils/classes";
import { forwardRef, HTMLProps } from "react";

export interface Props
  extends Omit<HTMLProps<HTMLInputElement>, "prefix" | "size"> {
  width?: string | number;
  label?: string;
  prefix?: JSX.Element;
  suffix?: JSX.Element;
  loading?: boolean;
  isFocusable?: boolean;
}

export const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const {
    className,
    label,
    width = 0,
    prefix,
    suffix,
    loading,
    value,
    isFocusable = true,
    disabled,
    ...restProps
  } = props;

  const inputClassNames = joinClasses(`
    ${conditionClass(!!prefix, "pl-10")}
    ${conditionClass(!!suffix, "pr-10")}
    ${conditionClass(
      isFocusable,
      "focus:border-blue-500 focus:outline-none focus:ring focus:ring-2 focus:ring-blue-400 focus:shadow-sm",
      "focus:outline-0"
    )}
    ${conditionClass(disabled, "opacity-50")}
      bg-canvas border border-secondary rounded-md
      block w-full py-1 px-3 placeholder:text-gray-500
  `);

  return (
    <div className={joinClasses(className, "grid grid-cols")}>
      {label && (
        <span className="text-start font-semibold text-sm mb-2">{label}</span>
      )}
      <div className="relative text-sm">
        {prefix && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            {prefix}
          </div>
        )}

        <input
          ref={ref}
          value={value}
          {...restProps}
          className={inputClassNames}
          disabled={disabled}
        />

        {(suffix || loading) && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
            {loading && <LoadingOutlined />}
            {suffix}
          </div>
        )}
      </div>
    </div>
  );
});

Input.displayName = "Input";
