export type UUIntType = Uint32Array | Uint16Array | Uint8Array | BigInt64Array | bigint;
export enum MetricType {
  TIME_SERIES = "time_series",
  HISTOGRAM = "histogram"
}

export type IMetricSerie = {
  name?: string;
  description?: string;
  unit?: METRIC_UNIT;
  datasource: {
    field?: string;
    query?: string;
    formula?: string;
  }
  config: {
    lineWidth?: number;
    barWidth?: number;
    area: {
      show?: boolean;
      opacity?: number;
    };
    type: PLOT_TYPE | string;
    color: string;
  };
};

export enum MARKER_SHAPE {
  CIRCLE = "circle",
  RECT = "rect",
  ROUND_RECT = "roundRect",
  TRIANGLE = "triangle",
  DIAMOND = "diamond",
  PIN = "pin",
  ARROW = "arrow"
}

export type TOOLTIP_POSITION = "bottom" | "inside" | "left" | "right" | "top";
export enum PLOT_TYPE {
  BAR = "bar",
  LINE = "line",
  SPLINE = "spline",
  POINTS = "points"
}
export enum METRIC_UNIT {
  PERCENTAGE = "%",
  MEGABYTES = "MB",
  KILOBYTES = "kb",
  SECONDS = "s",
  MILISECONDS = "ms",
  NONE = "None"
}

export type LegendOrientType = "vertical" | "horizontal";

export interface MetricsQuery {
  id: string;
  fields: string[];
  hrCount: number;
}

export type MetricResponseType = {
  timestamp: number[];
} & {
  [x: string]: number[];
};

export type TOOLTIP_PLACEMENT = "bottom" | "inside" | "left" | "right" | "top";

export interface MetricsQuery {
  id: string;
  field: string;
  hrCount: number;
}

export const mapTimeLimitLabel: Record<number, string> = {
  1: "Last 1 hour",
  2: "Last 2 hours",
  3: "Last 3 hours",
  6: "Last 6 hours",
  12: "Last 12 hours",
  24: "Last 24 hours",
  48: "Last 2 days",
  72: "Last 3 days"
};

export const timeLimitOptions = [1, 2, 3, 6, 12, 24, 48, 72];

export type INCIDENT_PLOT_TYPE = "bar" | "line";

export enum STACK_STRATEGY {
  SAMESIGN = "samesign",
  ALL = "all",
  POSITIVE = "positive",
  NEGATIVE = "negative"
}
