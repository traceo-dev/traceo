import { conditionClass, joinClasses } from "core/utils/classes";
import { forwardRef, HTMLProps } from "react";

export type TagColorType =
  | "slate"
  | "gray"
  | "zinc"
  | "neutral"
  | "stone"
  | "red"
  | "orange"
  | "amber"
  | "yellow"
  | "lime"
  | "green"
  | "emerald"
  | "teal"
  | "cyan"
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "pink"
  | "rose";

interface TagProps extends Omit<HTMLProps<HTMLSpanElement>, "label"> {
  icon?: JSX.Element;
  color?: TagColorType;
  className?: string;
}
export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  ({ children, icon, color = "blue", className, ...restProps }, ref) => {
    return (
      <span
        ref={ref}
        className={joinClasses(
          conditionClass(!!restProps?.onClick, "cursor-pointer"),
          "border-box m-0 px-2 font-semibold text-xs leading-5 inline-flex border-none rounded-sm text-white flex flex-row",
          `bg-${color}-700`,
          className
        )}
        {...restProps}
      >
        {icon && <div className="pr-1">{icon}</div>}
        {children}
      </span>
    );
  }
);

Tag.displayName = "Tag";
