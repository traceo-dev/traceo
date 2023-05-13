import { BarChartOutlined, LineChartOutlined } from "@ant-design/icons";
import { METRIC_UNIT, PLOT_TYPE } from "@traceo/types";

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
