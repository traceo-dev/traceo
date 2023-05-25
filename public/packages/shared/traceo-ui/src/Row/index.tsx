import { conditionClass, joinClasses } from "../utils/classes";
import React, { FC, HTMLProps } from "react";

interface RowProps extends HTMLProps<HTMLDivElement> {
  cols?: number;
  gap?: string; //https://tailwindcss.com/docs/gap
  children?: React.ReactNode;
  className?: string;
}
export const Row: FC<RowProps> = ({ cols, gap, children, className, ...props }) => {
  return (
    <div
      className={joinClasses(
        conditionClass(!!cols, `grid grid-cols-${cols}`, "flex flex-row items-center"),
        conditionClass(!!gap, `gap-${gap}`),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
