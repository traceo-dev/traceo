import { joinClasses } from "../utils/classes";
import { defaultTransitionStyles, transitionStyles } from "./style";
import { Placement } from "@popperjs/core";
import React, { forwardRef } from "react";
import { Manager, Reference, Popper } from "react-popper";
import { Transition } from "react-transition-group";

interface PopoverCoreProps {
  visible?: boolean;
  content: string | JSX.Element;
  children?: JSX.Element;
  placement?: Placement;
  className?: string;
  chilren?: JSX.Element;
  overrideStyles?: object;
}

export const PopoverCore = forwardRef<any, PopoverCoreProps>((props, ref) => {
  const { content, children, placement = "auto", visible, className, overrideStyles } = props;

  return (
    <Manager ref={ref}>
      <Reference>{({ ref }) => React.cloneElement(children, { ref })}</Reference>

      <Transition in={visible} timeout={200} unmountOnExit={true}>
        {(state) => (
          <Popper placement={placement}>
            {({ ref, style, placement }) => (
              <div
                id="popover-traceo"
                ref={ref}
                style={{
                  ...style,
                  ...defaultTransitionStyles,
                  ...transitionStyles[state],
                  ...overrideStyles
                }}
                data-placement={placement}
                className={joinClasses("popper", className)}
              >
                {content}
              </div>
            )}
          </Popper>
        )}
      </Transition>
    </Manager>
  );
});
