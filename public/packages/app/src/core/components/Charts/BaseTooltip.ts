import { TooltipComponentOption } from "echarts";

type PointerType = "line" | "shadow" | "cross" | "none";
type BaseTooltipProps = TooltipComponentOption & {
  pointer?: PointerType;
};

const BASE_COLOR = "#111217";
const FONT_FAMILY =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'";
export const BaseTooltip = (props?: BaseTooltipProps): TooltipComponentOption => {
  return {
    axisPointer: {
      type: props?.pointer ?? "shadow",
      lineStyle: {
        color: "gray",
        type: "dashed",
        width: 1
      }
    },
    trigger: "axis",
    backgroundColor: BASE_COLOR,
    borderColor: BASE_COLOR,
    textStyle: {
      color: "white",
      fontFamily: FONT_FAMILY
    },
    ...props
  };
};
