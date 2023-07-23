import { PopoverCore } from "../Popover/PopoverCore";
import { BasePlacement } from "@popperjs/core";
import { forwardRef, useState } from "react";

export interface TooltipProps {
  placement?: BasePlacement;
  title: string | JSX.Element;
  children: JSX.Element;
  //   trigger?: "click" | "hover"; //TODO: to implement
}

export const Tooltip = forwardRef<any, TooltipProps>(
  ({ children, title, placement = "bottom" }, ref) => {
    const [visible, setVisible] = useState<boolean>(false);

    const tooltipTitle =
      typeof title === "string" ? (
        <span className="text-xs font-normal text-white select-none">{title}</span>
      ) : (
        title
      );

    const overrideStyles = {
      maxWidth: "250px",
      margin: "10px"
    };

    return (
      <div onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
        <PopoverCore
          className="bg-secondary rounded-sm px-2 z-50 shadow-2xl"
          ref={ref}
          visible={visible}
          content={tooltipTitle}
          placement={placement}
          overrideStyles={overrideStyles}
        >
          {/* React.cloneElement(children, { onMouse... }) */}
          {children}
        </PopoverCore>
      </div>
    );
  }
);

Tooltip.displayName = "Tooltip";
