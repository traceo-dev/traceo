import { conditionClass, joinClasses } from "../utils/classes";
import { FC, PropsWithChildren } from "react";

interface ColumnProps {
  span?: number;
  className?: string;
}

export const Col: FC<PropsWithChildren<ColumnProps>> = ({
  span,
  children,
  className,
}) => {
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
