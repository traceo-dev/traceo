export interface AppIncidentsStats {
    lastWeekCount: number;
}

export interface DailyOverview {
    count: number;
    data: PlotData[];
}

export interface PlotData {
    date: any;
    count: number;
}
