import { conditionClass, joinClasses } from "core/utils/classes";
import { FC } from "react";

interface BadgeProps {
  count: number;
  icon?: JSX.Element;
  className?: string;
  color?: "red" | "blue" | "orange" | "green" | "purple";
}
export const Badge: FC<BadgeProps> = ({ count, icon, className, color = "red" }) => {
  return (
    <div
      className={joinClasses(
        "flex flex-row max-w-min h-full-min rounded-full px-2 text-white font-semibold",
        `bg-${color}-600`,
        className
      )}
    >
      {icon && <div className="mr-2">{icon}</div>}
      {count}
    </div>
  );
};
