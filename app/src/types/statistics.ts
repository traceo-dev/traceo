import { IncidentStatus, IncidentStatusSearch } from "./incidents";

export interface AppIncidentsStats {
  lastWeekCount: number;
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

export interface PieData {
  name: string;
  value: number;
  status: IncidentStatusSearch;
  id: string;
}
