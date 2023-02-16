export enum LocalStorage {
    LogLevels = "traceo.selected.log.levels",
    PlotType = "traceo.incidents.plot.type",
    MetricQuery = "traceo.metric.query"
}

export type MetricQueryType = {
    from: number;
    to: number;
}
