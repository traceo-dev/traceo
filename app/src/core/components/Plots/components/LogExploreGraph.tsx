import { UPlot } from "core/components/Plots/UPlot";
import { DrawStyle } from "core/components/Plots/utils";
import dateUtils from "core/utils/date";
import { statistics } from "core/utils/statistics";
import { FC } from "react";
import { TraceoLog } from "types/logs";
import { UPlotConfig } from "types/plot";

interface Props {
  logs: TraceoLog[];
  startDate: number;
  endDate: number;
}
export const LogExploreGraph: FC<Props> = ({ logs, startDate, endDate }) => {
  const data = statistics.getExploreLogsPlotData(startDate, endDate, logs);
  const width = window.innerWidth - 300;
  const plotConfig: UPlotConfig = {
    series: [
      {
        label: ""
      },
      {
        points: { show: false },
        width: 2,
        fill: "#0991b3"
      }
    ],
    height: 200,
    width,
    plugins: [],
    axes: [
      {
        values: (_, t) => t.map((value) => dateUtils.formatDate(value, "HH:mm"))
      }
    ],
    tooltip: {
      hidden: true
    },
    drawStyle: DrawStyle.BARS
  };

  return (
    <div className="pointer-events-none">
      <UPlot data={data} config={plotConfig} />
    </div>
  );
};
