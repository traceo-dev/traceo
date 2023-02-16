import { FC, lazy } from "react";
import { LogLevel } from "@traceo/types";
import {
  commonSeriesOptions,
  getLogExploreOptions,
  mapLogColor,
  mapLogName
} from "./util";

interface Props {
  logs: {
    level: Record<LogLevel, number[]>;
    xAxis: number[];
  };
}
const ReactECharts = lazy(() => import("echarts-for-react"));
const LogsExplorePlot: FC<Props> = ({ logs }) => {
  const series = Object.values(LogLevel).reduce((acc, level) => {
    acc.push({
      data: logs.level[level],
      color: mapLogColor[level],
      name: mapLogName[level],
      ...commonSeriesOptions
    });

    return acc;
  }, []);

  return (
    <ReactECharts
      style={{ height: "150px" }}
      option={getLogExploreOptions(logs.xAxis, series)}
    />
  );
};

export default LogsExplorePlot;
