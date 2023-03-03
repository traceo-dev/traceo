import { XAXisComponentOption } from "echarts/types/dist/echarts";

type XAxisProps = XAXisComponentOption & {
    pointerFormatter?: (value: string | number | unknown) => string;
    labelFormatter?: (value: string | number) => string;
}

const LINE_COLOR = "#272A30";
export const BaseXAxis = (props: XAxisProps): XAXisComponentOption => {
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
                formatter: (value: string | number | unknown) => props?.pointerFormatter(value)
            }
        },
        axisLabel: {
            // @ts-expect-error formatter type is missing
            formatter: (value: string | number) => props?.labelFormatter(value),
            color: "white",
            fontSize: 11,
            padding: 0,
            hideOverlap: true
        },
        ...props
    }
}
