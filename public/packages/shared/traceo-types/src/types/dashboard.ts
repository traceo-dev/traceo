import { METRIC_UNIT, IMetricSerie, IMetricOptions } from "./metrics";

export interface Dashboard {
    id: string;
    createdAt?: number;
    name: string;
    projectId?: string;
    panels: DashboardPanel[];

    // base dashboard created for project
    isBase: boolean;
    isEditable: boolean;
}

export interface PanelGridPosition {
    x: number;
    y: number;
    h: number;
    w: number;
}

export interface PanelConfiguration {
    unit: METRIC_UNIT | string;
    series: IMetricSerie[];
    options: IMetricOptions;
}

export enum PANEL_TYPE {
    TIME_SERIES = "time_series",
    HISTOGRAM = "histogram",
    GAUGE = "gauge",
    TABLE = "table"
};

export interface DashboardPanel {
    id?: string;
    createdAt?: number;

    title: string;
    description: string;
    type: PANEL_TYPE;

    // position for react-grid-layout
    gridPosition: PanelGridPosition;

    // panel configuration
    config: PanelConfiguration;

    dashboard: Dashboard;
}
