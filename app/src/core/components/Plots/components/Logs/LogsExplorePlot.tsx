import { statisticUtils } from "../../../../utils/statistics";
import { FC, useMemo } from "react";
import { LogLevel, TraceoLog } from "../../../../../types/logs";
import ReactECharts from "echarts-for-react";
import {
  commonSeriesOptions,
  getLogExploreOptions,
  handleLogColor,
  handleLogName
} from "./util";

interface Props {
  logs: TraceoLog[];
  startDate: number;
  endDate: number;
}

export const LogsExplorePlot: FC<Props> = ({ logs, startDate, endDate }) => {
  const data = useMemo(
    () => statisticUtils.parseExploreLogsPlotData(startDate, endDate, logs),
    [startDate, endDate, logs]
  );

  const series = Object.values(LogLevel).reduce((acc, level) => {
    acc.push({
      data: data.level[level],
      color: handleLogColor[level],
      name: handleLogName[level],
      ...commonSeriesOptions
    });

    return acc;
  }, []);

  return (
    <>
      <ReactECharts option={getLogExploreOptions(data.xAxis, series)} />
      <style>{`
          .echarts-for-react {
            height: 280px !important;
          }
      `}</style>
    </>
  );
};
