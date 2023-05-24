import { ConditionalWrapper } from "../../ConditionLayout";
import { DataNotFound } from "../../DataNotFound";
import { buildSeries } from "./utils";
import { IMetric, METRIC_UNIT, MetricPreviewType } from "@traceo/types";
import { FC } from "react";
import { BaseChart } from "../BaseChart";
import { BaseXAxis } from "../BaseXAxis";
import { BaseYAxis } from "../BaseYAxis";
import { timeAxisFormatter } from "../utils";
import { BaseLegend } from "../BaseLegend";
import { BaseTooltip } from "../BaseTooltip";

interface Props {
  metric: IMetric;
  data: MetricPreviewType;
  ranges: [number, number];
  isLoading: boolean;
}

const MetricChart: FC<Props> = ({ metric, ranges, isLoading, data }) => {
  const labelFormatter = (value: any, _index: number) =>
    timeAxisFormatter(value, ranges[0], ranges[1]);

  const pointerFormatter = ({ value }: any) => timeAxisFormatter(value, ranges[0], ranges[1]);

  return (
    <ConditionalWrapper
      isLoading={isLoading}
      isEmpty={!data?.datasource}
      emptyView={<DataNotFound className="text-2xs" label="Data not found" />}
    >
      <BaseChart
        height="200px"
        renderer="canvas"
        tooltip={BaseTooltip()}
        xAxis={BaseXAxis({
          offset: 12,
          axisLabel: {
            formatter: labelFormatter,
            fontSize: 11,
            showMaxLabel: false,
            showMinLabel: false
          },
          pointerFormatter,
          data: data?.datasource["time"]
        })}
        yAxis={BaseYAxis({
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
        grid={{
          containLabel: true,
          right: 20,
          left: 10,
          bottom: 15,
          top: 10
        }}
        series={buildSeries(metric.series, metric, data?.datasource, "card")}
      />
    </ConditionalWrapper>
  );
};

export default MetricChart;
