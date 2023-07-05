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
  PLOT_TYPE,
  STACK_STRATEGY,
  VISUALIZATION_TYPE
} from "@traceo/types";
import { LabelPosition } from "@traceo/ui";
import { sameArrayValues } from "../../../../core/utils/arrays";

export const unitOptions = Object.values(METRIC_UNIT).map((unit) => ({
  value: unit,
  label: unit
}));

const mapVisualizationName: Record<VISUALIZATION_TYPE, string> = {
  [VISUALIZATION_TYPE.TIME_SERIES]: "Time series",
  [VISUALIZATION_TYPE.HISTOGRAM]: "Histogram",
  [VISUALIZATION_TYPE.GAUGE]: "Gauge"
  // [VISUALIZATION_TYPE.TABLE]: "Table"
};

export const visualizationOptions = Object.values(VISUALIZATION_TYPE).map((type) => ({
  value: type,
  label: mapVisualizationName[type]
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
