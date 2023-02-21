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
  type: MetricValueEnum | string;
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

export type IDefaultSDKMetrics = {
  cpu_usage: number;
  load_avg: number;
} & EventLoopMetricType &
  HeapMetricType &
  MemoryUsageMetricType;

export type MemoryUsageMetricType = {
  memory_usage_mb: number;
  memory_usage_percentage: number;
};

export type EventLoopMetricType = {
  loop_min: number;
  loop_max: number;
  loop_mean: number;
  loop_stddev: number;
};

export type HeapMetricType = {
  heap_used: number;
  heap_total: number;
  heap_rss: number;
};

export interface MetricsQuery {
  id: string;
  fields: string[];
  hrCount: number;
}

export type MetricsResponse = {
  _time: string;
} & {
  [key: string]: number;
};

export enum MetricValueEnum {
  FLOAT_FIELD = "floatField",
  INT_FIELD = "intField"
}

export type MetricPreviewType = {
  options: IMetric;
  datasource: MetricsResponse[];
};

export type TOOLTIP_PLACEMENT = "bottom" | "inside" | "left" | "right" | "top";

export type ISDKMetrics = {
  default: IDefaultSDKMetrics;
  counter: Record<string, number>;
  meauserement: Record<string, number>;
  gauge: Record<string, number>;
  timeSeries: Record<string, number>;
};

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
