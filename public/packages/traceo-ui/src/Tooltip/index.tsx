import { forwardRef, useState } from "react";
import { PopoverCore } from "../Popover/PopoverCore";
import { BasePlacement } from "@popperjs/core";

export interface TooltipProps {
  placement?: BasePlacement;
  title: string;
  children: JSX.Element;
  //   trigger?: "click" | "hover"; //TODO: to implement
}

export const Tooltip = forwardRef<any, TooltipProps>(
  ({ children, title, placement = "bottom" }, ref) => {
    const [visible, setVisible] = useState<boolean>(false);

    const tooltipTitle = (
      <span className="text-xs font-normal text-white">{title}</span>
    );

    return (
      <div
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        <PopoverCore
          className="bg-canvas rounded px-5 py-1 z-50 shadow-2xl border border-solid border-secondary"
          ref={ref}
          visible={visible}
          content={tooltipTitle}
          placement={placement}
        >
          {/* React.cloneElement(children, { onMouse... }) */}
          {children}
        </PopoverCore>
      </div>
    );
  }
);

Tooltip.displayName = "Tooltip";
