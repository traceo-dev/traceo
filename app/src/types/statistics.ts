export interface ApplicationStats {
  total: {
    incidentsCount: number;
    errorsCount: number;
    lastWeek: number;
    percentage: string;
    isMore: boolean;
  };
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
