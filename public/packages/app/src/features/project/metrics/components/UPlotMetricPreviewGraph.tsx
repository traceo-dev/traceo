import { Setter, TimeRange, IMetric, METRIC_UNIT, UplotDataType } from "@traceo/types";
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

export const UPlotMetricPreviewGraph = ({
  datasource = [[]],
  metric = undefined,
  onZoom = undefined
}: Props) => {
  const configs = useMemo(() => {
    const showTooltip = metric?.config.tooltip.show;
    const showLegend = metric?.config.legend.show;
    const showXAxis = metric?.config.axis.showX;
    const showYAxis = metric?.config.axis.showY;
    const showGridLines = metric?.config.axis.showGridLines;
    // const legendOrient = metric?.config.legend.orient;
    const unit = metric?.unit === METRIC_UNIT.NONE ? "" : metric?.unit;
    const stacked = metric.config.stack.show;

    const builder = new UPlotConfigBuilder();
    buildSeries(builder, metric);

    return builder
      .addBase({
        height: 350,
        stacked,
        data: datasource
      })
      .addLegend({
        show: showLegend
      })
      .addAxe({
        scale: "x",
        isTimeAxis: true,
        show: showXAxis,
        grid: {
          show: showGridLines
        }
      })
      .addAxe({
        scale: "y",
        show: showYAxis,
        grid: {
          show: showGridLines
        },
        formatter: (
          _self: uPlot,
          splits: number[],
          _axisIdx: number,
          _foundSpace: number,
          _foundIncr: number
        ) => {
          return splits.map((e) => `${e} ${unit}`);
        }
      })
      .addScale({
        x: {
          time: true,
          auto: false
        }
      })
      .addHook("setSelect", (self: uPlot) => hook.setSelect(self, onZoom))
      .addTooltip({
        show: !stacked && showTooltip
      })
      .build();
  }, [metric, datasource]);

  return <BaseUPlotChart configs={configs} />;
};
