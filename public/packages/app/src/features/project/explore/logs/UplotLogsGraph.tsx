/* eslint @typescript-eslint/no-unused-expressions: 0 */

import uPlot from "uplot";
import BaseUPlotChart from "../../../../core/components/UPlot/BaseUPlotChart";
import { PLOT_TYPE, Setter, UplotDataType } from "@traceo/types";
import { UPlotConfigBuilder } from "../../../../core/components/UPlot/UPlotConfigBuilder";
import { hook } from "../../../../core/components/UPlot/hooks";
import { useMemo } from "react";

interface Props {
  data: UplotDataType;
  onZoom: Setter<[number, number]>;
}
export const UplotLogsGraph = ({ data, onZoom }: Props) => {
  const options = useMemo(() => {
    const builder = new UPlotConfigBuilder();
    return builder
      .addBase({
        height: 300,
        data
      })
      .addSerie({
        type: PLOT_TYPE.BAR,
        stroke: "#3B82F5",
        fill: "#3B82F5",
        // to avoid rendering rects with 0 values
        width: 0,
        points: {
          show: false
        },
        label: "logs",
        bar: {
          width: 100,
          align: 1
        }
      })
      .addAxe({ scale: "x", isTimeAxis: true })
      .addAxe({ scale: "y" })
      .addScale({
        x: {
          time: true,
          auto: false
        }
      })
      .addHook("setSelect", (self: uPlot) => hook.setSelect(self, onZoom))
      .addTooltip({})
      .build();
  }, [data]);

  return <BaseUPlotChart configs={options} />;
};
