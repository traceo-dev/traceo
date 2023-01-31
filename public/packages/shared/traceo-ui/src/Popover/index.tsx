import { FC, useRef, useState } from "react";
import { BasePlacement } from "@popperjs/core";
import { PopoverCore } from "./PopoverCore";

type TriggerType = "click" | "hover";

interface PopoverProps {
  content: string | JSX.Element;
  children?: JSX.Element;
  placement?: BasePlacement;
  trigger?: TriggerType;
}

export const Popover: FC<PopoverProps> = ({
  children,
  content,
  placement = "bottom",
  trigger = "click"
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const ref = useRef<any>();

  // https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
  const handleClickOutside = (e: Event) => {
    if (!ref?.current?.contains(e.target)) {
      setVisible(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  const triggerOptions: Record<TriggerType, any> = {
    click: {
      onClick: () => setVisible(true)
    },
    hover: {
      onMouseEnter: () => setVisible(true)
    }
  };

  return (
    <div ref={ref} {...triggerOptions[trigger]}>
      <PopoverCore
        className="bg-canvas rounded px-5 py-1 z-50 shadow-2xl border border-solid border-secondary"
        visible={visible}
        content={content}
        placement={placement}
      >
        {children}
      </PopoverCore>
    </div>
  );
};

Popover.displayName = "Tooltip";
