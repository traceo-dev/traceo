import {
  DashboardPanel,
  DeepPartial,
  METRIC_UNIT,
  PLOT_TYPE,
  Setter,
  TimeRange,
  UplotDataType,
  VISUALIZATION_TYPE
} from "@traceo/types";
import { HTMLProps, useMemo } from "react";
import BaseUPlotChart from "./BaseUPlotChart";
import { UPlotConfigBuilder } from "./UPlotConfigBuilder";
import { hook } from "./hooks";
import { calculateOpacity } from "../../../core/utils/colors";
import { FormatterType } from "./types";

interface Props extends Omit<HTMLProps<HTMLElement>, "height"> {
  datasource: UplotDataType;
  panel: DeepPartial<DashboardPanel>;
  height?: number;
  extra?: JSX.Element;
  isLoading?: boolean;
  onZoom?: Setter<TimeRange>;
  panelName?: JSX.Element | string;
  xFormatter?: FormatterType;
}

const buildSeries = (builder: UPlotConfigBuilder, panel: DeepPartial<DashboardPanel>) => {
  const series = panel.config.series || [];
  const config = panel.config;
  const visualization = config.visualization;

  for (const serie of series) {
    if (!serie.datasource.field) {
      continue;
    }

    const isHistogram = visualization === VISUALIZATION_TYPE.HISTOGRAM;
    const chartType = isHistogram ? PLOT_TYPE.BAR : (serie.config.type as PLOT_TYPE);
    const isArea = serie.config.area.show;
    const areaOpacity = serie.config.area.opacity;

    builder.addSerie({
      type: chartType,
      stroke: serie.config.color,
      width: serie.config.lineWidth,
      fill: calculateOpacity(serie.config.color, isArea ? areaOpacity : 0),
      points: {
        show: config.line.marker.show
      },
      bar: {
        width: serie.config.barWidth,
        align: isHistogram ? 1 : 0
      },
      label: serie.datasource.field
    });
  }
};

export const BaseMetricChart = ({
  datasource = [[], []],
  panel = undefined,
  onZoom = undefined,
  height = 350,
  xFormatter
}: Props) => {
  const config = panel.config;
  const histogram = config?.histogram;
  const cUnit = panel.config.unit;
  const visualization = config.visualization;

  const isHistogram = visualization === VISUALIZATION_TYPE.HISTOGRAM;
  const isTimeseries = visualization === VISUALIZATION_TYPE.TIME_SERIES;

  const unit = cUnit === METRIC_UNIT.NONE ? "" : cUnit;

  const configs = useMemo(() => {
    const showLegend = config.legend.show;
    const showXAxis = config.axis.showX;
    const showYAxis = config.axis.showY;
    const showFloatLabels = config.axis?.showFloatLabels ?? true;
    const showGridLines = config.axis.showGridLines;

    const stacked = config.stack.show;
    const showTooltip = !stacked && config.tooltip.show;

    const plotHeight = !showLegend ? height + 30 : height;

    const builder = new UPlotConfigBuilder();

    // Create series objects for builder
    buildSeries(builder, panel);

    return builder
      .addBase({
        chartType: panel.config.visualization,
        height: plotHeight,
        isZoom: !isHistogram && panel.type === "custom",
        stacked,
        data: datasource,
        histogram: {
          bucketSize: histogram.bucket.size,
          max: histogram.max ?? undefined,
          min: histogram.min ?? 0
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
        },
        formatter: xFormatter
      })
      .addAxe({
        scale: "y",
        show: showYAxis,
        showFloatLabels,
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
  }, [panel, datasource, height]);

  return <BaseUPlotChart configs={configs} />;
};
