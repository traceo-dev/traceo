import { LoadingOutlined } from "@ant-design/icons";
import { conditionClass, joinClasses } from "core/utils/classes";
import { forwardRef, HTMLProps } from "react";

/**
 * TODO:
 * - tooltip
 *
 */

export interface Props extends Omit<HTMLProps<HTMLInputElement>, "prefix" | "size"> {
  width?: string | number;
  label?: string;
  prefix?: JSX.Element;
  suffix?: JSX.Element;
  loading?: boolean;
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
    ...restProps
  } = props;

  return (
    <div className={joinClasses(className, "grid grid-cols")}>
      {label && <span className="text-start font-semibold text-md mb-2">{label}</span>}
      <div className="relative">
        {prefix && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            {prefix}
          </div>
        )}

        <input
          ref={ref}
          value={value}
          {...restProps}
          className={joinClasses(`
            ${conditionClass(!!prefix, "pl-10")}
            ${conditionClass(!!suffix, "pr-10")}
              bg-canvas border border-secondary rounded-md
              focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-3 
              focus:outline-none focus:ring focus:ring-2 focus:ring-blue-400 focus:shadow-sm
              placeholder:text-gray-500
          `)}
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
