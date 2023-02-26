import { localStorageService } from "../../../../core/lib/localStorage";
import { LocalStorage } from "../../../../core/lib/localStorage/types";
import dateUtils from "../../../utils/date";
import { statisticUtils } from "../../../utils/statistics";
import { normalizePlotData, splitLine, tooltipOptions } from "../utils";
import { ErrorDetails } from "@traceo/types";
import { EChartsOption } from "echarts";
import { FC, lazy, useMemo } from "react";

const ReactECharts = lazy(() => import("echarts-for-react"));
interface Props {
  errors: ErrorDetails[];
}

const PLOT_COLOR = "#04785A";

const IncidentsListPlot: FC<Props> = ({ errors }) => {
  const plotType = localStorageService.get<any>(LocalStorage.PlotType) || "bar";

  const dataSource = useMemo(() => {
    return normalizePlotData(statisticUtils.parseIncidentsTablePlotData(errors));
  }, [errors]);

  const options: EChartsOption = {
    dataset: {
      source: dataSource
    },
    animation: false,
    tooltip: {
      ...tooltipOptions,
      axisPointer: {
        type: "shadow"
      }
    },
    grid: {
      left: "20px",
      right: "10px",
      top: "8px",
      bottom: "20px"
      // containLabel: true
    },
    xAxis: {
      splitLine: {
        lineStyle: {
          color: "transparent"
        }
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      type: "category",
      axisLabel: {
        show: false,
        interval: "auto",
        formatter: function (value, index) {
          if (index === 0 || index === dataSource.x.length - 1) {
            return dateUtils.formatDate(Number(value), "DD-MM");
          }

          return "";
        },
        color: "#CCCCDC",
        fontSize: 10,
        showMaxLabel: true,
        showMinLabel: true
      },
      axisPointer: {
        label: {
          formatter: (v) => dateUtils.formatDate(v.value as number, "MMM D, YYYY")
        }
      }
    },
    yAxis: {
      splitLine,
      axisLabel: {
        showMinLabel: false,
        hideOverlap: true,
        color: "#CCCCDC",
        fontSize: 10
      },
      alignTicks: true,
      min: 0,
      max: (e) => {
        return e.max;
      },
      interval: 99999
    },
    series: {
      name: "Errors",
      type: plotType,
      color: PLOT_COLOR,
      showSymbol: false,
      itemStyle: {
        borderColor: PLOT_COLOR,
        borderWidth: 2
      },
      areaStyle: {
        color: PLOT_COLOR,
        opacity: 0.4
      },
      barWidth: 10,
      barGap: "5%"
    }
  };

  return (
    <ReactECharts
      style={{
        height: "50px"
      }}
      option={options}
    />
  );
};

export default IncidentsListPlot;
