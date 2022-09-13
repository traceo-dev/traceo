import { Space } from "antd";
import dayjs from "dayjs";
import { FC } from "react";
import dateUtils from "../../../../core/utils/date";
import { UPlotConfig } from "../../../../types/plot";
import { annotationsPlugin } from "../plugins/annotationsPlugin";
import { UPlot } from "../UPlot";
import { DrawStyle, gradientFill, LineInterpolation, normalizePlotData } from "../utils";

interface Props {
  stats: any;
}
export const TodayIncidentsPlot: FC<Props> = ({ stats }) => {
  const plotData = normalizePlotData(stats);
  const plotConfig: UPlotConfig = {
    width: 1000,
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
      <UPlot data={plotData} config={plotConfig} />
    </Space>
  );
};
