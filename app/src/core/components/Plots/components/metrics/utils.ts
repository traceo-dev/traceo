import { METRIC_TYPE } from "types/metrics";
import { METRIC_UNIT } from "types/tsdb";

export interface Metric {
    title: string;
    type: METRIC_TYPE;
    unit: METRIC_UNIT;
    field: string;
    color: string;
    color2?: string;
    color3?: string;
}

export const metricConfig: Record<METRIC_TYPE, Metric> = {
    [METRIC_TYPE.CPU]: {
        title: "CPU Usage",
        field: "cpuUsage",
        type: METRIC_TYPE.CPU,
        unit: "%",
        color: "#0991b3"
    },
    [METRIC_TYPE.MEMORY]: {
        title: "Memory Usage",
        field: "memoryUsage",
        type: METRIC_TYPE.MEMORY,
        unit: "%",
        color: "#DE4457"
    },
    [METRIC_TYPE.LOAD_AVG]: {
        title: "Load Average",
        field: "loadAvg",
        type: METRIC_TYPE.LOAD_AVG,
        unit: "",
        color: "#FFFFFF"
    }
};
