export enum METRIC_TYPE {
    CPU = "cpu",
    MEMORY = "memory",
    LOAD_AVG = "loadAvg"
}

export type CHART_TYPE = "bar" | "line" | "scatter";

export const handleHeaderInfo: Record<METRIC_TYPE, { title: string; subTitle: string }> = {
    [METRIC_TYPE.CPU]: {
        title: "CPU Usage",
        subTitle:
            "CPU usage is the percentage of time that the CPU is being used to complete its tasks."
    },
    [METRIC_TYPE.MEMORY]: {
        title: "Memory Usage",
        subTitle: "The amount of RAM memory being used."
    },
    [METRIC_TYPE.LOAD_AVG]: {
        title: "Load Average",
        subTitle:
            "Load Average is a measure of system activity calculated by the operating system over the last minute and expressed as a fractional number. Supported only by UNIX os."
    }
};
