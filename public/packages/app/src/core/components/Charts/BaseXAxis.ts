import { XAXisComponentOption } from "echarts/types/dist/echarts";

type XAxisProps = XAXisComponentOption & {
    pointerFormatter?: (value: string | number | unknown) => string;
    labelFormatter?: (value: string | number) => string;
    dateFormat?: string;
}

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
        splitLine: Object.assign({
            show: true,
            lineStyle: {
                color: LINE_COLOR,
                width: 1
            }
        }, splitLine),
        axisPointer: {
            label: {
                formatter: (value: string | number | unknown) => {
                    if (props?.pointerFormatter) {
                        return props?.pointerFormatter(value["value"])
                    }

                    return value["value"];
                }
            }
        },
        axisLabel: Object.assign({
            formatter: (value: string | number) => {
                if (props?.labelFormatter) {
                    return props?.labelFormatter(value);
                }

                return value;
            },
            color: "white",
            fontSize: 11,
            padding: 0,
            hideOverlap: true
        }, axisLabel),
        ...props
    }
}
