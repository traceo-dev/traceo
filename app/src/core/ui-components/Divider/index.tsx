import { conditionClass, joinClasses } from "../../../core/utils/classes";
import { FC } from "react";

interface DividerProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}
export const Divider: FC<DividerProps> = ({ orientation = "horizontal", className }) => {
  return (
    <hr
      className={joinClasses(
        "border-light-secondary",
        conditionClass(orientation === "vertical", "border-y-0", "border-x-0"),
        className
      )}
    />
  );
};
