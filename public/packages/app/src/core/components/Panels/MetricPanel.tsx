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
import BaseUPlotChart from "../UPlot/BaseUPlotChart";
import { UPlotConfigBuilder } from "../UPlot/UPlotConfigBuilder";
import { prepareBinsData, calculateHistogramBins } from "../UPlot/histogram";
import { hook } from "../UPlot/hooks";
import { ContentCard } from "../ContentCard";
import { calculateOpacity } from "src/core/utils/colors";

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

export const MetricPanel = ({
  datasource = [[], []],
  metric = undefined,
  onZoom = undefined,
  height = 350,
  extra = undefined,
  isLoading = false,
  panelName = undefined,
  ...props
}: Props) => {
  const isHistogram = metric?.type === MetricType.HISTOGRAM;
  const bucketSize = metric?.config.histogram?.bucket.size;

  const ds = useMemo(() => {
    if (isHistogram) {
      return prepareBinsData(datasource, {
        bucketSize,
        max: metric.config.histogram?.max ?? 0,
        min: metric.config.histogram?.min || undefined
      });
    }

    return datasource;
  }, [datasource, metric]);

  const histogramSplits = () => {
    const bucketSize = metric?.config.histogram?.bucket.size;
    return calculateHistogramBins(datasource, bucketSize);
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
        height: plotHeight,
        stacked,
        data: ds,
        isZoom: !isHistogram
      })
      .addLegend({
        show: showLegend
      })
      .addAxe({
        scale: "x",
        isTimeAxis: !isHistogram,
        show: showXAxis,
        grid: {
          show: showGridLines
        },
        splits: isHistogram ? histogramSplits : undefined
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
  }, [metric, ds]);

  return (
    <ContentCard
      {...props}
      name={panelName}
      loading={isLoading}
      extra={extra}
      bodyClassName="m-0"
    >
      <BaseUPlotChart configs={configs} />
    </ContentCard>
  );
};
