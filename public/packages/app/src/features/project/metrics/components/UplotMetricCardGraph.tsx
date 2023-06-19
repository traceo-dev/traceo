import { IMetric, Setter, TimeRange, UplotDataType } from "@traceo/types";
import { useMemo } from "react";
import BaseUPlotChart from "../../../../core/components/UPlot/BaseUPlotChart";
import { UPlotConfigBuilder } from "../../../../core/components/UPlot/UPlotConfigBuilder";
import { hook } from "../../../../core/components/UPlot/hooks";
import { buildSeries } from "./utils";

interface Props {
  datasource: UplotDataType;
  onZoom?: Setter<TimeRange>;
  metric: IMetric;
}

export const UPlotMetricsCardGraph = ({
  datasource = [[]],
  metric = undefined,
  onZoom = undefined
}: Props) => {
  const configs = useMemo(() => {
    const builder = new UPlotConfigBuilder();
    buildSeries(builder, metric);

    return builder
      .addBase({
        height: 180,
        stacked: metric.config?.stack.show,
        data: datasource
      })
      .addAxe({
        scale: "x",
        isTimeAxis: true
      })
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
  }, [metric, datasource]);

  return <BaseUPlotChart configs={configs} />;
};
