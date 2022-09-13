import { Space, Typography, Skeleton } from "antd";
import { useApi } from "../../../../core/lib/useApi";
import dateUtils from "../../../../core/utils/date";
import { UPlotConfig } from "../../../../types/plot";
import { UPlot } from "../UPlot";
import { DrawStyle, gradientFill, LineInterpolation, normalizePlotData } from "../utils";

export const TotalIncidentAnalyticsPlot = ({ incident }) => {
  const queryParams = {
    id: incident?.id
  };
  const { data: stats = [] } = useApi<
    {
      date: number;
      count: number;
    }[]
  >({
    url: "/api/statistics/incident/total",
    params: queryParams
  });

  if (!stats) {
    return <Skeleton />;
  }

  const plotData = normalizePlotData(stats);

  const plotConfig: UPlotConfig = {
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

  return (
    <>
      <Space className="w-full justify-between p-5">
        <Space className="w-full gap-0" direction="vertical">
          <Typography className="text-md font-semibold primary">Total count</Typography>
          <Typography className="text-3xl">{incident?.occuredCount}</Typography>
          <Typography className="text-xs">
            The total count of this exception occurred
          </Typography>
        </Space>
      </Space>
      <UPlot data={plotData} config={plotConfig} />
    </>
  );
};
