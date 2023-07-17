export enum EXPLORE_TYPE {
  LOGS = "logs",
  TRACING = "tracing",
  METRICS = "metrics"
}

export const AVAILABLE_COLORS = [
  "#F2CC0C",
  "#73BF69",
  "#8AB8FF",
  "#FF780A",
  "#F2495C",
  "#5794F2",
  "#B877D9",
  "#705DA0",
  "#37872D",
  "#FADE2A"
];

export type EXPLORE_PLOT_TYPE = "bar" | "line" | "area" | "points";

export type ExploreSerieType = {
  name: string;
  color: string;
};

export type LogsQueryProps = {
  projectId: string;
  from: number;
  to: number;
  take?: number;
};
