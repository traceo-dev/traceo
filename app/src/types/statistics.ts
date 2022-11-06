export interface AppIncidentsStats {
  lastWeekCount: number;
}

export interface HourlyStats {
  date: number;
  count: number;
  id?: string;
}

export interface DailyStats {
  count: number;
  data: HourlyStats[];
  id?: string;
}

export interface DashboardStats {
  apps: {
    owner: number;
    all: number;
  };
  incidents: number;
}
