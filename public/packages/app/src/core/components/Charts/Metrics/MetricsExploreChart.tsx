import { ConditionalWrapper } from "../../ConditionLayout";
import { DataNotFound } from "../../DataNotFound";
import { EXPLORE_PLOT_TYPE, ExploreSerieType, Setter, TimeRange } from "@traceo/types";
import { FC } from "react";
import { BaseChart } from "../BaseChart";
import { BaseXAxis } from "../BaseXAxis";
import { BaseYAxis } from "../BaseYAxis";
import { timeAxisFormatter } from "../utils";
import { BaseTooltip } from "../BaseTooltip";
import { EchartDataZoomProps } from "../types";
import { SeriesOption } from "echarts";
import { BaseLegend } from "../BaseLegend";

interface Props {
  datasource: TimeRange[];
  ranges: TimeRange;
  series: ExploreSerieType[];
  onZoom?: Setter<TimeRange>;
  type: EXPLORE_PLOT_TYPE;
  stacked: boolean;
  markers: boolean;
}

const MetricsExploreChart: FC<Props> = ({
  ranges = [undefined, undefined],
  datasource = undefined,
  series = [],
  onZoom = undefined,
  type = "line",
  stacked = false,
  markers = false
}) => {
  const labelFormatter = (value: any, _index: number) =>
    timeAxisFormatter(value, ranges[0], ranges[1]);

  const pointerFormatter = ({ value }: any) => timeAxisFormatter(value, ranges[0], ranges[1]);

  const grid = {
    containLabel: true,
    right: 10,
    left: 10,
    bottom: 60,
    top: 10
  };

  const onDataZoom = (params: EchartDataZoomProps) => {
    const { startValue, endValue } = params.batch[0];
    onZoom([startValue, endValue]);
  };

  const seriesOptions: SeriesOption[] = series.map((serie, index) => ({
    ...serie,
    type: type === "area" ? "line" : (type as any),
    data: datasource[index],
    showSymbol: markers,
    stack: stacked ? "total" : undefined,
    lineStyle: {
      width: type === "line" ? 1 : 0
    },
    areaStyle: type === "area" ? {} : undefined
  }));

  return (
    <ConditionalWrapper
      isEmpty={!datasource}
      emptyView={<DataNotFound className="text-2xs" label="Data not found" />}
    >
      <BaseChart
        height="380px"
        renderer="canvas"
        onDataZoom={onDataZoom}
        legend={BaseLegend({
          position: "horizontal"
        })}
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
        series={seriesOptions}
      />
    </ConditionalWrapper>
  );
};

export default MetricsExploreChart;
