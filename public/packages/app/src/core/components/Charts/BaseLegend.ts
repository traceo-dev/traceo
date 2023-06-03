import { Dictionary } from "@traceo/types";
import { LegendComponentOption } from "echarts";
import { theme } from "../../../core/utils/theme";

interface BaseLegendOptions {
  position?: "horizontal" | "vertical";
  selected?: Dictionary<boolean>;
}
export const BaseLegend = ({ selected }: BaseLegendOptions): LegendComponentOption => ({
  icon: "roundRect",
  itemHeight: 5,
  textStyle: {
    color: theme.chart.legend.color
  },
  selected,
  bottom: 0,
  left: 30
});
