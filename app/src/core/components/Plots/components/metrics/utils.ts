import dayjs from "dayjs";
import { EChartsOption } from "echarts";
import { METRIC_TYPE } from "types/metrics";
import { METRIC_UNIT } from "types/tsdb";
import { tooltipOptions, splitLine } from "../../utils";

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
    [METRIC_TYPE.MEMORY_USAGE]: {
        title: "Memory Usage",
        type: METRIC_TYPE.MEMORY_USAGE,
        unit: "MB",
        series: [
            {
                field: "heapUsed",
                name: "Heap Used",
                color: "#70DBED",
                area: {
                    opacity: 0.5
                }
            },
            {
                field: "heapTotal",
                name: "Heap Total",
                color: "#5195CE",
                area: {
                    opacity: 0.4
                }
            },
            {
                field: "rss",
                name: "RSS",
                color: "#0A50A1",
                area: {
                    opacity: 0.3
                }
            }
        ]
    },
    [METRIC_TYPE.RAM]: {
        title: "RAM Usage",
        type: METRIC_TYPE.RAM,
        unit: "%",
        series: [
            {
                field: "memoryUsage",
                name: "RAM Usage",
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
            valueFormatter: (v: string) => `${v}${unit}`
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
