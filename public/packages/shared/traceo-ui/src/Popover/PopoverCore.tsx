import React, { forwardRef } from "react";
import { Manager, Reference, Popper } from "react-popper";
import { Transition } from "react-transition-group";
import { BasePlacement } from "@popperjs/core";
import { joinClasses } from "../utils/classes";
import { defaultTransitionStyles, transitionStyles, Arrow } from "./style";

interface PopoverCoreProps {
  visible?: boolean;
  content: string | JSX.Element;
  children?: JSX.Element;
  placement?: BasePlacement;
  className?: string;
  showArrow?: boolean;
  chilren?: JSX.Element;
}

export const PopoverCore = forwardRef<any, PopoverCoreProps>((props, ref) => {
  const {
    content,
    children,
    placement = "auto",
    visible,
    className,
    showArrow = true,
  } = props;

  // const margin = mapMargin[placement];

  return (
    <Manager ref={ref}>
      <Reference>
        {({ ref }) => React.cloneElement(children, { ref })}
      </Reference>

      <Transition in={visible} timeout={200}>
        {(state) => (
          <Popper placement={placement}>
            {({ ref, style, placement, arrowProps }) => (
              <div
                ref={ref}
                style={{
                  ...style,
                  ...defaultTransitionStyles,
                  ...transitionStyles[state],
                }}
                data-placement={placement}
                className={joinClasses("popper", className)}
              >
                {content}
                {showArrow && (
                  <Arrow
                    {...arrowProps}
                    placement={placement}
                    data-popper-arrow
                  />
                )}
              </div>
            )}
          </Popper>
        )}
      </Transition>
    </Manager>
  );
});
