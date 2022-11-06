import dayjs from "dayjs";
import { EChartsOption } from "echarts";
import { METRIC_TYPE } from "../../../../../types/metrics";
import { METRIC_UNIT } from "../../../../../types/tsdb";
import { tooltipOptions, splitLine } from "../../utils";

export type SerieType = "bar" | "line" | "scatter";

export interface Metric {
    title: string;
    type: METRIC_TYPE;
    unit: METRIC_UNIT;
    series: MetricSeriesOption[];
}

export interface MetricSeriesOption {
    field: string;
    name: string;
    color: string;
    type?: SerieType;
    seriesLineWidth?: number;
    area?: {
        opacity?: number;
        color?: string;
    }
}

export const metricConfig: Record<METRIC_TYPE, Metric> = {
    [METRIC_TYPE.CPU]: {
        title: "CPU Usage",
        type: METRIC_TYPE.CPU,
        unit: "%",
        series: [
            {
                color: "#0991b3",
                field: "cpuUsage",
                name: "Cpu Usage"
            }
        ]
    },
    [METRIC_TYPE.EVENT_LOOP_DELAY]: {
        title: "Event Loop Delay",
        type: METRIC_TYPE.EVENT_LOOP_DELAY,
        unit: "ms",
        series: [
            {
                color: "#16A34A",
                field: "loopMin",
                name: "Min",
                area: {
                    color: "transparent"
                }
            },
            {
                color: "#E54A4D",
                field: "loopMax",
                name: "Max",
                area: {
                    color: "transparent"
                }
            },
            {
                color: "#F5CB19",
                field: "loopMean",
                name: "Mean",
                area: {
                    color: "transparent"
                }
            }
        ]
    },
    // [METRIC_TYPE.GC_TIME]: {
    //     title: "Garbage Collection Time",
    //     type: METRIC_TYPE.GC_TIME,
    //     unit: "ms",
    //     series: [
    //         {
    //             field: "gcTotalTime",
    //             name: "Total Time",
    //             color: "#705DA0",
    //             type: "bar",
    //             area: {
    //                 color: "#705DA0"
    //             }
    //         },
    //         {
    //             field: "gcAvgTime",
    //             name: "Average Time",
    //             color: "#31A82D",
    //             seriesLineWidth: 2,
    //             area: {
    //                 color: "transparent"
    //             }
    //         }
    //     ]
    // },
    [METRIC_TYPE.HEAP]: {
        title: "Heap",
        type: METRIC_TYPE.HEAP,
        unit: "MB",
        series: [
            {
                field: "heapUsed",
                name: "Heap Used",
                color: "#70DBED",
                area: {
                    color: "transparent"
                }
            },
            {
                field: "heapTotal",
                name: "Heap Total",
                color: "#5195CE",
                area: {
                    color: "transparent"
                }
            }
        ]
    },
    [METRIC_TYPE.RSS]: {
        title: "RSS",
        type: METRIC_TYPE.RSS,
        unit: "MB",
        series: [
            {
                field: "rss",
                name: "RSS",
                color: "#FFB357",
                area: {
                    color: "#FFB357"
                }
            }
        ]
    },
    [METRIC_TYPE.MEMORY]: {
        title: "Memory Usage",
        type: METRIC_TYPE.MEMORY,
        unit: "%",
        series: [
            {
                field: "memoryUsage",
                name: "Memory Usage",
                color: "#DE4457"
            }
        ]
    },
    [METRIC_TYPE.LOAD_AVG]: {
        title: "Load Average",
        type: METRIC_TYPE.LOAD_AVG,
        unit: "",
        series: [
            {
                color: "#FFFFFF",
                name: "Load Avg",
                field: "loadAvg"
            }
        ]
    },
    [METRIC_TYPE.HEAP_CONTEXTS]: {
        title: "Heap Contexts",
        type: METRIC_TYPE.HEAP_CONTEXTS,
        unit: "",
        series: [
            {
                color: "#629E51",
                name: "Native Contexts",
                field: "heapNativeContexts",
                area: {
                    color: "transparent"
                }
            },
            {
                color: "#DE4457",
                name: "Detached Contexts",
                field: "heapDetachedContexts",
                area: {
                    color: "transparent"
                }
            }
        ]
    }
};

export const commonOptions = ({ unit }: { unit: METRIC_UNIT }) => {
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
            bottom: 15,
            containLabel: true
        },
        xAxis: {
            type: "category",
            offset: 12,
            axisLabel: {
                formatter: (v: string) => dayjs(v).format("HH:mm"),
                color: "white",
                fontSize: 11,
                interval: 15,
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
                formatter: `{value}${unit}`
            },
            minInterval: 1,
            splitLine
        },
    } as EChartsOption

}
