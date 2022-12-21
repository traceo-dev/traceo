import dateUtils from "../../../../core/utils/date";
import { statisticUtils } from "../../../../core/utils/statistics";
import { FC, useMemo } from "react";
import { LogLevel, TraceoLog } from "../../../../types/logs";
import ReactECharts from "echarts-for-react";
import { EChartsOption } from "echarts";
import { tooltipOptions } from "../utils";
import { useSelector } from "react-redux";
import { StoreState } from "types/store";

interface Props {
  logs: TraceoLog[];
  startDate: number;
  endDate: number;
}

const handleLogName: Record<LogLevel, string> = {
  [LogLevel.Log]: "Log",
  [LogLevel.Debug]: "Debug",
  [LogLevel.Info]: "Info",
  [LogLevel.Error]: "Error",
  [LogLevel.Warn]: "Warning"
};

const handleLogColor: Record<LogLevel, string> = {
  [LogLevel.Log]: "#2b6cb0",
  [LogLevel.Debug]: "#f6993f",
  [LogLevel.Info]: "#176537",
  [LogLevel.Error]: "#e53e3e",
  [LogLevel.Warn]: "#F7DF4B"
};

const commonSeriesOptions = {
  type: "bar",
  stack: "Ad",
  barWidth: 15,
  itemStyle: {
    borderColor: "transparent",
    borderWidth: 2,
    borderRadius: 2
  }
};

export const LogsExplorePlot: FC<Props> = ({ logs, startDate, endDate }) => {
  const { hasFetched } = useSelector((state: StoreState) => state.logs);

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

  const options: EChartsOption = {
    animation: false,
    tooltip: {
      ...tooltipOptions,
      axisPointer: {
        type: "shadow"
      }
    },
    grid: {
      left: "24px",
      right: "24px",
      top: "32px",
      containLabel: true
    },
    xAxis: {
      data: data.xAxis,
      type: "category",
      axisLabel: {
        formatter: (v) => dateUtils.formatDate(Number(v), "HH:mm"),
        color: "white",
        fontSize: 11,
        padding: 0,
        interval: 5
      },
      axisPointer: {
        label: {
          formatter: (v) => dateUtils.formatDate(v.value as number, "MMM D, HH:mm")
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "#272A30",
          width: 1
        }
      },
      offset: 15
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: "white",
        fontSize: 11
      },
      splitLine: {
        lineStyle: {
          color: "#272A30",
          width: 1
        }
      },
      minInterval: 10,
      offset: 12
    },
    series
  };

  return (
    <>
      <ReactECharts option={options} />
      <style>{`
          .echarts-for-react {
            height: 280px !important;
          }
    `}</style>
    </>
  );
};
