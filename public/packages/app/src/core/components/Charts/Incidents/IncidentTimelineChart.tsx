import { localStorageService } from "../../../lib/localStorage";
import { LocalStorage } from "../../../lib/localStorage/types";
import dateUtils from "../../../utils/date";
import { statisticUtils } from "../../../utils/statistics";
import { normalizePlotData } from "../utils";
import { ErrorDetails, IEvent } from "@traceo/types";
import { FC, useMemo } from "react";
import { BaseChart } from "../BaseChart";
import { BaseTooltip } from "../BaseTooltip";
import { BaseXAxis } from "../BaseXAxis";
import { BaseYAxis } from "../BaseYAxis";

interface Props {
  events: IEvent[];
}

const PLOT_COLOR = "#04785A";

const IncidentTimelineChart: FC<Props> = ({ events }) => {
  const plotType = localStorageService.get<any>(LocalStorage.PlotType) || "bar";

  const dataSource = useMemo(() => {
    return normalizePlotData(statisticUtils.parseIncidentsTablePlotData(events));
  }, [events]);

  return (
    <BaseChart
      height="70px"
      dataset={{
        source: dataSource
      }}
      tooltip={BaseTooltip({
        pointer: "shadow"
      })}
      grid={{
        left: "20px",
        right: "10px",
        top: "5px",
        bottom: "20px"
      }}
      xAxis={BaseXAxis({
        axisTick: {
          show: false
        },
        axisLabel: {
          interval: "auto",
          formatter: function (value, index) {
            if (index === 0 || index === dataSource.x.length - 1) {
              return dateUtils.formatDate(Number(value), "DD-MM");
            } else {
              return "";
            }
          },
          color: "#CCCCDC",
          fontSize: 10,
          showMaxLabel: true,
          showMinLabel: true
        },
        pointerFormatter: (v) => dateUtils.formatDate(Number(v), "MMM D, YYYY")
      })}
      yAxis={BaseYAxis({
        axisLabel: {
          showMinLabel: false,
          hideOverlap: true,
          fontSize: 10,
          color: "#CCCCDC"
        },
        alignTicks: true,
        min: 0,
        max: (e) => {
          return e.max;
        },
        interval: 99999
      })}
      series={{
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
      }}
    />
  );
};

export default IncidentTimelineChart;
