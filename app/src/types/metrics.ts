export enum METRIC_TYPE {
    CPU = "cpu",
    MEMORY = "memory",
    RSS = "rss",
    HEAP = "heap",
    EVENT_LOOP_DELAY = "event_loop_delay",
    // GC_TIME = "gc_time",
    HEAP_CONTEXTS = "heap_contexts",
    LOAD_AVG = "load_avg",
}

export type CHART_TYPE = "bar" | "line" | "scatter";

export const handleHeaderInfo: Record<METRIC_TYPE, { title: string; description: string }> = {
    [METRIC_TYPE.CPU]: {
        title: "CPU Usage",
        description:
            "CPU usage is the percentage of time that the CPU is being used to complete its tasks."
    },
    [METRIC_TYPE.MEMORY]: {
        title: "Memory Usage",
        description: "The amount of RAM memory being used."
    },
    [METRIC_TYPE.LOAD_AVG]: {
        title: "Load Average",
        description:
            "Load Average is a measure of system activity calculated by the operating system over the last minute and expressed as a fractional number. Supported only by UNIX operation systems."
    },
    [METRIC_TYPE.HEAP]: {
        title: "Heap",
        description: "Total amount of memory being used by JS objects."
    },
    // [METRIC_TYPE.GC_TIME]: {
    //     title: "Garbage Collection Time",
    //     subTitle: "Garbage collection average and total duration counted from the last measurement."
    // },
    [METRIC_TYPE.RSS]: {
        title: "RSS",
        description: "Resident set size (RSS) is the portion of memory occupied by a process that is held in main memory (RAM)."
    },
    [METRIC_TYPE.HEAP_CONTEXTS]: {
        title: "Heap Contexts",
        description: "Values that indicate the existence of memory leaks."
    },
    [METRIC_TYPE.EVENT_LOOP_DELAY]: {
        title: "Event Loop Delay",
        description: "Minimum, maximum and mean delay of the NodeJS event loop."
    }
};
