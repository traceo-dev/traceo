import dayjs from "dayjs";
import { FC } from "react";
import dateUtils from "../../../utils/date";
import { normalizePlotData, tooltipOptions } from "../utils";
import ReactECharts from "echarts-for-react";
import { EChartsOption, graphic } from "echarts";
import { PlotData } from "../../../../core/utils/statistics";

interface Props {
  stats: PlotData[];
}
export const IncidentsTodayPlot: FC<Props> = ({ stats }) => {
  const plotData = normalizePlotData(stats);

  const option: EChartsOption = {
    dataset: {
      source: plotData
    },
    animation: false,
    tooltip: tooltipOptions,
    grid: {
      left: "24px",
      right: "24px",
      top: "32px",
      containLabel: true
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      axisLabel: {
        formatter: (v) => {
          const isToday = dayjs.unix(Number(v)).isToday();

          if (!isToday) return "23:59";
          return dateUtils.formatDate(Number(v), "HH:mm");
        },
        color: "white",
        fontSize: 11,
        padding: 0,
        interval: 1
      },
      axisPointer: {
        label: {
          formatter: (v) => {
            return `
               ${dateUtils.formatDate(v.value as number, "MMM D")},
               ${dateUtils.formatDate(v.value as number, "HH:mm")}-${dateUtils.formatDate(
              dayjs
                .unix(v.value as number)
                .add(1, "h")
                .unix(),
              "HH:mm"
            )}`;
          }
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "#272A30",
          width: 1
        }
      },
      offset: 15,
      z: -3
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
      z: -2,
      minInterval: 1,
      offset: 12
    },
    series: [
      {
        type: "line",
        name: "Incidents",
        showSymbol: false,
        color: "#E24D42",
        symbolSize: 0,
        areaStyle: {
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "#641D2C"
            },
            {
              offset: 1,
              color: "#6B403A"
            }
          ])
        },
        lineStyle: {
          color: "#E24D42"
        },
        markLine: {
          itemStyle: {
            color: "#E24D42"
          },
          label: {
            show: false
          },
          tooltip: {
            show: false
          },
          symbol: ["none", "none"],
          data: [
            {
              xAxis: dayjs().hour()
            }
          ]
        },
        z: -1,
        markArea: {
          itemStyle: {
            color: "#111217",
            opacity: 0.6
          },
          data: [
            [
              {
                xAxis: dayjs().hour()
              },
              {
                xAxis: 999
              }
            ]
          ]
        }
      }
    ]
  };

  return <ReactECharts option={option} />;
};
