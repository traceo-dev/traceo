import { theme } from "../../../../core/utils/theme";
import { localStorageService } from "../../../lib/localStorage";
import { LocalStorage } from "../../../lib/localStorage/types";
import dateUtils from "../../../utils/date";
import { BaseChart } from "../BaseChart";
import { BaseTooltip } from "../BaseTooltip";
import { BaseXAxis } from "../BaseXAxis";
import { BaseYAxis } from "../BaseYAxis";

const IncidentTimelineChart = ({ events, isLoading }) => {
  const plotType = localStorageService.get<any>(LocalStorage.PlotType) || "bar";
  return (
    <BaseChart
      isLoading={isLoading}
      height="70px"
      dataset={{
        source: events || []
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
            if (index === 0 || index === events.length - 1) {
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
        splitLine: {
          show: false
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
        color: theme.chart.incidents.timeline.color,
        showSymbol: false,
        itemStyle: {
          borderColor: theme.chart.incidents.timeline.color,
          borderWidth: 2
        },
        areaStyle: {
          color: theme.chart.incidents.timeline.color,
          opacity: theme.chart.incidents.timeline.areaOpacity
        },
        barWidth: theme.chart.incidents.timeline.barWidth,
        barGap: "5%"
      }}
    />
  );
};

export default IncidentTimelineChart;
