import { XAXisComponentOption } from "echarts/types/dist/echarts";
import { theme } from "../../../core/utils/theme";

type XAxisProps = XAXisComponentOption & {
  pointerFormatter?: (value: string | number | unknown) => string;
  labelFormatter?: (value: any, index?: number) => string;
  dateFormat?: string;
};

export const BaseXAxis = ({
  dateFormat = "HH:mm",
  type = "category",
  splitLine = {},
  axisLabel = {},
  ...props
}: XAxisProps): XAXisComponentOption => {
  return {
    type,
    splitLine: Object.assign(
      {
        show: true,
        lineStyle: {
          color: theme.chart.splitLine.color,
          width: theme.chart.splitLine.width
        },
      },
      splitLine
    ),
    axisLine: {
      lineStyle: {
        color: theme.chart.axisLine.color
      }
    },
    axisPointer: {
      label: {
        formatter: props?.pointerFormatter
      }
    },
    axisLabel: Object.assign(
      {
        formatter: props?.labelFormatter,
        color: theme.chart.label.color,
        fontSize: theme.chart.label.size,
        hideOverlap: true
      },
      axisLabel
    ),
    ...props
  };
};
