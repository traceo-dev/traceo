import {
  IMetric,
  METRIC_UNIT,
  MetricType,
  PLOT_TYPE,
  Setter,
  TimeRange,
  UplotDataType
} from "@traceo/types";
import { HTMLProps, useMemo } from "react";
import BaseUPlotChart from "./BaseUPlotChart";
import { UPlotConfigBuilder } from "./UPlotConfigBuilder";
import { hook } from "./hooks";
import { calculateOpacity } from "../../../core/utils/colors";
import { ChartType } from "./types";

interface Props extends Omit<HTMLProps<HTMLElement>, "height"> {
  datasource: UplotDataType;
  metric: IMetric;
  height?: number;
  extra?: JSX.Element;
  isLoading?: boolean;
  onZoom?: Setter<TimeRange>;
  panelName?: JSX.Element | string;
}

const buildSeries = (builder: UPlotConfigBuilder, metric: IMetric) => {
  if (metric.series && metric.series.length > 0) {
    for (const serie of metric.series) {
      const isHistogram = metric.type === MetricType.HISTOGRAM;
      const chartType = isHistogram ? PLOT_TYPE.BAR : (serie.config.type as PLOT_TYPE);
      const isArea = serie.config.area.show;
      const areaOpacity = serie.config.area.opacity;

      builder.addSerie({
        type: chartType,
        stroke: serie.config.color,
        width: serie.config.lineWidth,
        fill: calculateOpacity(serie.config.color, isArea ? areaOpacity : 0),
        points: {
          show: metric.config.line.marker.show
        },
        bar: {
          width: serie.config.barWidth,
          align: isHistogram ? 1 : 0
        },
        label: serie.field
      });
    }
  }
};

export const BaseMetricChart = ({
  datasource = [[], []],
  metric = undefined,
  onZoom = undefined,
  height = 350
}: Props) => {
  const isHistogram = metric?.type === MetricType.HISTOGRAM;
  const isTimeseries = metric?.type === MetricType.TIME_SERIES;

  const mapMetricType: Record<MetricType, ChartType> = {
    histogram: "histogram",
    time_series: "timeseries"
  };

  const configs = useMemo(() => {
    const showLegend = metric?.config.legend.show;
    const showXAxis = metric?.config.axis.showX;
    const showYAxis = metric?.config.axis.showY;
    const showGridLines = metric?.config.axis.showGridLines;
    const unit = metric?.unit === METRIC_UNIT.NONE ? "" : metric?.unit;

    const stacked = metric.config.stack.show;
    const showTooltip = !stacked && metric?.config.tooltip.show;

    const plotHeight = !showLegend ? height + 30 : height;

    const builder = new UPlotConfigBuilder();
    buildSeries(builder, metric);

    return builder
      .addBase({
        chartType: mapMetricType[metric?.type],
        height: plotHeight,
        stacked,
        data: datasource,
        histogram: {
          bucketSize: metric?.config.histogram?.bucket.size,
          max: metric.config.histogram?.max ?? undefined,
          min: metric.config.histogram?.min ?? 0
        }
      })
      .addLegend({
        show: showLegend
      })
      .addAxe({
        scale: "x",
        isTimeAxis: isTimeseries,
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
        formatter: unit
          ? (_: uPlot, splits: number[], __: number, ___: number, ____: number) => {
              return splits.map((e) => `${e} ${unit}`);
            }
          : undefined
      })
      .addScale({
        x: {
          time: !isHistogram
        }
      })
      .addHook("setSelect", (self: uPlot) => hook.setSelect(self, onZoom))
      .addTooltip({
        show: showTooltip
      })
      .build();
  }, [metric, datasource]);

  return <BaseUPlotChart configs={configs} />;
};
