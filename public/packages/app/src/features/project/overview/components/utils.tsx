import {
  AreaChartOutlined,
  BarChartOutlined,
  DotChartOutlined,
  LineChartOutlined
} from "@ant-design/icons";
import {
  DeepPartial,
  IMetricSerie,
  MARKER_SHAPE,
  METRIC_UNIT,
  PANEL_TYPE,
  PLOT_TYPE,
  STACK_STRATEGY
} from "@traceo/types";
import { LabelPosition } from "@traceo/ui";
import { sameArrayValues } from "../../../../core/utils/arrays";

export const unitOptions = Object.values(METRIC_UNIT).map((unit) => ({
  value: unit,
  label: unit
}));

const mapMetricTypeName: Record<PANEL_TYPE, string> = {
  [PANEL_TYPE.TIME_SERIES]: "Time series",
  [PANEL_TYPE.HISTOGRAM]: "Histogram",
  [PANEL_TYPE.GAUGE]: "Gauge",
  [PANEL_TYPE.TABLE]: "Table",
  [PANEL_TYPE.TODAY_EVENTS_PLOT]: "Today events plot",
  [PANEL_TYPE.TODAY_EVENTS_COUNTER]: "Today events counter",
  [PANEL_TYPE.TODAY_EVENTS_LAST_TIME]: "Today events last occur",
  [PANEL_TYPE.EVENTS_OVERVIEW]: "Events overview plot"
};

export const panelTypeOptions = Object.values(PANEL_TYPE).map((type) => ({
  value: type,
  label: mapMetricTypeName[type]
}));

export const mapPlotName: Record<PLOT_TYPE, string> = {
  bar: "Bar",
  line: "Line",
  spline: "Spline",
  points: "Points"
};

export const mapPlotIcon: Record<PLOT_TYPE, JSX.Element> = {
  bar: <BarChartOutlined />,
  line: <LineChartOutlined />,
  spline: <AreaChartOutlined />,
  points: <DotChartOutlined />
};

export const plotOptions = Object.values(PLOT_TYPE).map((type) => ({
  value: type,
  label: mapPlotName[type],
  icon: mapPlotIcon[type]
}));

export const markerShapeName: Record<MARKER_SHAPE, string> = {
  [MARKER_SHAPE.ARROW]: "Arrow",
  [MARKER_SHAPE.RECT]: "Rect",
  [MARKER_SHAPE.ROUND_RECT]: "Rounded rect",
  [MARKER_SHAPE.TRIANGLE]: "Triangle",
  [MARKER_SHAPE.DIAMOND]: "Diamond",
  [MARKER_SHAPE.PIN]: "Pin",
  [MARKER_SHAPE.CIRCLE]: "Circle"
};

export const markerShapeOptions = Object.values(MARKER_SHAPE).map((shape) => ({
  value: shape,
  label: markerShapeName[shape]
}));

export interface MetricEditOption {
  label: string;
  labelPosition?: LabelPosition;
  component: JSX.Element;
  tooltip?: string;
}

export const stackStrategyOptions = Object.values(STACK_STRATEGY).map((strategy) => ({
  value: strategy,
  label: strategy
}));

export const isStackAvailable = (series: DeepPartial<IMetricSerie[]>) =>
  sameArrayValues(series.map(({ config }) => config.type));
