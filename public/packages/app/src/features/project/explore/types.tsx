import {
  BarChartOutlined,
  LineChartOutlined,
  AreaChartOutlined,
  DotChartOutlined
} from "@ant-design/icons";
import { RatioButtonGroupOption } from "@traceo/ui";

export const GRAPH_TYPE_OPTIONS: RatioButtonGroupOption[] = [
  {
    label: <BarChartOutlined />,
    value: "bar"
  },
  {
    label: <LineChartOutlined />,
    value: "line"
  },
  {
    label: <AreaChartOutlined />,
    value: "area"
  },
  {
    label: <DotChartOutlined />,
    value: "points"
  }
];
