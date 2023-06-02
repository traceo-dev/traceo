import { buildSeries } from "./utils";
import {
  IMetric,
  DeepPartial,
  METRIC_UNIT,
  MetricResponseType,
  TimeRange,
  Setter
} from "@traceo/types";
import { FC, useMemo } from "react";
import { ConditionalWrapper } from "../../ConditionLayout";
import { DataNotFound } from "../../DataNotFound";
import { BaseChart } from "../BaseChart";
import { BaseXAxis } from "../BaseXAxis";
import { BaseYAxis } from "../BaseYAxis";
import { BaseTooltip } from "../BaseTooltip";
import { EchartDataZoomProps } from "../types";
import { timeAxisFormatter } from "../utils";

interface Props {
  options: DeepPartial<IMetric>;
  datasource: [number, number][];
  isLoading: boolean;
  ranges?: TimeRange;
  setRanges?: Setter<TimeRange>;
  activeZoomSelect?: boolean;
}
const MetricPreviewChart: FC<Props> = ({
  ranges = [undefined, undefined],
  options = {},
  isLoading = false,
  datasource = undefined,
  activeZoomSelect = false,
  setRanges
}) => {
  const showTooltip = options?.config.tooltip.show;
  const showLegend = options?.config.legend.show;
  const showXAxis = options?.config.axis.showX;
  const showYAxis = options?.config.axis.showY;
  const showGridLines = options?.config.axis.showGridLines;
  const legendOrient = options?.config.legend.orient;
  const unit = options?.unit === METRIC_UNIT.NONE ? "" : options?.unit;

  const echartOptions = useMemo(() => {
    const seriesOptions = buildSeries(options?.series, options, datasource, "preview");

    return {
      tooltip: BaseTooltip({
        show: showTooltip,
        pointer: "line"
      }),
      legend: {
        show: showLegend,
        orient: legendOrient as any,
        right: legendOrient === "vertical" ? 10 : null,
        bottom: legendOrient === "horizontal" ? null : 10,
        top: legendOrient === "vertical" ? "center" : "bottom",
        left: legendOrient === "horizontal" ? 40 : null,
        textStyle: {
          color: "#ffffff"
        },
        icon: "roundRect",
        itemHeight: 5
      },
      grid: {
        containLabel: true,
        right: showLegend && legendOrient === "vertical" ? 120 : 10,
        left: 10,
        bottom: showLegend ? (legendOrient === "vertical" ? 10 : 50) : 10,
        top: 10
      },
      series: seriesOptions
    };
  }, [datasource]);

  const onDataZoom = (params: EchartDataZoomProps) => {
    const { startValue, endValue } = params.batch[0];
    setRanges([startValue, endValue]);
  };

  const labelFormatter = (value: any, _index: number) =>
    ranges ? timeAxisFormatter(value, ranges[0], ranges[1]) : value;

  const pointerFormatter = ({ value }: any) =>
    ranges ? timeAxisFormatter(value, ranges[0], ranges[1]) : value;

  return (
    <ConditionalWrapper isLoading={isLoading} emptyView={<DataNotFound />}>
      <BaseChart
        height={"345px"}
        renderer="canvas"
        onDataZoom={onDataZoom}
        activeZoomSelect={activeZoomSelect}
        series={echartOptions.series}
        tooltip={echartOptions.tooltip}
        legend={echartOptions.legend}
        grid={echartOptions.grid}
        xAxis={BaseXAxis({
          type: "time",
          splitLine: {
            show: showGridLines
          },
          splitNumber: 12,
          offset: 12,
          axisLabel: {
            show: showXAxis
          },
          labelFormatter,
          pointerFormatter
        })}
        yAxis={BaseYAxis({
          type: "value",
          splitLine: {
            show: showGridLines
          },
          axisLabel: {
            show: showYAxis,
            formatter: `{value} ${unit}`,
            interval: "auto"
          },
          minInterval: 1
        })}
      />
    </ConditionalWrapper>
  );
};

export default MetricPreviewChart;
