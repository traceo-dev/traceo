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
  field: string;
  // TODO: change this from string to some type
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

/**
 * If values like line.width/area.show/area.opacity is not empty
 * then it overrides fields from series
 */
export type IMetricConfiguration = {
  line?: {
    marker?: {
      show?: boolean;
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
};

export type TOOLTIP_POSITION = "bottom" | "inside" | "left" | "right" | "top";
export enum PLOT_TYPE {
  BAR = "bar",
  LINE = "line"
  // POINTS = "points"
}
export enum METRIC_UNIT {
  PERCENTAGE = "%",
  MEGABYTES = "MB",
  KILOBYTES = "kb",
  SECONDS = "s",
  MILISECONDS = "ms",
  NONE = ""
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
  datasource: MetricResponseType[];
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
