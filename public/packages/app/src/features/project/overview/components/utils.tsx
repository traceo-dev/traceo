import {
  AreaChartOutlined,
  BarChartOutlined,
  DotChartOutlined,
  FieldNumberOutlined,
  FontColorsOutlined,
  LineChartOutlined,
  NumberOutlined
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
import { LabelPosition, SelectOptionProps } from "@traceo/ui";
import { sameArrayValues } from "../../../../core/utils/arrays";

export const unitOptions = Object.values(METRIC_UNIT).map((unit) => ({
  value: unit,
  label: unit
}));

export const mapVisualizationName: Record<VISUALIZATION_TYPE, string> = {
  [VISUALIZATION_TYPE.TIME_SERIES]: "Time series",
  [VISUALIZATION_TYPE.HISTOGRAM]: "Histogram",
  [VISUALIZATION_TYPE.GAUGE]: "Gauge",
  [VISUALIZATION_TYPE.STAT]: "Stat",
  [VISUALIZATION_TYPE.TEXT]: "Text"
  // [VISUALIZATION_TYPE.TABLE]: "Table"
};

const mapVisualizationDescription: Record<VISUALIZATION_TYPE, string> = {
  [VISUALIZATION_TYPE.TIME_SERIES]: "Series of data points indexed in time order",
  [VISUALIZATION_TYPE.HISTOGRAM]:
    "Graphical representation of data points organized into user-specified ranges",
  [VISUALIZATION_TYPE.GAUGE]: "Single numerical value that can arbitrarily go up and down",
  [VISUALIZATION_TYPE.STAT]: "The value corresponds to the specified stat",
  [VISUALIZATION_TYPE.TEXT]: "Support for markdown text"
};

const mapVisualizationIcon: Record<VISUALIZATION_TYPE, JSX.Element> = {
  [VISUALIZATION_TYPE.TIME_SERIES]: <AreaChartOutlined />,
  [VISUALIZATION_TYPE.HISTOGRAM]: <BarChartOutlined />,
  [VISUALIZATION_TYPE.GAUGE]: <FieldNumberOutlined />,
  [VISUALIZATION_TYPE.STAT]: <NumberOutlined />,
  [VISUALIZATION_TYPE.TEXT]: <FontColorsOutlined />
};

export const visualizationOptions: SelectOptionProps[] = Object.values(VISUALIZATION_TYPE).map(
  (type) => ({
    value: type,
    label: mapVisualizationName[type],
    description: mapVisualizationDescription[type],
    icon: mapVisualizationIcon[type]
  })
);

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

export interface PanelEditOption {
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
