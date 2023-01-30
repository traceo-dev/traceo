import { BasePlacement } from "@popperjs/core";
import styled from "styled-components";

export const ARROW_COLOR = "#111217";
export const Arrow = styled.div`
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  // margin: 5px;
  ${({ placement }) => {
    if (placement === "top") {
      return `
        border-width: 5px 5px 0 5px;
        border-color: ${ARROW_COLOR} transparent transparent transparent;
        bottom: -5px;
        left: calc(50% - 5px);
      `;
    }
    if (placement === "bottom") {
      return `
        border-width: 0 5px 5px 5px;
        border-color: transparent transparent ${ARROW_COLOR} transparent;
        top: -5px;
        left: calc(50% - 5px);
      `;
    }
    if (placement === "right") {
      return `
        border-width: 5px 5px 5px 0;
        border-color: transparent ${ARROW_COLOR} transparent transparent;
        left: -5px;
        top: calc(50% - 5px);
      `;
    }
    if (placement === "left") {
      return `
        border-width: 5px 0px 5px 5px;
        border-color: transparent transparent transparent ${ARROW_COLOR};
        right: -5px;
        top: calc(50% - 5px);
      `;
    }
  }};
`;

export const defaultTransitionStyles = {
  transitionProperty: "opacity",
  transitionDuration: "200ms",
  transitionTimingFunction: "linear",
  opacity: 0
};

export const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 }
};

export const mapMargin: Record<BasePlacement, string> = {
  bottom: "mt-5",
  top: "mb-5",
  left: "mr-5",
  right: "ml-5"
};
