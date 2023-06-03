import { TooltipComponentOption } from "echarts";
import { theme } from "../../../core/utils/theme";

type PointerType = "line" | "shadow" | "cross" | "none";
type BaseTooltipProps = TooltipComponentOption & {
  pointer?: PointerType;
};

export const BaseTooltip = (props?: BaseTooltipProps): TooltipComponentOption => ({
  axisPointer: {
    type: props?.pointer ?? "shadow",
    lineStyle: {
      color: theme.chart.tooltip.color.line,
      type: "dashed",
      width: 1
    }
  },
  trigger: "axis",
  backgroundColor: theme.chart.tooltip.color.bg,
  borderColor: theme.chart.tooltip.color.border,
  textStyle: {
    color: theme.chart.tooltip.color.text,
    fontFamily: theme.chart.tooltip.font
  },
  ...props
});
