import { MarkLineComponentOption } from "echarts";

const ITEM_COLOR = "#E24D42";
export const BaseMarkLine = ({
  data,
  ...props
}: MarkLineComponentOption): MarkLineComponentOption => ({
  itemStyle: {
    color: ITEM_COLOR
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
