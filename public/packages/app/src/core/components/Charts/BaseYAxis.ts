import { YAXisComponentOption } from "echarts/types/dist/echarts";

type YAxisProps = YAXisComponentOption & {
  pointerFormatter?: (value: undefined) => string;
  labelFormatter?: (value: unknown) => string;
};
const LINE_COLOR = "#272A30";
const LABEL_COLOR = "#CCCCDC";
export const BaseYAxis = ({
  splitLine = {},
  axisPointer = {},
  axisLabel = {},
  ...props
}: YAxisProps): YAXisComponentOption => ({
  splitLine: Object.assign(
    {
      show: true,
      lineStyle: {
        color: LINE_COLOR,
        width: 1
      }
    },
    splitLine
  ),
  axisPointer: Object.assign(
    {
      label: {
        // TODO: add types
        formatter: (value: any) => props?.pointerFormatter(value)
      }
    },
    axisPointer
  ),
  // TODO: fix types and use Object.assign(axisLabel,
  axisLabel: Object.assign(
    {
      color: LABEL_COLOR,
      fontSize: 10,
      padding: 0
    },
    axisLabel as any
  ),
  ...props
});
