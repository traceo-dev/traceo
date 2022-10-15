export enum METRIC_TYPE {
    CPU = "cpu",
    RAM = "ram",
    LOAD_AVG = "loadAvg",
    MEMORY_USAGE = "memory_usage",
    HEAP_CONTEXTS = "heap_contexts"
}

export type CHART_TYPE = "bar" | "line" | "scatter";

export const handleHeaderInfo: Record<METRIC_TYPE, { title: string; subTitle: string }> = {
    [METRIC_TYPE.CPU]: {
        title: "CPU Usage",
        subTitle:
            "CPU usage is the percentage of time that the CPU is being used to complete its tasks."
    },
    [METRIC_TYPE.RAM]: {
        title: "RAM Usage",
        subTitle: "The amount of RAM memory being used."
    },
    [METRIC_TYPE.LOAD_AVG]: {
        title: "Load Average",
        subTitle:
            "Load Average is a measure of system activity calculated by the operating system over the last minute and expressed as a fractional number. Supported only by UNIX os."
    },
    [METRIC_TYPE.MEMORY_USAGE]: {
        title: "Memory Usage",
        subTitle: "Total amount of memory being used by JS objects."
    },
    [METRIC_TYPE.HEAP_CONTEXTS]: {
        title: "Heap Contexts",
        subTitle: "Values that indicate the existence of memory leaks."
    }
};
