import { YAXisComponentOption } from "echarts/types/dist/echarts";
import { theme } from "../../../core/utils/theme";

type YAxisProps = YAXisComponentOption & {
  pointerFormatter?: (value: undefined) => string;
  labelFormatter?: (value: unknown) => string;
};
export const BaseYAxis = ({
  splitLine = {},
  axisPointer = {},
  axisLabel = {},
  ...props
}: YAxisProps): YAXisComponentOption => ({
  splitLine: Object.assign(
    {
      show: true,
      lineStyle: {
        color: theme.chart.splitLine.color,
        width: theme.chart.splitLine.width
      }
    },
    splitLine
  ),
  axisPointer: Object.assign(
    {
      label: {
        // TODO: add types
        formatter: (value: any) => props?.pointerFormatter(value)
      }
    },
    axisPointer
  ),
  // TODO: fix types and use Object.assign(axisLabel,
  axisLabel: Object.assign(
    {
      color: theme.chart.label.color,
      fontSize: theme.chart.label.size,
      padding: 0
    },
    axisLabel as any
  ),
  ...props
});
