import { PlotData } from "@traceo/types";
import dayjs from "dayjs";
import { graphic, LineSeriesOption, MarkAreaComponentOption, SeriesOption } from "echarts";
import { FC } from "react";
import { BaseChart } from "../BaseChart";
import { BaseMarkLine } from "../BaseMarkLine";
import { BaseTooltip } from "../BaseTooltip";
import { BaseXAxis } from "../BaseXAxis";
import { BaseYAxis } from "../BaseYAxis";
import { normalizePlotData } from "../utils";
import { theme } from "src/core/utils/theme";

interface Props {
  stats: PlotData[];
}
const IncidentsTodayChart: FC<Props> = ({ stats }) => {
  const plotData = normalizePlotData(stats);

  const areaStyle: LineSeriesOption["areaStyle"] = {
    color: new graphic.LinearGradient(0, 0, 0, 1, [
      {
        offset: 0,
        color: theme.chart.incidents.serie.areaColors[0]
      },
      {
        offset: 1,
        color: theme.chart.incidents.serie.areaColors[1]
      }
    ])
  };

  const markArea: MarkAreaComponentOption = {
    itemStyle: {
      color: theme.chart.incidents.serie.markAreaColor,
      opacity: 0.6
    },
    data: [
      [
        {
          xAxis: dayjs().local().hour()
        },
        {
          xAxis: 999
        }
      ]
    ]
  };

  const serie: SeriesOption = {
    type: "line",
    name: "Errors",
    showSymbol: false,
    color: theme.chart.incidents.serie.color,
    symbolSize: 0,
    areaStyle,
    lineStyle: {
      color: theme.chart.incidents.serie.lineColor
    },
    markLine: BaseMarkLine({
      data: [
        {
          xAxis: dayjs().local().hour()
        }
      ]
    }),
    markArea
  };

  return (
    <BaseChart
      dataset={{
        source: plotData
      }}
      height="200px"
      grid={{
        left: "24px",
        right: "24px",
        top: "15px",
        bottom: "30px",
        containLabel: true
      }}
      xAxis={BaseXAxis({
        boundaryGap: false,
        axisLabel: {
          showMaxLabel: true,
          interval: 2
        },
        offset: 15,
        z: -3
      })}
      yAxis={BaseYAxis({
        minInterval: 1,
        offset: 12
      })}
      series={serie}
      tooltip={BaseTooltip({
        pointer: "line"
      })}
    />
  );
};

export default IncidentsTodayChart;
