import { conditionClass, joinClasses } from "../../../core/utils/classes";
import { FC } from "react";

interface ColumnProps {
  span?: number;
  className?: string;
}

export const Col: FC<ColumnProps> = ({ span, children, className }) => {
  return (
    <div
      className={joinClasses(
        "flex flex-col",
        conditionClass(!!span, `col-span-${span}`),
        className
      )}
    >
      {children}
    </div>
  );
};
