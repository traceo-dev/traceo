import { joinClasses } from "../../../core/utils/classes";
import { forwardRef, HTMLProps } from "react";

export interface Props extends Omit<HTMLProps<HTMLTextAreaElement>, "prefix" | "size"> {
  label?: string;
}

export const InputArea = forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
  const { className, label, ...restProps } = props;

  return (
    <div className={joinClasses(className, "grid grid-cols")}>
      {label && <span className="text-start font-semibold text-sm mb-2">{label}</span>}
      <div className="relative">
        <textarea
          ref={ref}
          {...restProps}
          className={joinClasses(`
              bg-canvas border border-secondary rounded-md
              focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-3 
              focus:outline-none focus:ring focus:ring-2 focus:ring-blue-400 focus:shadow-sm
              placeholder:text-gray-500
          `)}
        />
      </div>
    </div>
  );
});

InputArea.displayName = "InputArea";
