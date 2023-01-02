import { FC } from "react";
import { statisticUtils } from "../../../utils/statistics";
import { ErrorDetails } from "../../../../types/incidents";
import { normalizePlotData, splitLine, tooltipOptions } from "../utils";
import ReactECharts from "echarts-for-react";
import { EChartsOption } from "echarts";
import dateUtils from "../../../../core/utils/date";
import { getLocalStorageIncidentPlotType } from "../../../../core/utils/localStorage";

interface Props {
  errors: ErrorDetails[];
}

const PLOT_COLOR = "#04785A";

export const IncidentsListPlot: FC<Props> = ({ errors }) => {
  const plotData = statisticUtils.parseIncidentsTablePlotData(errors);
  const plotType = getLocalStorageIncidentPlotType();

  const options: EChartsOption = {
    dataset: {
      source: normalizePlotData(plotData)
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
