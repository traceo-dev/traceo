import { MarkLineComponentOption } from "echarts";
import { theme } from "../../../core/utils/theme";

export const BaseMarkLine = ({
  data,
  ...props
}: MarkLineComponentOption): MarkLineComponentOption => ({
  itemStyle: {
    color: theme.chart.item.color
  },
  label: {
    show: false
  },
  tooltip: {
    show: false
  },
  symbol: ["none", "none"],
  data,
  ...props
});
