export interface AppStats {
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

export interface HourlyStats {
    date: number;
    count: number;
}

export interface PlotData {
    date: number;
    count: number;
}

export interface DashboardStats {
    apps: {
        owner: number;
        all: number;
    },
    incidents: number;
}