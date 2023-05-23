import { commonSeriesOptions } from "../../../../features/project/explore/components/utils";
import { LogLevel } from "@traceo/types";
import { FC } from "react";
import { SeriesOption } from "echarts";
import { BaseChart } from "../BaseChart";
import { BaseDataZoom } from "../BaseDataZoom";
import { BaseTooltip } from "../BaseTooltip";
import { BaseXAxis } from "../BaseXAxis";
import { BaseYAxis } from "../BaseYAxis";
import dayjs from "dayjs";
import { EchartDataZoomProps } from "../types";

const FIVE_MINTUES = 5;
const TWENTY_FOUR_HOURS = 1440;
const GRAPH_DIMENSIONS = ["timestamp", "log"];

const BAR_COLOR = "#3B82F5";
const LABEL_COLOR = "#CCCCDC";

export type LogsType = {
  level: Record<LogLevel, number[]>;
  xAxis: number[];
};

interface Props {
  graph: [number, number][];
  ranges: [number, number];
  zoom?: boolean;
  onZoom?: (ranges: [number, number]) => void;
}

const LogsExploreChart: FC<Props> = ({
  ranges = [undefined, undefined],
  graph = [],
  zoom,
  onZoom = undefined
}) => {
  // const [activeZoom, setActiveZoom] = useState<boolean>(zoom);

  // Blocking zoom feature on chart when there is too small count of series on time axis
  // useEffect(() => {
  //   if (ranges) {
  //     const s = dayjs.unix(ranges[0]);
  //     const e = dayjs.unix(ranges[1]);
  //     const diffInMinutes = e.diff(s, "minutes");

  //     diffInMinutes <= FIVE_MINTUES ? setActiveZoom(false) : setActiveZoom(true);
  //   }
  // }, [ranges]);

  const onDataZoom = (params: EchartDataZoomProps) => {
    const { startValue, endValue } = params.batch[0];

    const start = graph[startValue][0];
    const end = graph[endValue][0];

    if (!start || !end) {
      return;
    }

    onZoom([start, end]);
  };

  const timeFormatter = (value: any) => {
    const start = graph[0][0];
    const end = graph[graph.length - 1][0];

    const s = dayjs.unix(start);
    const e = dayjs.unix(end);

    const diffInMinutes = e.diff(s, "minutes");

    const v = dayjs.unix(value);

    if (diffInMinutes <= FIVE_MINTUES) {
      return v.format("HH:mm:ss");
    }

    if (diffInMinutes <= TWENTY_FOUR_HOURS) {
      return v.format("HH:mm");
    }

    return v.format("DD/MM");
  };

  /**
   * Labels formatter for tooltip.
   */
  const pointerFormatter = ({ value }: any) => timeFormatter(value);

  /**
   * Labels formatter depending on how much chart is zooming.
   * When time range is over 24h then we show only date ("DD/MM") without any time.
   */
  const labelFormatter = (value: any, _index: number) => timeFormatter(value);

  const serieOption = {
    ...commonSeriesOptions,
    color: BAR_COLOR,
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
          showMinLabel: true,
          color: LABEL_COLOR,
          fontSize: 11
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
