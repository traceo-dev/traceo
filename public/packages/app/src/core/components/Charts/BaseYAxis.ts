import { YAXisComponentOption } from "echarts/types/dist/echarts";

type YAxisProps = YAXisComponentOption & {
    pointerFormatter?: (value: undefined) => string;
    labelFormatter?: (value: unknown) => string;
}
const LINE_COLOR = "#272A30";
export const BaseYAxis = (props?: YAxisProps): YAXisComponentOption => {
    return {
        splitLine: {
            show: true,
            lineStyle: {
                color: LINE_COLOR,
                width: 1
            }
        },
        axisPointer: {
            label: {
                // TODO: add types
                formatter: (value: any) => props?.pointerFormatter(value)
            }
        },
        axisLabel: {
            // formatter: (value: unknown) => labelFormatter(value),
            color: "white",
            fontSize: 11,
            padding: 0
        },
        ...props
    }
}
