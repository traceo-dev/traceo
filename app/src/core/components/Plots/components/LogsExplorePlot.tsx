import dateUtils from "core/utils/date";
import { statistics } from "core/utils/statistics";
import { FC } from "react";
import { TraceoLog } from "types/logs";
import ReactECharts from "echarts-for-react";
import { EChartsOption } from "echarts";

interface Props {
  logs: TraceoLog[];
  startDate: number;
  endDate: number;
}
export const LogsExplorePlot: FC<Props> = ({ logs, startDate, endDate }) => {
  const data = statistics.getExploreLogsPlotData(startDate, endDate, logs);

  const options: EChartsOption = {
    dataset: {
      source: data
    },
    animation: false,
    grid: {
      left: "24px",
      right: "24px",
      top: "32px",
      containLabel: true
    },
    xAxis: {
      type: "category",
      axisLabel: {
        formatter: (v) => dateUtils.formatDate(Number(v), "HH:mm"),
        color: "white",
        fontSize: 11,
        padding: 0,
        interval: 5
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
    series: [
      {
        type: "bar",
        color: "#0991b3",
        barWidth: 15
      }
    ]
  };

  return (
    <>
      <div className="pointer-events-none">
        <ReactECharts option={options} />
      </div>
      <style>{`
          .echarts-for-react {
            height: 280px !important;
          }
    `}</style>
    </>
  );
};
