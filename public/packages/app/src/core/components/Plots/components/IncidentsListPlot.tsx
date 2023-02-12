import { FC, lazy, useMemo } from "react";
import { statisticUtils } from "../../../utils/statistics";
import { ErrorDetails } from "@traceo/types";
import { normalizePlotData, splitLine, tooltipOptions } from "../utils";
import { EChartsOption } from "echarts";
import dateUtils from "../../../utils/date";
import { localStorageService } from "../../../../core/lib/localStorage";
import { LocalStorage } from "../../../../core/lib/localStorage/types";

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
      left: "5px",
      right: "5px",
      top: "8px",
      bottom: "0px",
      containLabel: true
    },
    xAxis: {
      show: false,
      splitLine,
      type: "category",
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
        hideOverlap: true
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
        height: "50px",
        width: "250px"
      }}
      option={options}
    />
  );
};

export default IncidentsListPlot;
