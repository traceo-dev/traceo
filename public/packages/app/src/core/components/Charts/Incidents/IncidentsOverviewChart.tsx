import dateUtils from "../../../utils/date";
import { graphic } from "echarts";
import { BaseChart } from "../BaseChart";
import { BaseTooltip } from "../BaseTooltip";
import { BaseXAxis } from "../BaseXAxis";
import { BaseYAxis } from "../BaseYAxis";

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
    }}
  />
);

export default IncidentsOverviewChart;
