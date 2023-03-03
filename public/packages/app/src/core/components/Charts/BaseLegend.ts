import { Dictionary } from "@traceo/types";
import { LegendComponentOption } from "echarts";

export type EchartLegendProps = {
  // Name of the clicked legend item
  name: string;
  // Event name = legendselectchanged
  type: string;
  // Selected/Unselected legend items
  selected: Record<string, boolean>;
};

interface BaseLegendOptions {
  position?: "horizontal" | "vertical";
  selected?: Dictionary<boolean>;
}
export const BaseLegend = (props: BaseLegendOptions): LegendComponentOption => {
  const { selected } = props;
  return {
    icon: "roundRect",
    itemHeight: 5,
    textStyle: {
      color: "#ffffff"
    },
    selected,
    // TODO: values based on position
    bottom: 0,
    left: 30
  };
};
