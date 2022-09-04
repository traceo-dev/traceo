import { FC } from "react";
import { getIncidentsTablePlotData } from "src/core/utils/statistics";
import { ErrorDetails } from "src/types/incidents";
import { UPlotConfig } from "src/types/plot";
import { UPlot } from "../UPlot";
import { DrawStyle, LineInterpolation, normalizePlotData } from "../utils";

interface Props {
  errors: ErrorDetails[];
}
export const IncidentsListPlot: FC<Props> = ({ errors }) => {
  const data = getIncidentsTablePlotData(errors);

  const plotData = normalizePlotData(data);

  const plotConfig: UPlotConfig = {
    width: 400,
    height: 80,
    series: [
      {
        label: ""
      },
      {
        points: { show: false },
        stroke: "#434573",
        width: 2,
        fill: "#434573"
      }
    ],
    drawStyle: DrawStyle.BARS_LEFT,
    lineInterpolation: LineInterpolation.STEP_AFTER,
    plugins: [],
    axes: [
      {
        show: false
      }
    ],
    tooltip: {
      hidden: true
    }
  };

  return (
    <div className="pointer-events-none">
      <UPlot data={plotData} config={plotConfig} />
    </div>
  );
};
