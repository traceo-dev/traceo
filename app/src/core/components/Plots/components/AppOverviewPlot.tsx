import { Space } from "antd";
import dateUtils from "../../../../core/utils/date";
import { statistics } from "../../../../core/utils/statistics";
import { UPlotConfig } from "../../../../types/plot";
import { UPlot } from "../UPlot";
import { DrawStyle, gradientFill, LineInterpolation, normalizePlotData } from "../utils";

export const AppOverviewPlot = ({ stats }) => {
  const plotConfig: UPlotConfig = {
    series: [
      {
        label: ""
      },
      {
        points: { show: false },
        stroke: "#E24D42",
        width: 2,
        alpha: 0.6,
        fill: (u) => {
          return gradientFill(u, [
            [1, "#6B403A"],
            [0, "#641D2C"]
          ]);
        }
      }
    ],
    plugins: [],
    axes: [
      {
        values: (_, t) => t.map((value) => dateUtils.formatDate(value, "DD-MM"))
      }
    ],
    tooltip: {
      dateFormat: "DD-MM",
      xLabel: "Date",
      yLabel: "Incidents"
    },
    drawStyle: DrawStyle.LINE,
    lineInterpolation: LineInterpolation.SPLINE
  };

  const data = () => {
    if (stats?.length > 0) {
      return normalizePlotData(stats);
    }

    const data = statistics.mockData();
    return normalizePlotData(data);
  };

  return (
    <Space className="w-full" direction="vertical">
      <UPlot data={data()} config={plotConfig} />
    </Space>
  );
};
