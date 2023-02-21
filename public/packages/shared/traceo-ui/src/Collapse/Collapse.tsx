import { joinClasses } from "../utils/classes";
import React, { FC } from "react";

interface CollapseProps {
  ghost?: boolean;
  collapseIconPosition?: "start" | "end";
  children: JSX.Element[];
  className?: string;
  defaultActiveKey?: string | number;
}
export const Collapse: FC<CollapseProps> = ({
  children,
  className,
  ghost = false,
  collapseIconPosition = "end",
  defaultActiveKey
}) => {
  return (
    <div className={joinClasses("w-full gap-y-2 flex flex-col", className)}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          ghost,
          collapseIconPosition,
          defaultActiveKey
        })
      )}
    </div>
  );
};
