import { Tooltip, conditionClass, joinClasses } from "@traceo/ui";
import React, { ButtonHTMLAttributes } from "react";

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
  icon: JSX.Element;
  isActive?: boolean;
  tooltip?: string;
  activeColor?: string;
}

export const ActionButton = ({
  icon = undefined,
  isActive = false,
  onClick = undefined,
  tooltip = undefined,
  activeColor = "bg-blue-500",
  className = ""
}: Props) => {
  const btn = React.cloneElement(icon, {
    onClick,
    className: joinClasses(
      "p-2 border border-solid border-secondary rounded-sm hover:ring-2 hover:ring-blue-500 cursor-pointer",
      conditionClass(isActive, `${activeColor} text-white`, "bg-canvas"),
      className
    )
  });

  const render = () => {
    if (tooltip) {
      return <Tooltip title={tooltip}>{btn}</Tooltip>;
    }

    return btn;
  };

  return render();
};
