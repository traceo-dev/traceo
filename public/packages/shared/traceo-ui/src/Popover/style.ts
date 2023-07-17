import { BasePlacement } from "@popperjs/core";

export const defaultTransitionStyles = {
  transitionProperty: "opacity",
  transitionDuration: "100ms",
  transitionTimingFunction: "linear"
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
