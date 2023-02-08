import { Space } from "@traceo/ui";
import dateUtils from "../../../utils/date";
import { statisticUtils } from "../../../utils/statistics";
import { normalizePlotData, tooltipOptions } from "../utils";
import { EChartsOption, graphic } from "echarts";
import { ErrorDetails } from "@traceo/types";
import { lazy, useMemo } from "react";

const ReactECharts = lazy(() => import("echarts-for-react"));

const IncidentsOverviewPlot = ({ stats }: { stats: ErrorDetails[] }) => {
  const dataSource = useMemo(
    () => normalizePlotData(statisticUtils.parseIncidentsTablePlotData(stats)),
    [stats]
  );

  const option: EChartsOption = {
    dataset: {
      source: dataSource
    },
    animation: false,
    toolbox: {
      show: false
    },
    tooltip: tooltipOptions,
    grid: {
      left: "24px",
      right: "24px",
      top: "32px",
      bottom: "15px",
      containLabel: true
    },
    xAxis: {
      type: "category",
      axisTick: {
        alignWithLabel: true
      },
      boundaryGap: false,
      offset: 12,
      axisLabel: {
        formatter: (v) => dateUtils.formatDate(Number(v), "DD-MM"),
        color: "white",
        fontSize: 11
      },
      axisPointer: {
        label: {
          formatter: (v) => dateUtils.formatDate(v.value as number, "MMM D, YYYY")
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "#272A30",
          width: 1
        }
      }
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
      minInterval: 1,
      offset: 12
    },
    series: [
      {
        type: "line",
        name: "Errors",
        showSymbol: false,
        color: "#E24D42",
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
        }
      }
    ]
  };

  return (
    <Space className="w-full" direction="vertical">
      <ReactECharts style={{ height: "250px" }} option={option} />
    </Space>
  );
};

export default IncidentsOverviewPlot;
