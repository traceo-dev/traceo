import { Tooltip, conditionClass, joinClasses } from "@traceo/ui";
import React, { ButtonHTMLAttributes } from "react";

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size" | "onClick"> {
  icon: JSX.Element;
  isActive?: boolean;
  tooltip?: string;
  activeColor?: string;
  inactiveColor?: string;
  onClick?: () => void;
}

export const ActionButton = ({
  icon = undefined,
  isActive = false,
  onClick = undefined,
  tooltip = undefined,
  activeColor = "bg-blue-500",
  inactiveColor = "bg-canvas",
  className = "",
  disabled = false,
  name = undefined
}: Props) => {
  const btn = (
    <div
      onClick={onClick}
      className={joinClasses(
        "flex flex-row items-center p-1.5 border border-solid border-secondary rounded-sm hover:ring-2 hover:ring-blue-500 cursor-pointer select-none text-primary transition-200",
        conditionClass(isActive, `${activeColor} text-white`, inactiveColor),
        conditionClass(disabled, "opacity-50 pointer-events-none"),
        conditionClass(!!name, "p-1 px-2", "p-1.5"),
        className
      )}
    >
      {icon}
      {name && <span className="text-[13px] pl-2">{name}</span>}
    </div>
  );

  const render = () => {
    if (tooltip) {
      return <Tooltip title={tooltip}>{btn}</Tooltip>;
    }

    return btn;
  };

  return render();
};
