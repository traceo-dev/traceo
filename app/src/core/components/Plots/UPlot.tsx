import { FC } from "react";
import { UPlotConfig } from "src/types/plot";
import uPlot from "uplot";
import UplotReact from "uplot-react";
import { tooltipsPlugin } from "./plugins/tooltipPlugin";
import { DrawStyle, LineInterpolation, paths } from "./utils";

interface Props {
  data: { x: number[]; y: number[] };
  config?: UPlotConfig;
}

export const UPlot: FC<Props> = ({ data, config }) => {
  const commonAxesOpt: uPlot.Axis = {
    stroke: "#ffffff",
    grid: {
      stroke: "#272A30",
      width: 1
    }
  };

  const width = config?.width || 1200;

  const opt: uPlot.Options = {
    width,
    height: config?.height || 300,
    legend: {
      show: false
    },
    plugins: [tooltipsPlugin(config.tooltip), ...config?.plugins],
    series: [
      {
        ...config.series[0]
      },
      Object.assign(
        {
          ...config.series[1],
          paths
        },
        {
          drawStyle: config.drawStyle || DrawStyle.LINE,
          lineInterpolation: config.lineInterpolation || LineInterpolation.LINEAR
        }
      )
    ],
    axes: [
      {
        ...config.axes[0],
        ...commonAxesOpt
      },
      {
        ...config.axes[1],
        ...commonAxesOpt
      }
    ],
    cursor: {
      show: true
    }
  };

  const datas: uPlot.AlignedData = [data.x, data.y];
  return <UplotReact options={opt} data={datas} />;
};
