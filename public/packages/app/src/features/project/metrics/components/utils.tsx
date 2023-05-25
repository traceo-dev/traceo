import { BarChartOutlined, LineChartOutlined } from "@ant-design/icons";
import { MARKER_SHAPE, METRIC_UNIT, PLOT_TYPE, STACK_STRATEGY } from "@traceo/types";
import { LabelPosition, toTitleCase } from "@traceo/ui";

export const unitOptions = Object.values(METRIC_UNIT).map((unit) => ({
  value: unit,
  label: unit
}));

export const mapPlotName: Record<PLOT_TYPE, string> = {
  bar: "Bar",
  line: "Line"
};

export const mapPlotIcon: Record<PLOT_TYPE, JSX.Element> = {
  bar: <BarChartOutlined />,
  line: <LineChartOutlined />
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
  [MARKER_SHAPE.ARROW]: "Arrow",
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
