import { XAXisComponentOption } from "echarts/types/dist/echarts";

type XAxisProps = XAXisComponentOption & {
  pointerFormatter?: (value: string | number | unknown) => string;
  labelFormatter?: (value: any, index?: number) => string;
  dateFormat?: string;
};

const LINE_COLOR = "#272A30";
export const BaseXAxis = ({
  dateFormat = "HH:mm",
  type = "category",
  splitLine = {},
  axisLabel = {},
  ...props
}: XAxisProps): XAXisComponentOption => {
  return {
    type,
    splitLine: Object.assign(
      {
        show: true,
        lineStyle: {
          color: LINE_COLOR,
          width: 1
        },
      },
      splitLine
    ),
    axisLine: {
      lineStyle: {
        color: LINE_COLOR
      }
    },
    axisPointer: {
      label: {
        formatter: props?.pointerFormatter
      }
    },
    axisLabel: Object.assign(
      {
        formatter: props?.labelFormatter,
        color: "#CCCCDC",
        fontSize: 11,
        hideOverlap: true
      },
      axisLabel
    ),
    ...props
  };
};
