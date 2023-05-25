import { ConditionalWrapper } from "../../ConditionLayout";
import { DataNotFound } from "../../DataNotFound";
import { buildSeries } from "./utils";
import { IMetric, METRIC_UNIT, MetricPreviewType, Setter } from "@traceo/types";
import { FC } from "react";
import { BaseChart } from "../BaseChart";
import { BaseXAxis } from "../BaseXAxis";
import { BaseYAxis } from "../BaseYAxis";
import { timeAxisFormatter } from "../utils";
import { BaseTooltip } from "../BaseTooltip";
import { EchartDataZoomProps } from "../types";

interface Props {
  metric: IMetric;
  data: MetricPreviewType;
  ranges: [number, number];
  setRanges: Setter<[number, number]>;
  isLoading: boolean;
}

const MetricChart: FC<Props> = ({
  metric,
  ranges = [undefined, undefined],
  isLoading = false,
  data = undefined,
  setRanges = undefined
}) => {
  const labelFormatter = (value: any, _index: number) =>
    timeAxisFormatter(value, ranges[0], ranges[1]);

  const pointerFormatter = ({ value }: any) => timeAxisFormatter(value, ranges[0], ranges[1]);

  const showLegend = metric.config.legend.show;
  const legendOrient = metric.config.legend.orient;

  const grid = {
    containLabel: true,
    right: showLegend && legendOrient === "vertical" ? 120 : 10,
    left: 10,
    bottom: showLegend ? (legendOrient === "vertical" ? 10 : 50) : 10,
    top: 10
  };

  const legend = {
    show: showLegend,
    orient: legendOrient as any,
    right: legendOrient === "vertical" ? 10 : null,
    bottom: legendOrient === "horizontal" ? null : 10,
    top: legendOrient === "vertical" ? "center" : "bottom",
    left: legendOrient === "horizontal" ? 10 : null,
    textStyle: {
      color: "#CCCCDC"
    },
    icon: "roundRect",
    itemHeight: 5
  };

  const onDataZoom = (params: EchartDataZoomProps) => {
    const { startValue, endValue } = params.batch[0];
    setRanges([startValue, endValue]);
  };

  return (
    <ConditionalWrapper
      isLoading={isLoading}
      isEmpty={!data?.datasource}
      emptyView={<DataNotFound className="text-2xs" label="Data not found" />}
    >
      <BaseChart
        height="180px"
        renderer="canvas"
        onDataZoom={onDataZoom}
        legend={legend}
        grid={grid}
        tooltip={BaseTooltip({
          pointer: "line"
        })}
        xAxis={BaseXAxis({
          type: "time",
          offset: 12,
          axisLabel: {
            formatter: labelFormatter,
            fontSize: 11,
            showMaxLabel: false,
            showMinLabel: false
          },
          pointerFormatter
        })}
        yAxis={BaseYAxis({
          type: "value",
          axisLabel: {
            formatter: `{value} ${metric.unit === METRIC_UNIT.NONE ? "" : metric.unit}`
          },
          minInterval: 1
        })}
        dataZoom={{
          type: "inside",
          xAxisIndex: [0],
          zoomOnMouseWheel: false,
          zoomLock: true,
          throttle: 50
        }}
        activeZoomSelect={true}
        series={buildSeries(metric.series, metric, data?.datasource, "card")}
      />
    </ConditionalWrapper>
  );
};

export default MetricChart;
