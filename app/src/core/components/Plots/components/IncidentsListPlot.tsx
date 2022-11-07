import { FC } from "react";
import { getIncidentsTablePlotData } from "../../../utils/statistics";
import { ErrorDetails } from "../../../../types/incidents";
import { normalizePlotData, splitLine, tooltipOptions } from "../utils";
import ReactECharts from "echarts-for-react";
import { EChartsOption } from "echarts";
import dateUtils from "../../../../core/utils/date";

interface Props {
  errors: ErrorDetails[];
}
export const IncidentsListPlot: FC<Props> = ({ errors }) => {
  const data = getIncidentsTablePlotData(errors);

  const plotData = normalizePlotData(data);

  const options: EChartsOption = {
    dataset: {
      source: plotData
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
      top: "10px",
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
      name: "Incidents",
      type: "bar",
      color: "#04785A",
      itemStyle: {
        borderColor: "#04785A",
        borderWidth: 2
      },
      barWidth: 10,
      barGap: "5%"
    }
  };

  return (
    <>
      <ReactECharts option={options} />
      <style>{`
      .echarts-for-react {
        height: 80px !important;
        width: 380px !important;
      }
    `}</style>
    </>
  );
};
