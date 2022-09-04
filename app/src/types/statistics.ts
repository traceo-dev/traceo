export interface ApplicationStats {
  total: {
    incidentsCount: number;
    incidentsOccurCount: number;
    lastWeek: number;
    percentage: string;
    isMore: boolean;
  };
  release: {
    version: string;
    incidentsCount: number;
    incidentsOccurCount: number;
  };
}

export interface HourlyStats {
  date: number;
  count: number;
}

export interface DailyStats {
  count: number;
  data: HourlyStats[];
}

export interface DashboardStats {
  apps: {
    owner: number;
    all: number;
  };
  incidents: number;
}
