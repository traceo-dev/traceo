export type ExploreMetricsResponseType = {
    datasource: [number, number][];
}

export type ExploreGraphProps = {
    fields: string[];
    from: number;
    to: number;
    interval: number;
    valueMax: number;
    valueMin: number;
}

export { };
