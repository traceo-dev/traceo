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
    date: number;
    count: number;
}

export interface PlotData {
    date: number;
    count: number;
}

export interface DashboardStatistics {
    apps: {
        owner: number;
        all: number;
    },
    incidents: number;
}