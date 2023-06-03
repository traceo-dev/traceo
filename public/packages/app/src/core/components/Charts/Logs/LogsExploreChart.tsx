import { commonSeriesOptions } from "../../../../features/project/explore/components/utils";
import { LogLevel, Setter, TimeRange } from "@traceo/types";
import { FC } from "react";
import { SeriesOption } from "echarts";
import { BaseChart } from "../BaseChart";
import { BaseDataZoom } from "../BaseDataZoom";
import { BaseTooltip } from "../BaseTooltip";
import { BaseXAxis } from "../BaseXAxis";
import { BaseYAxis } from "../BaseYAxis";
import { EchartDataZoomProps } from "../types";
import { timeAxisFormatter } from "../utils";
import { theme } from "../../../../core/utils/theme";

const GRAPH_DIMENSIONS = ["timestamp", "log"];

export type LogsType = {
  level: Record<LogLevel, number[]>;
  xAxis: number[];
};

interface Props {
  graph: TimeRange[];
  ranges: TimeRange;
  zoom?: boolean;
  onZoom?: Setter<TimeRange>;
}

const LogsExploreChart: FC<Props> = ({
  ranges = [undefined, undefined],
  graph = [],
  zoom,
  onZoom = undefined
}) => {
  const onDataZoom = (params: EchartDataZoomProps) => {
    const { startValue, endValue } = params.batch[0];

    const start = graph[startValue][0];
    const end = graph[endValue][0];

    if (!start || !end) {
      return;
    }

    onZoom([start, end]);
  };

  /**
   * Labels formatter for tooltip.
   */
  const pointerFormatter = ({ value }: any) => timeAxisFormatter(value, ranges[0], ranges[1]);

  /**
   * Labels formatter depending on how much chart is zooming.
   * When time range is over 24h then we show only date ("DD/MM") without any time.
   */
  const labelFormatter = (value: any, _index: number) =>
    timeAxisFormatter(value, ranges[0], ranges[1]);

  const serieOption = {
    ...commonSeriesOptions,
    color: theme.chart.logs.barColor,
    name: "logs"
  } as SeriesOption;

  return (
    <BaseChart
      height="175px"
      onDataZoom={onDataZoom}
      dataset={{
        source: graph,
        dimensions: GRAPH_DIMENSIONS
      }}
      series={serieOption}
      xAxis={BaseXAxis({
        /**
         *  There should be used type: "time" but EChart does not want
         *  to cooperate when it comes to zooming the chart
         *  (loses labels on the timeline)
         */
        type: "category",
        offset: 12,
        splitNumber: 4,
        axisLabel: {
          width: 100,
          showMaxLabel: true,
          showMinLabel: true,
          margin: 12,
          interval: "auto",
          hideOverlap: true
        },
        labelFormatter,
        pointerFormatter
      })}
      yAxis={BaseYAxis({
        type: "value",
        offset: 12,
        axisLabel: {
          showMinLabel: true
        },
        minInterval: 1,
        axisLine: {
          show: false
        }
      })}
      activeZoomSelect={zoom}
      tooltip={BaseTooltip({
        pointer: "line"
      })}
      dataZoom={BaseDataZoom()}
      grid={{
        left: "15px",
        right: "15px",
        top: "10px",
        bottom: "20px",
        containLabel: true
      }}
    />
  );
};

export default LogsExploreChart;
