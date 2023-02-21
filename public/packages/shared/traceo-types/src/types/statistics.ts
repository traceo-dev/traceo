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

export interface HourlyStats {
  id?: string;
  date: number;
  count: number;
}

export interface DailyStats {
  count: number;
  data: HourlyStats[];
  id?: string;
}
