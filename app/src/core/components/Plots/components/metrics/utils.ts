import dayjs from "dayjs";
import { EChartsOption } from "echarts";
import { METRIC_UNIT } from "../../../../../types/tsdb";
import { tooltipOptions, splitLine } from "../../utils";

export type SerieType = "bar" | "line" | "scatter";

export const commonOptions = ({ unit, xAxisInterval = 15 }: { unit: METRIC_UNIT, xAxisInterval: number }) => {
    return {
        legend: {
            show: false
        },
        animation: false,
        tooltip: {
            ...tooltipOptions,
            valueFormatter: (v: string) => v ? `${v}${unit}` : "-"
        },
        grid: {
            left: 10,
            top: 10,
            right: 10,
            bottom: 45,
            containLabel: true
        },
        xAxis: {
            type: "category",
            offset: 12,
            axisLabel: {
                formatter: (v: string) => dayjs(v).format("HH:mm"),
                color: "white",
                fontSize: 11,
                interval: xAxisInterval,
                showMaxLabel: true
            },
            axisPointer: {
                label: {
                    formatter: (v: { value: string }) => dayjs(v.value).format("HH:mm, DD MMM")
                }
            },
            splitLine
        },
        yAxis: {
            type: "value",
            axisLabel: {
                color: "white",
                fontSize: 11,
                formatter: `{value} ${unit}`,
                interval: "auto"
            },
            minInterval: 1,
            splitLine
        },
    } as EChartsOption

}
