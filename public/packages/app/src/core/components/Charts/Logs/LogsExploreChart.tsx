import {
  commonSeriesOptions,
  mapLogBarsColor,
  mapLogName
} from "../../../../features/project/explore/components/utils";
import { Dictionary, LogLevel } from "@traceo/types";
import { FC, useEffect, useState } from "react";
import dateUtils from "../../../utils/date";
import { SeriesOption } from "echarts";
import { BaseChart } from "../BaseChart";
import { LocalStorage } from "../../../lib/localStorage/types";
import { localStorageService } from "../../../lib/localStorage";
import { BaseDataZoom } from "../BaseDataZoom";
import { BaseLegend } from "../BaseLegend";
import { BaseTooltip } from "../BaseTooltip";
import { BaseXAxis } from "../BaseXAxis";
import { BaseYAxis } from "../BaseYAxis";
import dayjs from "dayjs";
import { EchartDataZoomProps, EchartLegendProps } from "../types";

const FIVE_MINTUES = 5;
const TWENTY_FOUR_HOURS = 1440;
const THREE_DAYS = TWENTY_FOUR_HOURS * 3;
const GRAPH_DIMENSIONS = ["timestamp", "log"];

export type LogsType = {
  level: Record<LogLevel, number[]>;
  xAxis: number[];
};

interface Props {
  graph: [number, number][];
  ranges: [number, number];
  setRanges: (val: [number, number]) => void;
  setLegendItems: (level: LogLevel[]) => void;
  legendItems?: Dictionary<boolean>;
  zoom?: boolean;
  onZoom?: (ranges: [number, number]) => void;
}

const LogsExploreChart: FC<Props> = ({
  ranges = [undefined, undefined],
  graph = [],
  legendItems = {},
  setRanges = undefined,
  setLegendItems = undefined,
  zoom,
  onZoom = undefined
}) => {
  const [activeZoom, setActiveZoom] = useState<boolean>(zoom);

  // Blocking zoom feature on chart when there is too small count of series on time axis
  useEffect(() => {
    if (ranges) {
      const s = dayjs.unix(ranges[0]);
      const e = dayjs.unix(ranges[1]);
      const diffInMinutes = e.diff(s, "minutes");

      if (diffInMinutes <= FIVE_MINTUES) {
        setActiveZoom(false);
      } else {
        setActiveZoom(true);
      }
    }
  }, [ranges]);

  const onDataZoom = (params: EchartDataZoomProps) => {
    const { startValue, endValue } = params.batch[0];

    const start = graph[startValue][0];
    const end = graph[endValue][0];

    onZoom([start, end]);
  };

  const pointerFormatter = ({ value }: any) => {
    return dayjs.unix(value).format("MMM D, HH:mm");
  };

  const labelFormatter = (value: any, index: number) => {
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

  const serieOption = {
    ...commonSeriesOptions,
    color: "#7c878d",
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
          color: "#CCCCDC",
          fontSize: 11
        },
        minInterval: 1,
        axisLine: {
          show: false
        }
      })}
      activeZoomSelect={activeZoom}
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
