import { ExponentialHistogram, Histogram } from "./opentelemetry";

export type UUIntType = Uint32Array | Uint16Array | Uint8Array | BigInt64Array | BigInt;

/**
 * Metric value representation saved in clickhouse table row
 */
export type MetricPayload = {
  id: string,
  name: string,
  value: string | number | UUIntType | Histogram | ExponentialHistogram,
  project_id: string,
  timestamp: number,
  receive_timestamp: number
}

export type IMetric = {
  id?: string;
  name: string;
  description: string;

  /**
   * deprecated
   */
  showDescription: boolean;

  /**
   * Is created by Traceo, if false then is created by user
   */
  isDefault: boolean;

  /**
   * Is showed to users with viewer perms
   */
  show: boolean;
  unit: string;
  series: IMetricSerie[];
  config: IMetricConfiguration;
};

export type IMetricSerie = {
  name: string;
  description?: string;
  unit?: METRIC_UNIT;
  show: boolean;
  field: string;
  type: string;
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


/**
 * If values like line.width/area.show/area.opacity is not empty
 * then it overrides fields from series
 */
export type IMetricConfiguration = {
  stack?: {
    show: boolean;
    strategy: string
  }
  line?: {
    marker?: {
      show?: boolean;
      shape?: string; //MARKER_SHAPE
    };
  };
  tooltip: {
    show: boolean;
    position: string;
  };
  legend: {
    show: boolean;
    orient: string;
  };
  axis: {
    showX?: boolean;
    showY?: boolean;
    showGridLines?: boolean;
  },
};

export type TOOLTIP_POSITION = "bottom" | "inside" | "left" | "right" | "top";
export enum PLOT_TYPE {
  BAR = "bar",
  LINE = "line",
  SCATTER = "scatter"
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
  timestamp: number[]
} & {
  [x: string]: number[]
}

export type MetricPreviewType = {
  options: IMetric;
  datasource: [number, number][];
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
