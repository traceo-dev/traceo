import { IncidentStatus } from "../enums/incident.enum";

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

export interface PieData {
    name: string;
    value: number;
    status: IncidentStatus;
    id: string;
}