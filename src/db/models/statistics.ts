export interface WorkspaceStatistics {
    total: {
        incidentsCount: number,
        incidentsOccurCount: number,
        lastWeek: number;
        percentage: string;
        isMore: boolean;
    },
    release: {
        version: string,
        incidentsCount: number,
        incidentsOccurCount: number,
    }
}

export interface HourlyStatistic {
    hour: string;
    count: number;
}

export interface PlotData {
    date: string;
    count: number;
}