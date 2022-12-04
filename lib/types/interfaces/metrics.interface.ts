export interface IMetrics {
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

export interface MetricsQuery {
    id: string;
    hrCount: number;
}

export interface MetricsResponse {
    cpuUsage: number;
    memoryUsage: number;
    loadAvg: number;
    uptime: number;
    used: number;
    total: number;
    rss: number;
    nativeContexts: number;
    detachedContexts: number;
    loopMin: number;
    loopMax: number;
    loopMean: number;
    gcTotalTime: number;
    gcAvgTime: number;
    _time: string;
}