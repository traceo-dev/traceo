import dateUtils from "../../../utils/date";
import { graphic } from "echarts";
import { BaseChart } from "../BaseChart";
import { BaseTooltip } from "../BaseTooltip";
import { BaseXAxis } from "../BaseXAxis";
import { BaseYAxis } from "../BaseYAxis";
import { theme } from "../../../../core/utils/theme";

const IncidentsOverviewChart = ({ data }) => (
  <BaseChart
    height="250px"
    dataset={{
      source: data || []
    }}
    tooltip={BaseTooltip({
      pointer: "line"
    })}
    activeZoomSelect={true}
    grid={{
      left: "24px",
      right: "24px",
      top: "32px",
      bottom: "15px",
      containLabel: true
    }}
    xAxis={BaseXAxis({
      axisTick: {
        alignWithLabel: true
      },
      boundaryGap: false,
      offset: 12,
      labelFormatter: (v) => dateUtils.formatDate(Number(v), "DD-MM"),
      pointerFormatter: (v) => dateUtils.formatDate(Number(v), "MMM D, YYYY")
    })}
    yAxis={BaseYAxis({
      minInterval: 1,
      offset: 12
    })}
    series={{
      type: "line",
      name: "Errors",
      showSymbol: false,
      color: theme.chart.incidents.serie.color,
      areaStyle: {
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
      },
      lineStyle: {
        color: theme.chart.incidents.serie.lineColor
      }
    }}
  />
);

export default IncidentsOverviewChart;
