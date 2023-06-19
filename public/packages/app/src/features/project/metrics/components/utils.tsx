import {
  AreaChartOutlined,
  BarChartOutlined,
  DotChartOutlined,
  LineChartOutlined
} from "@ant-design/icons";
import {
  DeepPartial,
  IMetric,
  IMetricSerie,
  MARKER_SHAPE,
  METRIC_UNIT,
  PLOT_TYPE,
  STACK_STRATEGY
} from "@traceo/types";
import { LabelPosition } from "@traceo/ui";
import { UPlotConfigBuilder } from "src/core/components/UPlot/UPlotConfigBuilder";
import { sameArrayValues } from "src/core/utils/arrays";
import { calculateOpacity } from "src/core/utils/colors";

export const unitOptions = Object.values(METRIC_UNIT).map((unit) => ({
  value: unit,
  label: unit
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

export const buildSeries = (builder: UPlotConfigBuilder, metric: IMetric) => {
  if (metric.series && metric.series.length > 0) {
    for (const serie of metric.series) {
      const chartType = serie.config.type as PLOT_TYPE;
      const isArea = serie.config.area.show;
      const areaOpacity = serie.config.area.opacity;

      builder.addSerie({
        type: chartType,
        stroke: serie.config.color,
        width: serie.config.lineWidth,
        fill: calculateOpacity(serie.config.color, isArea ? areaOpacity : 0),
        points: {
          show: metric.config.line.marker.show
        },
        bar: {
          width: serie.config.barWidth
        },
        label: serie.field
      });
    }
  }
};

export const isStackAvailable = (series: DeepPartial<IMetricSerie[]>) =>
  sameArrayValues(series.map(({ config }) => config.type));
