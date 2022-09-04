import { Space } from "antd";
import dayjs from "dayjs";
import dateUtils from "src/core/utils/date";
import { statistics } from "src/core/utils/statistics";
import { UPlotConfig } from "src/types/plot";
import { annotationsPlugin } from "../plugins/annotationsPlugin";
import { UPlot } from "../UPlot";
import { DrawStyle, gradientFill, LineInterpolation, normalizePlotData } from "../utils";
import { TodayIncidentsStats } from "../../../../features/app/incidents/components/TodayIncidentsStats";

export const TodayIncidentAnalyticsPlot = ({ incident }) => {
  const stats = statistics.getIncidentsAnalyticsTodayPlotData(incident?.occurDates);
  const plotData = normalizePlotData(stats?.data);

  const plotConfig: UPlotConfig = {
    width: 900,
    height: 200,
    plugins: [
      annotationsPlugin(
        {
          types: {
            eqk: {
              width: 1,
              stroke: "#E24D42",
              fill: "#111217",
              dash: [5, 5]
            }
          }
        },
        dayjs().unix(),
        dayjs().endOf("d").unix()
      )
    ],
    series: [
      {
        label: ""
      },
      {
        points: { show: false },
        stroke: "#E24D42",
        alpha: 0.6,
        width: 2,
        fill: (u) => {
          return gradientFill(u, [
            [1, "#6B403A"],
            [0, "#641D2C"]
          ]);
        }
      }
    ],
    axes: [
      {
        values: (_, t) => t.map((value) => dateUtils.formatDate(value, "HH:mm"))
      }
    ],
    tooltip: {
      dateFormat: "HH:mm",
      xLabel: "Hour",
      yLabel: "Incidents"
    },
    drawStyle: DrawStyle.LINE,
    lineInterpolation: LineInterpolation.SPLINE
  };

  return (
    <Space className="w-full">
      <UPlot config={plotConfig} data={plotData} />
      <TodayIncidentsStats
        count={stats?.count}
        last={stats?.last}
        isMore={stats?.diff?.isMore}
        value={stats?.diff?.value}
      />
    </Space>
  );
};
