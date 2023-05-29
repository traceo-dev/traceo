import { PopoverCore } from "./PopoverCore";
import { Placement } from "@popperjs/core";
import { FC, useEffect, useRef, useState } from "react";

type TriggerType = "click" | "hover";

interface PopoverProps {
  content: string | JSX.Element;
  children?: JSX.Element;
  placement?: Placement;
  trigger?: TriggerType;
  showArrow?: boolean;
  overrideStyles?: object;
  open?: boolean;
  disabled?: boolean;
}

export const Popover: FC<PopoverProps> = ({
  children,
  content,
  placement = "bottom",
  trigger = "click",
  showArrow = true,
  overrideStyles,
  open = false,
  disabled = false
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const ref = useRef<any>();

  useEffect(() => setVisible(open), [open]);
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
        !disabled && setVisible(true);
        event.stopPropagation();
      }
    },
    hover: {
      onMouseEnter: (event: MouseEvent) => {
        !disabled && setVisible(true);
        event.stopPropagation();
      }
    }
  };
  return (
    <div ref={ref} {...triggerOptions[trigger]}>
      <PopoverCore
        className="bg-primary rounded-sm z-50 border border-solid border-secondary text-sm"
        visible={visible}
        content={content}
        placement={placement}
        showArrow={showArrow}
        overrideStyles={{
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          ...overrideStyles
        }}
      >
        {children}
      </PopoverCore>
    </div>
  );
};

Popover.displayName = "Popover";
