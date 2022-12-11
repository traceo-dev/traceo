export type ISdkMetrics = {
    cpuUsage: number;
    memory: {
        mb: number;
        percentage: number;
    };
    loadAvg?: number;
    heap: {
        used: number;
        total: number;
        rss: number;
        nativeContexts: number;
        detachedContexts: number;
    };
    eventLoopLag: {
        min: number;
        max: number;
        mean: number;
        stddev: number;
    };
    gc: {
        duration: {
            total: number;
            average: number;
        }
    }
}

export type IMetrics = {
    [key: string]: any
} & ISdkMetrics;

export interface MetricsQuery {
    id: string;
    hrCount: number;
}

export type MetricsResponse = {
    _time: string;
} & {
    [key: string]: number;
} & ISdkMetrics

export enum MetricValueEnum {
    FLOAT_FIELD = "floatField",
    INT_FIELD = "intField"
};

export enum MetricNameEnum {
    CPU_USAGE = "cpuUsage",
    MEMORY_USAGE = "memoryUsage",
    LOAD_AVG = "loadAvg",
    HEAP_USED = "heapUsed",
    HEAP_TOTAL = "heapTotal",
    RSS = "rss",
    HEAP_NATIVE_CONTEXTS = "heapNativeContexts",
    HEAP_DETACHED_CONTEXTS = "heapDetachedContexts",
    LOOP_MIN = "loopMin",
    LOOP_MAX = "loopMax",
    LOOP_MEAN = "loopMean",
    GC_TOTAL_TIME = "gcTotalTime",
    GC_AVG_TIME = "gcAvgTime"
}

export const metricFields = new Map<MetricNameEnum, MetricValueEnum>([
    [MetricNameEnum.CPU_USAGE, MetricValueEnum.FLOAT_FIELD],
    [MetricNameEnum.MEMORY_USAGE, MetricValueEnum.FLOAT_FIELD],
    [MetricNameEnum.LOAD_AVG, MetricValueEnum.FLOAT_FIELD],
    [MetricNameEnum.RSS, MetricValueEnum.FLOAT_FIELD],

    [MetricNameEnum.HEAP_NATIVE_CONTEXTS, MetricValueEnum.FLOAT_FIELD],
    [MetricNameEnum.HEAP_DETACHED_CONTEXTS, MetricValueEnum.FLOAT_FIELD],
    [MetricNameEnum.HEAP_USED, MetricValueEnum.FLOAT_FIELD],
    [MetricNameEnum.HEAP_TOTAL, MetricValueEnum.FLOAT_FIELD],

    [MetricNameEnum.LOOP_MIN, MetricValueEnum.FLOAT_FIELD],
    [MetricNameEnum.LOOP_MAX, MetricValueEnum.FLOAT_FIELD],
    [MetricNameEnum.LOOP_MEAN, MetricValueEnum.FLOAT_FIELD],

    [MetricNameEnum.GC_TOTAL_TIME, MetricValueEnum.FLOAT_FIELD],
    [MetricNameEnum.GC_AVG_TIME, MetricValueEnum.FLOAT_FIELD],
]);

// For future usage
// type IMetric = {
//     name: string;
//     description: string;
//     value: number;
//     valueType: MetricValueEnum;
//     show: boolean;
// };