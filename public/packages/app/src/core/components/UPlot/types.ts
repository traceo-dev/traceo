import { VISUALIZATION_TYPE, PLOT_TYPE, UplotDataType } from "@traceo/types";
import uPlot from "uplot";

export type ChartConfigs = {
    data: uPlot.AlignedData;
    options: uPlot.Options;
}

export type HookType = "setSelect" | "draw";

export type ChartType = "timeseries" | "histogram" | "none";

type CoreUplotOptions = Pick<uPlot.Options, "bands" | "drawOrder" | "fmtDate" | "focus" | "mode" | "ms" | "padding" | "pxAlign" | "tzDate" | "class">;

export type HistogramOptions = {
    bucketSize: number;
    min?: number;
    max?: number;
}

export type BaseOptions = CoreUplotOptions & {
    id?: string;
    width?: number;
    height?: number;
    chartType?: VISUALIZATION_TYPE;
    stacked?: boolean;
    data?: UplotDataType;
    isZoom?: boolean;
    histogram?: HistogramOptions;
}

export type UPlotLegend = Pick<uPlot.Legend, "show" | "markers" | "values">;

export type UPlotAxis = Omit<uPlot.Axis, "scale"> & {
    scale: string;
    isTimeAxis?: boolean;
    showFloatLabels?: boolean;
    formatter?: (self: uPlot, splits: number[], axisIdx: number, foundSpace: number, foundIncr: number) => any;
};

export type UPlotSerie = uPlot.Series & {
    type?: PLOT_TYPE;
    bar?: {
        width?: number;
        align?: number
    }
}

export type TooltipOptions = {
    show?: boolean;
}
