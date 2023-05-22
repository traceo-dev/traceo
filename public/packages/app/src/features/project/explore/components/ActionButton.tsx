import { Tooltip, conditionClass, joinClasses } from "@traceo/ui";
import React from "react";

interface Props {
  icon: JSX.Element;
  isActive?: boolean;
  onClick: () => void;
  tooltip?: string;
}

export const ActionButton = ({ icon, isActive, onClick, tooltip }: Props) => {
  const btn = React.cloneElement(icon, {
    onClick,
    className: joinClasses(
      "p-2 border border-solid border-secondary rounded-sm hover:ring-2 hover:ring-blue-500 cursor-pointer",
      conditionClass(isActive, "bg-blue-500 text-white")
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
