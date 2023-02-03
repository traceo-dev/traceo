import { FC, useEffect, useRef, useState } from "react";
import { BasePlacement } from "@popperjs/core";
import { PopoverCore } from "./PopoverCore";

type TriggerType = "click" | "hover";

interface PopoverProps {
  content: string | JSX.Element;
  children?: JSX.Element;
  placement?: BasePlacement;
  trigger?: TriggerType;
  showArrow?: boolean;
}

export const Popover: FC<PopoverProps> = ({
  children,
  content,
  placement = "bottom",
  trigger = "click",
  showArrow = true,
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const ref = useRef<any>();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const triggerOptions: Record<TriggerType, any> = {
    click: {
      onClick: (event: MouseEvent) => {
        setVisible(true);
        event.stopPropagation();
      },
    },
    hover: {
      onMouseEnter: (event: MouseEvent) => {
        setVisible(true);
        event.stopPropagation();
      },
    },
  };
  return (
    <div ref={ref} {...triggerOptions[trigger]}>
      <PopoverCore
        className="bg-canvas rounded-sm p-1 z-50 shadow-2xl border border-solid border-secondary"
        visible={visible}
        content={content}
        placement={placement}
        showArrow={showArrow}
      >
        {children}
      </PopoverCore>
    </div>
  );
};

Popover.displayName = "Popover";
