import { DrawStyle, LineInterpolation } from "../core/components/Plots/utils";

export interface UPlotConfig {
  series: uPlot.Series[];
  axes: uPlot.Axis[];
  width?: number;
  height?: number;
  tooltip?: TooltipConfig;
  plugins?: uPlot.Plugin[];
  drawStyle?: DrawStyle;
  lineInterpolation?: LineInterpolation;
}

export interface TooltipConfig {
  dateFormat?: string;
  xLabel?: string;
  yLabel?: string;
  hidden?: boolean;
}
