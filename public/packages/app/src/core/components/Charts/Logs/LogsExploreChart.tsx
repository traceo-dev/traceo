import {
  commonSeriesOptions,
  mapLogBarsColor,
  mapLogName
} from "../../../../features/app/explore/components/utils";
import { Dictionary, LogLevel } from "@traceo/types";
import { FC } from "react";
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
import { EchartDataZoomProps, EchartLegendProps, EchartOnClickProps } from "../types";

type LogsType = {
  level: Record<LogLevel, number[]>;
  xAxis: number[];
};

interface Props {
  logs: LogsType;
  setRanges: (val: [number, number]) => void;
  setLegendItems: (level: LogLevel[]) => void;
  legendItems?: Dictionary<boolean>;
  zoom?: boolean;
}

const LogsExploreChart: FC<Props> = ({ logs, legendItems, setRanges, setLegendItems, zoom }) => {
  const series = Object.values(LogLevel).reduce((acc, level) => {
    acc.push({
      data: logs.level[level],
      color: mapLogBarsColor[level],
      name: mapLogName[level],
      ...commonSeriesOptions
    });

    return acc;
  }, []) as SeriesOption;

  const onDataZoom = (params: EchartDataZoomProps) => {
    const { startValue, endValue } = params.batch[0];
    if (startValue && endValue && logs.xAxis.length > 0) {
      const data = logs.xAxis.slice(startValue, endValue);
      setRanges([data[0], data[data.length - 1]]);
    }
  };

  const onLegendChange = (params: EchartLegendProps) => {
    const levels = Object.entries(params.selected).map(
      ([item, value]) => value && (item.toLowerCase() as LogLevel)
    );
    setLegendItems(levels);
    // We store selected levels from echart legend inside local storage
    localStorageService.set(LocalStorage.LogLevels, levels.join(","));
  };

  const onBarClick = (params: EchartOnClickProps) => {
    // params.name is and equivalent to clicked value on x axis,
    // in this case is a unix value
    const selectedTime = dayjs.unix(parseInt(params.name));

    setRanges([selectedTime.subtract(1, "minute").unix(), selectedTime.unix()]);
  };

  const labelFormatter = (v: unknown) => dateUtils.formatDate(Number(v), "HH:mm");
  const pointerFormatter = (v: unknown) => dateUtils.formatDate(Number(v), "MMM D, HH:mm");

  return (
    <BaseChart
      height="175px"
      onDataZoom={onDataZoom}
      onLegendChange={onLegendChange}
      onClick={onBarClick}
      series={series}
      xAxis={BaseXAxis({
        data: logs.xAxis,
        labelFormatter,
        pointerFormatter
      })}
      yAxis={BaseYAxis({
        minInterval: 1
      })}
      activeZoomSelect={zoom}
      legend={BaseLegend({
        selected: legendItems
      })}
      tooltip={BaseTooltip()}
      dataZoom={BaseDataZoom()}
      grid={{
        left: "15px",
        right: "15px",
        top: "10px",
        bottom: "50px",
        containLabel: true
      }}
    />
  );
};

export default LogsExploreChart;
